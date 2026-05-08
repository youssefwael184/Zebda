// ============================================================
// src/services/auth.service.js
// All authentication business logic lives here.
// Controllers stay thin — they only call service methods.
// ============================================================

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = require('../config/database');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  REFRESH_EXPIRES_MS,
} = require('../config/jwt');
const { createError } = require('../utils/error');
const { pickAvatarColor } = require('../utils/game');

const BCRYPT_ROUNDS = 12;

// ─── register ────────────────────────────────────────────────

/**
 * Create a new user account.
 * @returns {{ user, accessToken, refreshToken }}
 */
const register = async ({ username, email, password }) => {
  // 1. Check uniqueness
  const existing = await prisma.user.findFirst({
  where: {
    OR: [
      { username: username.toLowerCase() },
      { email: email.toLowerCase() }
    ]
  }
});

  if (existing) {
    const field = existing.username.toLowerCase() === username.toLowerCase()
      ? 'Username'
      : 'Email';
    throw createError(409, `${field} is already taken`);
  }

  // 2. Hash password
  const hashed = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // 3. Create user
  const user = await prisma.user.create({
    data: {
      username,
      email: email || null,
      password: hashed,
      avatarColor: pickAvatarColor(username),
    },
    select: _safeUserSelect(),
  });

  // 4. Issue tokens
  const { accessToken, refreshToken } = await _issueTokens(user.id, user.username);

  return { user, accessToken, refreshToken };
};

// ─── login ───────────────────────────────────────────────────

/**
 * Authenticate with username + password.
 * @returns {{ user, accessToken, refreshToken }}
 */
const login = async ({ username, password }) => {
  const user = await prisma.user.findFirst({
  where: {
    username: username,
  },
});
  if (!user) throw createError(401, 'Invalid username or password');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw createError(401, 'Invalid username or password');

  const { accessToken, refreshToken } = await _issueTokens(user.id, user.username);

  // Return user without password
  const { password: _pw, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
};

// ─── refresh ─────────────────────────────────────────────────

/**
 * Exchange a valid refresh token for a new access token.
 * Implements refresh-token rotation — old token is deleted, new one issued.
 */
const refresh = async (rawRefreshToken) => {
  // 1. Verify JWT signature & expiry
  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw createError(401, 'Invalid or expired refresh token');
  }

  // 2. Check token exists in DB (not already revoked)
  const stored = await prisma.refreshToken.findUnique({
    where: { token: rawRefreshToken },
  });

  if (!stored || stored.expiresAt < new Date()) {
    throw createError(401, 'Refresh token revoked or expired');
  }

  // 3. Rotation — delete old, issue new pair
  await prisma.refreshToken.delete({ where: { id: stored.id } });

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: _safeUserSelect(),
  });

  if (!user) throw createError(401, 'User not found');

  const tokens = await _issueTokens(user.id, user.username);
  return { user, ...tokens };
};

// ─── logout ──────────────────────────────────────────────────

/** Revoke a specific refresh token (logout from one device). */
const logout = async (rawRefreshToken) => {
  await prisma.refreshToken.deleteMany({ where: { token: rawRefreshToken } });
};

/** Revoke ALL refresh tokens for a user (logout everywhere). */
const logoutAll = async (userId) => {
  await prisma.refreshToken.deleteMany({ where: { userId } });
};

// ─── Helpers ─────────────────────────────────────────────────

/** Persist a refresh token and return both signed tokens. */
const _issueTokens = async (userId, username) => {
  const accessToken = signAccessToken({ id: userId, username });
  const refreshToken = signRefreshToken({ id: userId });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt: new Date(Date.now() + REFRESH_EXPIRES_MS),
    },
  });

  return { accessToken, refreshToken };
};

/** Prisma select clause that never returns the password field. */
const _safeUserSelect = () => ({
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
});

module.exports = { register, login, refresh, logout, logoutAll };
