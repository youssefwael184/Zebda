/**
 * @module useStore
 * @description Global state management (Zustand).
 *
 * This store is a thin coordinator — all business logic lives in services.
 *
 * Architecture changes from the localStorage version:
 *  - AuthService, GameService, UserService now talk to the real REST API
 *  - UserRepository is gone — the backend DB is the repository
 *  - Seed data is gone — the backend seeds via prisma/seed.js
 *  - Token storage lives in api.js (tokenStorage) — store only holds user object
 *  - Listens for the 'gg:session-expired' window event emitted by the Axios
 *    interceptor to auto-logout when the refresh token is also expired
 *
 * SOLID Principles:
 *  S — Single Responsibility : state coordination only (no business logic)
 *  D — Dependency Inversion  : depends on service abstractions, not implementations
 */

import { create } from 'zustand';
import { persist }  from 'zustand/middleware';
import AuthService  from '../services/AuthService';
import GameService  from '../services/GameService';
import UserService  from '../services/UserService';
import { tokenStorage } from '../services/api';

// ─── Empty game state ─────────────────────────────────────────────────────────

const EMPTY_GAME = {
  sessionId:        null,
  word:             '',
  maskedWord:       '',
  guessed:          [],
  wrong:            [],
  hints:            [],
  difficulty:       'easy',
  status:           'idle',
  player:           null,
  ratingDelta:      0,
  wrongCount:       0,
  maxWrong:         6,
  lastGuessCorrect: null,
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useStore = create(
  persist(
    (set, get) => ({
      // ── State ──────────────────────────────────────────────────────────────
      currentUser:  null,
      authError:    '',
      authSuccess:  '',
      authLoading:  false,
      gameState:    EMPTY_GAME,
      gameLoading:  false,
      gameError:    '',
      leaderboard:  [],

      // ── Session expiry (fired by Axios interceptor) ────────────────────────
      _initSessionListener() {
        window.addEventListener('gg:session-expired', () => {
          set({ currentUser: null, gameState: EMPTY_GAME });
        });
      },

      // ── Auth ───────────────────────────────────────────────────────────────

      /**
       * Register a new account.
       * @returns {boolean} success
       */
      async register(username, email, password) {
        set({ authLoading: true, authError: '', authSuccess: '' });
        const result = await AuthService.register({ username, email, password });
        if (!result.success) {
          set({ authError: result.error, authLoading: false });
          return false;
        }
        set({
          currentUser: result.data,
          authSuccess: 'Account created! Welcome aboard 🚀',
          authLoading: false,
        });
        return true;
      },

      /**
       * Login with username + password.
       * @returns {boolean} success
       */
      async login(username, password) {
        set({ authLoading: true, authError: '', authSuccess: '' });
        const result = await AuthService.login({ username, password });
        if (!result.success) {
          set({ authError: result.error, authLoading: false });
          return false;
        }
        set({ currentUser: result.data, authLoading: false });
        return true;
      },

      /**
       * Logout from this device.
       */
      async logout() {
        await AuthService.logout();
        set({ currentUser: null, gameState: EMPTY_GAME });
      },

      clearAuthMessages() {
        set({ authError: '', authSuccess: '' });
      },

      // ── Game ───────────────────────────────────────────────────────────────

      /**
       * Start a new game session.
       * The server picks the correct difficulty based on the user's rating.
       */
      async startNewGame() {
        set({ gameLoading: true, gameError: '' });
        const result = await GameService.startGame();
        if (!result.success) {
          set({ gameError: result.error, gameLoading: false });
          return;
        }
        set({ gameState: result.data, gameLoading: false });
      },

      /**
       * Submit a letter guess.
       * @param {string} letter  Single A-Z character
       */
      async guessLetter(letter) {
        const { gameState } = get();
        if (gameState.status !== 'playing') return;

        set({ gameLoading: true });
        const result = await GameService.guessLetter(letter);
        if (!result.success) {
          set({ gameError: result.error, gameLoading: false });
          return;
        }

        const newGameState = result.data;

        // Refresh user profile from server when game ends (rating updated server-side)
        if (newGameState.status === 'won' || newGameState.status === 'lost') {
          const profileResult = await UserService.getProfile();
          if (profileResult.success) {
            set({ currentUser: profileResult.data });
          }
        }

        set({ gameState: newGameState, gameLoading: false });
      },

      /**
       * Reconnect to an existing session (page refresh / navigation back).
       * Useful so the user does not lose their game.
       */
      async reconnectSession() {
        const result = await GameService.getActiveSession();
        if (result.success && result.data) {
          set({ gameState: result.data });
        }
      },

      /**
       * Dismiss win/loss overlay → return to idle so the next startNewGame works.
       */
      dismissOverlay() {
        set((s) => ({ gameState: { ...s.gameState, status: 'idle' } }));
      },

      // ── Leaderboard ────────────────────────────────────────────────────────

      /**
       * Load the leaderboard from the server.
       */
      async loadLeaderboard(limit = 50) {
        const result = await UserService.getLeaderboard(limit);
        if (result.success) {
          set({ leaderboard: result.data });
        }
      },

      /**
       * Synchronous getter kept for backward compatibility with DashboardPage.
       * Use loadLeaderboard() to refresh from the API first.
       */
      getLeaderboard() {
        return get().leaderboard;
      },
    }),
    {
      name: 'gg-session',
      // Only persist the user object — tokens live in tokenStorage (localStorage)
      partialize: (state) => ({ currentUser: state.currentUser }),
      // On rehydrate, verify the persisted user still has a valid token
      onRehydrateStorage: () => (state) => {
        if (state?.currentUser && !tokenStorage.getAccess()) {
          // Token gone (e.g. user cleared storage) → force re-login
          state.currentUser = null;
        }
        state?._initSessionListener?.();
      },
    }
  )
);
