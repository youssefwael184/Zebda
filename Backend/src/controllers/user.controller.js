// ============================================================
// src/controllers/user.controller.js
// ============================================================

const userService = require('../services/user.service');
const { ok } = require('../utils/response');

// GET /api/users/me
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getProfile(req.user.id);
    ok(res, { user });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/leaderboard?limit=50
const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const users = await userService.getLeaderboard(limit);
    ok(res, { users });
  } catch (err) {
    next(err);
  }
};

// GET /api/users/history?limit=20
const getGameHistory = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const history = await userService.getGameHistory(req.user.id, limit);
    ok(res, { history });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, getLeaderboard, getGameHistory };
