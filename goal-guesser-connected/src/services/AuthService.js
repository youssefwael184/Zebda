/**
 * @module AuthService
 * @description Authentication service layer — wraps /auth/* API endpoints.
 *
 * SOLID Principles:
 *  S — Single Responsibility : only auth calls (register / login / logout)
 *  O — Open/Closed           : extend with new methods without touching existing ones
 *  D — Dependency Inversion  : depends on `api` abstraction, never on Axios directly
 *
 * Returns a consistent Result shape so callers never handle raw Axios errors:
 *   { success: true,  data: T,    error: null   }
 *   { success: false, data: null, error: string }
 */

import api, { tokenStorage } from './api';

// ─── Result helpers ───────────────────────────────────────────────────────────

function ok(data)    { return { success: true,  data,  error: null }; }
function fail(error) { return { success: false, data: null, error }; }

function extractError(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error   ||
    err?.message                 ||
    'Something went wrong'
  );
}

// ─── Service ──────────────────────────────────────────────────────────────────

const AuthService = {
  /**
   * Register a new account.
   * Stores tokens on success and returns the new user.
   */
  async register({ username, email, password }) {
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      const { user, accessToken, refreshToken } = data;
      tokenStorage.setTokens(accessToken, refreshToken);
      return ok(user);
    } catch (err) {
      return fail(extractError(err));
    }
  },

  /**
   * Login with username + password.
   * Stores tokens on success and returns the authenticated user.
   */
  async login({ username, password }) {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      const { user, accessToken, refreshToken } = data;
      tokenStorage.setTokens(accessToken, refreshToken);
      return ok(user);
    } catch (err) {
      return fail(extractError(err));
    }
  },

  /**
   * Logout from the current device — always clears local tokens.
   */
  async logout() {
    try {
      const refreshToken = tokenStorage.getRefresh();
      if (refreshToken) await api.post('/auth/logout', { refreshToken });
    } catch {
      // Best-effort — always clear locally
    } finally {
      tokenStorage.clearTokens();
    }
  },

  /**
   * Logout from ALL devices — revokes every refresh token server-side.
   */
  async logoutAll() {
    try {
      await api.post('/auth/logout-all');
    } catch {
      // Best-effort
    } finally {
      tokenStorage.clearTokens();
    }
  },
};

export default AuthService;
