// ============================================================
// src/config/jwt.js
// Centralised JWT helpers — sign & verify access + refresh tokens
// ============================================================

const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_EXPIRES = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Sign an access token for a given user payload.
 * @param {{ id: string, username: string }} payload
 */
const signAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES });

/**
 * Sign a refresh token.
 * @param {{ id: string }} payload
 */
const signRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES });

/**
 * Verify an access token. Returns decoded payload or throws.
 */
const verifyAccessToken = (token) => jwt.verify(token, ACCESS_SECRET);

/**
 * Verify a refresh token. Returns decoded payload or throws.
 */
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

/**
 * Parse a duration string like "7d", "15m" into milliseconds.
 */
const parseDurationMs = (str) => {
  const map = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  const match = str.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error(`Invalid duration string: ${str}`);
  return parseInt(match[1]) * map[match[2]];
};

const REFRESH_EXPIRES_MS = parseDurationMs(REFRESH_EXPIRES);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  REFRESH_EXPIRES_MS,
};
