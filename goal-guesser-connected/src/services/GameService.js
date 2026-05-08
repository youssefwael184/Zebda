/**
 * @module GameService
 * @description Game service layer — wraps /games/* API endpoints.
 *
 * SOLID Principles:
 *  S — Single Responsibility : only game API calls
 *  O — Open/Closed           : add new game actions without changing existing ones
 *  D — Dependency Inversion  : depends on `api` abstraction
 *
 * The backend is now the single source of truth for game state.
 * The frontend no longer runs any rating/word logic — it just renders
 * what the server returns.
 *
 * Also emits GameEventBus events so UI components can react without
 * coupling to the store (Observer Pattern — unchanged from before).
 */

import api from './api';
import GameEventBus, { GAME_EVENTS } from '../patterns/GameEventBus';

// ─── Result helpers ───────────────────────────────────────────────────────────

function ok(data)    { return { success: true,  data,  error: null }; }
function fail(error) { return { success: false, data: null, error }; }

function extractError(err) {
  return (
    err?.response?.data?.message ||
    err?.message                 ||
    'Something went wrong'
  );
}

// ─── Adapter — maps backend session shape → frontend gameState shape ──────────
//
// The backend speaks UPPER_CASE difficulty ('EASY', 'MEDIUM', …) and returns
// a maskedWord string with spaces between chars.  The frontend was built with
// lower-case difficulty and a plain word string.  This adapter sits at the
// boundary so neither side has to change.

const toFrontendState = (session) => ({
  sessionId:        session.sessionId,
  // Backend maskedWord: "_ _ S _ _"  → strip spaces → "_S__"
  word:             session.maskedWord?.replace(/ /g, '') ?? '',
  maskedWord:       session.maskedWord ?? '',
  guessed:          session.guessed   ?? [],
  wrong:            session.wrong     ?? [],
  hints:            session.hints     ?? [],
  difficulty:       (session.difficulty ?? 'EASY').toLowerCase(),
  status:           (session.status   ?? 'idle').toLowerCase(),
  player:           session.player    ?? null,
  ratingDelta:      session.ratingDelta ?? 0,
  wrongCount:       session.wrongCount  ?? 0,
  maxWrong:         session.maxWrong    ?? 6,
  lastGuessCorrect: session.lastGuessCorrect ?? null,
});

// ─── Service ──────────────────────────────────────────────────────────────────

const GameService = {
  /**
   * Start a new game session.
   * The server picks the right difficulty for the user's current rating.
   * @returns {Result<GameState>}
   */
  async startGame() {
    try {
      const { data } = await api.post('/games/start');
      const gameState = toFrontendState(data.session);
      GameEventBus.emit(GAME_EVENTS.GAME_STARTED, { difficulty: gameState.difficulty });
      return ok(gameState);
    } catch (err) {
      return fail(extractError(err));
    }
  },

  /**
   * Submit a letter guess.
   * Returns updated game state including terminal outcome if won/lost.
   * @param {string} letter  Single A-Z character
   * @returns {Result<GameState>}
   */
  async guessLetter(letter) {
    try {
      const { data } = await api.post('/games/guess', { letter });
      const gameState = toFrontendState(data.session);

      // ── Emit Observer events so components can animate/react independently ──
      if (gameState.lastGuessCorrect === true) {
        GameEventBus.emit(GAME_EVENTS.LETTER_CORRECT, { letter });
      } else if (gameState.lastGuessCorrect === false) {
        GameEventBus.emit(GAME_EVENTS.LETTER_WRONG, { letter });
      }

      if (gameState.status === 'won') {
        GameEventBus.emit(GAME_EVENTS.GAME_WON, {
          player:      gameState.player,
          ratingDelta: gameState.ratingDelta,
          streak:      gameState.streak,
        });
        GameEventBus.emit(GAME_EVENTS.RATING_CHANGED, { delta: gameState.ratingDelta });
      }

      if (gameState.status === 'lost') {
        GameEventBus.emit(GAME_EVENTS.GAME_LOST, {
          player:      gameState.player,
          ratingDelta: gameState.ratingDelta,
        });
        GameEventBus.emit(GAME_EVENTS.RATING_CHANGED, { delta: gameState.ratingDelta });
      }

      return ok(gameState);
    } catch (err) {
      return fail(extractError(err));
    }
  },

  /**
   * Fetch the current active session (for reconnect / page refresh).
   * Returns null in data if no game is in progress.
   * @returns {Result<GameState|null>}
   */
  async getActiveSession() {
    try {
      const { data } = await api.get('/games/session');
      const session = data.session;
      return ok(session ? toFrontendState(session) : null);
    } catch (err) {
      return fail(extractError(err));
    }
  },
};

export default GameService;
