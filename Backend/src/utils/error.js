// ============================================================
// src/utils/error.js
// ============================================================

/**
 * Create a plain Error with an HTTP status code attached.
 * @param {number} status  HTTP status code
 * @param {string} message Human-readable message
 */
const createError = (status, message) => {
  const err = new Error(message);
  err.status = status;
  return err;
};

module.exports = { createError };
