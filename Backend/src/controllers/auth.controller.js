// ============================================================
// src/controllers/auth.controller.js
// Thin controllers — delegate all logic to auth.service.js
// ============================================================

const authService = require('../services/auth.service');
const { ok, created } = require('../utils/response');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.register({ username, email, password });
    created(res, {
      message: 'Account created successfully',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login({ username, password });
    ok(res, {
      message: 'Login successful',
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    ok(res, {
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) await authService.logout(refreshToken);
    ok(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/logout-all  (protected)
const logoutAll = async (req, res, next) => {
  try {
    await authService.logoutAll(req.user.id);
    ok(res, { message: 'Logged out from all devices' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, logout, logoutAll };
