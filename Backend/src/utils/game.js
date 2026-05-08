// ============================================================
// src/utils/game.js
// Pure game-logic helpers (easy to unit-test)
// ============================================================

const { HINT_FIELDS, RATING_DELTA, MIN_RATING, AVATAR_COLORS } = require('../config/constants');

// ─── Word masking ─────────────────────────────────────────────

/**
 * Build the initial masked display for a player name.
 * Letters → "_",  spaces → " ",  hyphens/apostrophes kept as-is.
 *
 * e.g. "Kylian Mbappe" → "_ _ _ _ _ _   _ _ _ _ _ _"
 * (each letter becomes "_", spaces between underscores within words,
 *  actual word boundaries become "   " (3 spaces))
 */
const buildMaskedWord = (name) =>
  name
    .split('')
    .map((ch) => (/[a-zA-Z]/.test(ch) ? '_' : ch))
    .join(' ')
    .replace(/  /g, '  '); // keep double-space as word gap

/**
 * Reveal positions of a guessed letter in the masked word.
 * Returns updated maskedWord string.
 *
 * @param {string} playerName  Original player name
 * @param {string} maskedWord  Current masked word state
 * @param {string} letter      Single uppercase letter
 */
const revealLetter = (playerName, maskedWord, letter) => {
  const nameChars = playerName.split('');
  return nameChars
    .map((ch) => (ch.toUpperCase() === letter.toUpperCase() ? ch : /[a-zA-Z]/.test(ch) ? '_' : ch))
    .join(' ')
    .replace(/  /g, '  ');
};

/**
 * Check if the entire name has been revealed (no "_" remaining).
 */
const isWordComplete = (maskedWord) => !!maskedWord && !maskedWord.includes('_');
// ─── Hints ───────────────────────────────────────────────────

/**
 * Build the ordered hint array for a player.
 * Returns array of { label, value } objects — index = hint number (0-based).
 *
 * @param {Object} player  Prisma Player record
 */
const buildHints = (player) =>
  HINT_FIELDS.map((field) => {
    const labels = {
      nationality: '🌍 Nationality',
      position: '⚽ Position',
      club: '🏟️ Club',
      league: '🏆 League',
      age: '📅 Age',
      jerseyNumber: '🎽 Jersey Number',
    };
    return { label: labels[field], value: String(player[field]) };
  });

/**
 * Return only the hints that should be visible given wrongCount.
 * wrongCount 0 → no hints shown yet
 * wrongCount 1 → hint[0] revealed, etc.
 */
const getVisibleHints = (player, wrongCount) =>
  buildHints(player).slice(0, wrongCount);

// ─── Difficulty mapping ──────────────────────────────────────

/**
 * Determine which Difficulty tier to use for a given rating.
 * Mirrors DIFFICULTY_RATING in constants.js.
 */
const ratingToDifficulty = (rating) => {
  if (rating < 1200) return 'EASY';
  if (rating < 1500) return 'MEDIUM';
  if (rating < 1800) return 'HARD';
  return 'LEGEND';
};

// ─── Rating engine ───────────────────────────────────────────

/**
 * Calculate new rating after a game.
 * @param {number} currentRating
 * @param {'WON'|'LOST'} outcome
 * @param {string} difficulty  'EASY'|'MEDIUM'|'HARD'|'LEGEND'
 */
const calcNewRating = (currentRating, outcome, difficulty) => {
  const delta =
    outcome === 'WON'
      ? RATING_DELTA.WIN[difficulty]
      : RATING_DELTA.LOSE[difficulty];

  return Math.max(MIN_RATING, currentRating + delta);
};

// ─── Avatar ──────────────────────────────────────────────────

/** Pick a deterministic avatar colour from username. */
const pickAvatarColor = (username) =>
  AVATAR_COLORS[
    username.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0) %
      AVATAR_COLORS.length
  ];

module.exports = {
  buildMaskedWord,
  revealLetter,
  isWordComplete,
  buildHints,
  getVisibleHints,
  ratingToDifficulty,
  calcNewRating,
  pickAvatarColor,
};

const _formatSession = (session, player, hintsRevealed, lastGuessCorrect, status) => {
  const currentStatus = status || session.status;

  return {
    sessionId: session.id,
    status: currentStatus,
    difficulty: session.difficulty,
    maskedWord: session.maskedWord,
    guessed: session.guessed,
    wrong: session.wrong,
    // ✅ Always send all hints — frontend decides what to show
    hints: buildHints(player),
    // ✅ Always send player name and info
    player: {
      name: player.name,
      nationality: player.nationality,
      position: player.position,
      club: player.club,
      league: player.league,
      age: player.age,
      jerseyNumber: player.jerseyNumber,
    },
    wrongCount: session.wrong.length,
    maxWrong: MAX_WRONG,
    lastGuessCorrect: lastGuessCorrect ?? null,
    ratingDelta: session.ratingDelta ?? 0,
  };
};
