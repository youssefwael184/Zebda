// ============================================================
// src/middleware/auth.js
// Protects routes — extracts & verifies Bearer JWT
// ============================================================

const { verifyAccessToken } = require('../config/jwt');
const { createError } = require('../utils/error');

/**
 * Attach req.user = { id, username } when a valid Bearer token is present.
 * Throws 401 otherwise.
 */
const authenticate = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(createError(401, 'No token provided'));
  }

  const token = header.slice(7);

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createError(401, 'Token expired'));
    }
    return next(createError(401, 'Invalid token'));
  }
};

module.exports = { authenticate };
