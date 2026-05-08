// ============================================================
// src/routes/game.routes.js
// All game routes require authentication.
// ============================================================

const { Router } = require('express');
const { body } = require('express-validator');

const gameController = require('../controllers/game.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = Router();
/**
 
@swagger
/games:
get:
summary: Get all games
tags:
Games
responses:
200:
description: Success*/
// All game routes are protected
router.use(authenticate);

// ── POST /api/game/start ─────────────────────────────────────
router.post('/start', gameController.startGame);

// ── POST /api/game/guess ─────────────────────────────────────
router.post(
  '/guess',
  [
    body('letter')
      .isString()
      .isLength({ min: 1, max: 1 })
      .withMessage('Letter must be a single character')
      .matches(/^[a-zA-Z]$/)
      .withMessage('Letter must be A-Z'),
  ],
  validate,
  gameController.guessLetter
);

// ── GET /api/game/session ────────────────────────────────────
router.get('/session', gameController.getSession);

module.exports = router;
