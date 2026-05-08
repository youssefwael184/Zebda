// ============================================================
// src/services/game.service.js
// All game-session logic — start, guess, resolve.
// ============================================================

const prisma = require("../config/database");
const { createError } = require("../utils/error");
const { MAX_WRONG } = require("../config/constants");
const {
  buildMaskedWord,
  revealLetter,
  isWordComplete,
  buildHints,
  ratingToDifficulty,
  calcNewRating,
} = require("../utils/game");

// ─── startGame ───────────────────────────────────────────────

/**
 * Start a new game session for the authenticated user.
 * - Resolves any existing PLAYING session as LOST first.
 * - Picks a player matched to the user's rating tier.
 * - Returns masked word + full player info + all hints upfront.
 */
const startGame = async (userId) => {
  // 1. Load user
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw createError(404, "User not found");

  // 2. Abandon any open session (don't penalise — player navigated away)
  await prisma.gameSession.updateMany({
    where: { userId, status: "PLAYING" },
    data: { status: "LOST", finishedAt: new Date() },
  });

  // 3. Pick difficulty tier for this user
  const difficulty = ratingToDifficulty(user.rating);

  // 4. Pick a random player at that difficulty
  //    Exclude players seen in the last 20 sessions to avoid repeats
  const recentIds = (
    await prisma.gameSession.findMany({
      where: { userId },
      orderBy: { startedAt: "desc" },
      take: 20,
      select: { playerId: true },
    })
  ).map((s) => s.playerId);

  // Fall back to any player of that difficulty if we've seen them all
  const playerInclude = {
    hints: { orderBy: { order: "asc" } },
  };

  const eligible = await prisma.player.findMany({
    where: { difficulty, active: true, id: { notIn: recentIds } },
    include: playerInclude,
  });

  const pool =
    eligible.length > 0
      ? eligible
      : await prisma.player.findMany({
          where: { difficulty, active: true },
          include: playerInclude,
        });
  if (!pool.length)
    throw createError(503, "No players available for this difficulty");

  const player = pool[Math.floor(Math.random() * pool.length)];

  // 5. Create session
  const session = await prisma.gameSession.create({
    data: {
      userId,
      playerId: player.id,
      maskedWord: buildMaskedWord(player.name),
      difficulty,
      ratingBefore: user.rating,
    },
  });
  console.log("player.hints:", player.hints);
  console.log("session:", session);
  return _formatSession(session, player, null, null, "PLAYING");
};

// ─── guessLetter ─────────────────────────────────────────────

/**
 * Process a single letter guess.
 * @param {string} userId
 * @param {string} letter  Single A-Z character (validated upstream)
 * @returns {Object}  Updated session state
 */
const guessLetter = async (userId, letter) => {
  const upper = letter.toUpperCase();

  // 1. Find active session
  const session = await _getActiveSession(userId);
  const player = session.player;

  // 2. Guard: letter already guessed
  if (session.guessed.includes(upper) || session.wrong.includes(upper)) {
    throw createError(400, "Letter already guessed");
  }

  const isCorrect = player.name.toUpperCase().includes(upper);

  let updatedGuessed = [...session.guessed];
  let updatedWrong = [...session.wrong];
  let updatedMasked = session.maskedWord;

  if (isCorrect) {
    updatedGuessed.push(upper);
    updatedMasked = revealLetter(player.name, updatedMasked, upper);
  } else {
    updatedWrong.push(upper);
  }

  // 3. Check terminal conditions
  const won = isWordComplete(updatedMasked);
  const lost = updatedWrong.length >= MAX_WRONG;
  const status = won ? "WON" : lost ? "LOST" : "PLAYING";

  // 4. Persist updated session
  const updated = await prisma.gameSession.update({
    where: { id: session.id },
    data: {
      guessed: updatedGuessed,
      wrong: updatedWrong,
      maskedWord: updatedMasked,
      status,
      ...(status !== "PLAYING" && { finishedAt: new Date() }),
    },
    include: { player: { include: { hints: { orderBy: { order: "asc" } } } } },
  });

  // 5. If game over, update user stats & rating
  let ratingDelta = 0;
  if (status !== "PLAYING") {
    const updatedUser = await _resolveUser(
      userId,
      status,
      session.difficulty,
      session.ratingBefore,
      updated,
    );
    ratingDelta = updatedUser.rating - session.ratingBefore;
  }

  return _formatSession(
    updated,
    updated.player,
    isCorrect,
    status,
    ratingDelta,
  );
};

