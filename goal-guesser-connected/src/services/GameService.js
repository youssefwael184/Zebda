import api from "./api";
import GameEventBus, { GAME_EVENTS } from "../patterns/GameEventBus";

function ok(data) {
  return { success: true, data, error: null };
}
function fail(error) {
  return { success: false, data: null, error };
}
function extractError(err) {
  return err?.response?.data?.message || err?.message || "Something went wrong";
}

const toFrontendState = (raw) => {
  if (!raw?.sessionId) return null;
  return {
    sessionId: raw.sessionId,
    word: raw.word ?? "",
    maskedWord: raw.maskedWord ?? "",
    guessed: raw.guessed ?? [],
    wrong: raw.wrong ?? [],
    hints: raw.hints ?? [],
    difficulty: (raw.difficulty ?? "easy").toLowerCase(),
    status: (raw.status ?? "idle").toLowerCase(),
    player: raw.player ?? null,
    ratingDelta: raw.ratingDelta ?? 0,
    wrongCount: raw.wrongCount ?? 0,
    maxWrong: raw.maxWrong ?? 6,
    lastGuessCorrect: raw.lastGuessCorrect ?? null,
  };
};

const GameService = {
  async startGame() {
    try {
      const { data } = await api.post("/games/start");
      // data = { success: true, sessionId: ..., status: ..., ... }
      const gameState = toFrontendState(data);
      if (!gameState) return fail("Invalid session from server");
      GameEventBus.emit(GAME_EVENTS.GAME_STARTED, {
        difficulty: gameState.difficulty,
      });
      return ok(gameState);
    } catch (err) {
      return fail(extractError(err));
    }
  },

  async guessLetter(letter) {
    try {
      const { data } = await api.post("/games/guess", { letter });
      const gameState = toFrontendState(data);
      if (!gameState) return fail("Invalid session from server");

      if (gameState.lastGuessCorrect === true)
        GameEventBus.emit(GAME_EVENTS.LETTER_CORRECT, { letter });
      else if (gameState.lastGuessCorrect === false)
        GameEventBus.emit(GAME_EVENTS.LETTER_WRONG, { letter });

      if (gameState.status === "won") {
        GameEventBus.emit(GAME_EVENTS.GAME_WON, {
          player: gameState.player,
          ratingDelta: gameState.ratingDelta,
        });
        GameEventBus.emit(GAME_EVENTS.RATING_CHANGED, {
          delta: gameState.ratingDelta,
        });
      }
      if (gameState.status === "lost") {
        GameEventBus.emit(GAME_EVENTS.GAME_LOST, {
          player: gameState.player,
          ratingDelta: gameState.ratingDelta,
        });
        GameEventBus.emit(GAME_EVENTS.RATING_CHANGED, {
          delta: gameState.ratingDelta,
        });
      }

      return ok(gameState);
    } catch (err) {
      return fail(extractError(err));
    }
  },

  async getActiveSession() {
    try {
      const { data } = await api.get("/games/session");
      return ok(data?.sessionId ? toFrontendState(data) : null);
    } catch (err) {
      if (err?.response?.status === 404) return ok(null);
      return fail(extractError(err));
    }
  },
};

export default GameService;
