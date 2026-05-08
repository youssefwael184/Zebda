// ============================================================
// src/server.js
// Entry point — loads env, starts Express, handles shutdown.
// ============================================================

require('dotenv').config();

const app = require('./app');
const prisma = require('./config/database');

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`\n⚽  Goal Guesser API`);
  console.log(`   Mode  : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port  : ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});

// ── Graceful shutdown ────────────────────────────────────────
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('✅ Database disconnected. Bye!\n');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  shutdown('unhandledRejection');
});
