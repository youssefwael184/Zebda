// ============================================================
// src/services/user.service.js
// User profile, stats, and leaderboard.
// ============================================================

const prisma = require('../config/database');
const { createError } = require('../utils/error');

// ─── getProfile ──────────────────────────────────────────────

/** Return the authenticated user's full profile. */
const getProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      avatarColor: true,
      rating: true,
      wins: true,
      losses: true,
      games: true,
      streak: true,
      bestStreak: true,
      createdAt: true,
    },
  });

  if (!user) throw createError(404, 'User not found');

  const winRate =
    user.games > 0 ? Math.round((user.wins / user.games) * 100) : 0;

  return { ...user, winRate };
};

// ─── getLeaderboard ──────────────────────────────────────────

/**
 * Top-N users ranked by rating.
 * @param {number} limit  Default 50
 */
const getLeaderboard = async (limit = 50) => {
  const users = await prisma.user.findMany({
    orderBy: { rating: 'desc' },
    take: limit,
    select: {
      id: true,
      username: true,
      avatarColor: true,
      rating: true,
      wins: true,
      losses: true,
      games: true,
      streak: true,
      bestStreak: true,
    },
  });

  return users.map((u, i) => ({
    rank: i + 1,
    ...u,
    winRate: u.games > 0 ? Math.round((u.wins / u.games) * 100) : 0,
  }));
};

// ─── getGameHistory ──────────────────────────────────────────

/** Last N completed sessions for the authenticated user. */
const getGameHistory = async (userId, limit = 20) => {
  const sessions = await prisma.gameSession.findMany({
    where: { userId, status: { in: ['WON', 'LOST'] } },
    orderBy: { finishedAt: 'desc' },
    take: limit,
    select: {
      id: true,
      status: true,
      difficulty: true,
      wrong: true,
      ratingBefore: true,
      ratingAfter: true,
      startedAt: true,
      finishedAt: true,
      player: { select: { name: true } },
    },
  });

  return sessions.map((s) => ({
    id: s.id,
    outcome: s.status,
    difficulty: s.difficulty,
    wrongGuesses: s.wrong.length,
    playerName: s.player.name,
    ratingBefore: s.ratingBefore,
    ratingAfter: s.ratingAfter,
    ratingDelta: s.ratingAfter ? s.ratingAfter - s.ratingBefore : null,
    startedAt: s.startedAt,
    finishedAt: s.finishedAt,
  }));
};

module.exports = { getProfile, getLeaderboard, getGameHistory };