// ─── getActiveSession ─────────────────────────────────────────

/** Return current PLAYING session state (for reconnect / page refresh). */
const getActiveSession = async (userId) => {
  const session = await prisma.gameSession.findFirst({
    where: { userId, status: "PLAYING" },
    include: {
      player: { include: { hints: { orderBy: { order: "asc" } } } },
    },
    orderBy: { startedAt: "desc" },
  });

  if (!session) return null;

  const normalised = _normaliseSession(session);
  return _formatSession(normalised, normalised.player, null, normalised.status);
};

// ─── Private helpers ─────────────────────────────────────────

const _getActiveSession = async (userId) => {
  const session = await prisma.gameSession.findFirst({
    where: { userId, status: "PLAYING" },
    include: {
      player: { include: { hints: { orderBy: { order: "asc" } } } },
    },
    orderBy: { startedAt: "desc" },
  });
  if (!session)
    throw createError(404, "No active game session. Start a new game.");
  return _normaliseSession(session);
};

/**
 * Update user rating, win/loss counters, and streak after a session ends.
 * Returns the updated user so the caller can compute ratingDelta.
 */
const _resolveUser = async (
  userId,
  outcome,
  difficulty,
  ratingBefore,
  session,
) => {
  const newRating = calcNewRating(ratingBefore, outcome, difficulty);

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const isWin = outcome === "WON";
  const newStreak = isWin ? user.streak + 1 : 0;
  const newBestStreak = Math.max(user.bestStreak, newStreak);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      rating: newRating,
      wins: isWin ? { increment: 1 } : undefined,
      losses: !isWin ? { increment: 1 } : undefined,
      games: { increment: 1 },
      streak: newStreak,
      bestStreak: newBestStreak,
    },
  });

  // Persist rating snapshot on session
  await prisma.gameSession.update({
    where: { id: session.id },
    data: { ratingAfter: newRating },
  });

  return updatedUser;
};

/**
 * Shape the response object sent back to the client.
 *
 * Player info and ALL hints are always included — the frontend
 * controls hint visibility by slicing hints[0..wrongCount].
 * The masked word still hides letters while status === 'PLAYING',
 * so the player name cannot be inferred from the response alone.
 *
 * @param {Object}      session          Prisma GameSession record
 * @param {Object}      player           Prisma Player record
 * @param {boolean|null} lastGuessCorrect null on start/reconnect
 * @param {string}      status           'PLAYING' | 'WON' | 'LOST'
 * @param {number}      ratingDelta      0 while playing, signed int on game over
 */
const _formatSession = (
  session,
  player,
  lastGuessCorrect,
  status,
  ratingDelta = 0,
) => {
  const currentStatus = (status || session.status).toLowerCase(); // ✅ دايماً lowercase

  return {
    sessionId: session.id,
    status: currentStatus,
    difficulty: session.difficulty,
    maskedWord: session.maskedWord.replace(/ /g, ""),
    word: player.name, // ✅ الاسم الكامل دايماً موجود
    guessed: session.guessed,
    wrong: session.wrong,
    wrongCount: session.wrong.length,
    maxWrong: MAX_WRONG,
    lastGuessCorrect: lastGuessCorrect ?? null,
    ratingDelta,
    hints: buildHints(player),
    player: {
      name: player.name,
      nationality: player.nationality,
      position: player.position,
      club: player.club,
      league: player.league,
      age: player.age ?? null,
      jerseyNumber: player.jerseyNumber,
    },
  };
};
module.exports = { startGame, guessLetter, getActiveSession };

// MySQL returns Json fields as already-parsed objects or strings depending on
// the driver version — this normalises guessed/wrong to plain JS arrays.
const _normaliseSession = (session) => ({
  ...session,
  guessed: Array.isArray(session.guessed)
    ? session.guessed
    : JSON.parse(session.guessed ?? "[]"),
  wrong: Array.isArray(session.wrong)
    ? session.wrong
    : JSON.parse(session.wrong ?? "[]"),
});
