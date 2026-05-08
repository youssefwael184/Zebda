const gameService = require("../services/game.service");
const { ok } = require("../utils/response");

// POST /api/game/start
const startGame = async (req, res, next) => {
  try {
    const session = await gameService.startGame(req.user.id);
    ok(res, session); // ✅ مش { session }
  } catch (err) {
    next(err);
  }
};

// POST /api/game/guess
const guessLetter = async (req, res, next) => {
  try {
    const { letter } = req.body;
    const session = await gameService.guessLetter(req.user.id, letter);
    ok(res, session); // ✅ مش { session }
  } catch (err) {
    next(err);
  }
};

// GET /api/game/session
const getSession = async (req, res, next) => {
  try {
    const session = await gameService.getActiveSession(req.user.id);
    ok(res, session); // ✅ مش { session }
  } catch (err) {
    next(err);
  }
};

module.exports = { startGame, guessLetter, getSession };
