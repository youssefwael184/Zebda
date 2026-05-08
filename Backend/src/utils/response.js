// ============================================================
// src/utils/response.js
// Consistent JSON response helpers
// ============================================================

const ok = (res, data = {}, status = 200) =>
  res.status(status).json({ success: true, ...data });

const created = (res, data = {}) => ok(res, data, 201);

module.exports = { ok, created };
