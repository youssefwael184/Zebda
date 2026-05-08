// ============================================================
// src/routes/user.routes.js
// ============================================================

const { Router } = require('express');

const userController = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();
/**
 
@swagger
/users:
get:
summary: Get all users
tags:
Users
responses:
200:
description: Success*/
// ── GET /api/users/leaderboard  (public) ─────────────────────
router.get('/leaderboard', userController.getLeaderboard);

// Protected routes below
router.use(authenticate);

// ── GET /api/users/me ────────────────────────────────────────
router.get('/me', userController.getProfile);

// ── GET /api/users/history ───────────────────────────────────
router.get('/history', userController.getGameHistory);

module.exports = router;
