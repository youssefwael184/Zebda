// ============================================================
// src/middleware/errorHandler.js
// Central error handler — always returns clean JSON
// ============================================================

const errorHandler = (err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Never leak stack traces in production
  const body = {
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  res.status(status).json(body);
};

module.exports = { errorHandler };
