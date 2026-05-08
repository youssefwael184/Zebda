// ============================================================
// src/routes/auth.routes.js
// ============================================================

const { Router } = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

const router = Router();
/**
 
@swagger
/auth/login:
post:
summary: Login user
tags:
Auth
responses:
200:
description: Login success*/
// Apply strict rate-limiting to all auth endpoints
router.use(authLimiter);

// ── POST /api/auth/register ──────────────────────────────────
router.post(
  '/register',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 20 })
      .withMessage('Username must be 3–20 characters')
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage('Username may only contain letters, numbers, and underscores'),
    body('email')
      .optional({ checkFalsy: true })
      .isEmail()
      .withMessage('Must be a valid email address')
      .normalizeEmail(),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validate,
  authController.register
);

// ── POST /api/auth/login ─────────────────────────────────────
router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  authController.login
);

// ── POST /api/auth/refresh ───────────────────────────────────
router.post(
  '/refresh',
  [body('refreshToken').notEmpty().withMessage('Refresh token is required')],
  validate,
  authController.refresh
);

// ── POST /api/auth/logout ────────────────────────────────────
router.post('/logout', authController.logout);

// ── POST /api/auth/logout-all  (requires valid access token) ─
router.post('/logout-all', authenticate, authController.logoutAll);

module.exports = router;
