/**
 * @module UserService
 * @description User profile & leaderboard service — wraps /users/* API endpoints.
 *
 * SOLID Principles:
 *  S — Single Responsibility : profile, leaderboard, and game history only
 *  D — Dependency Inversion  : depends on `api` abstraction
 */

import api from "./api";

function ok(data) {
  return { success: true, data, error: null };
}
function fail(error) {
  return { success: false, data: null, error };
}

function extractError(err) {
  return err?.response?.data?.message || err?.message || "Something went wrong";
}

const UserService = {
  /**
   * Fetch the authenticated user's full profile (with winRate).
   * @returns {Result<User>}
   */
  async getProfile() {
    try {
      const { data } = await api.get("/users/me");
      return ok(data.user);
    } catch (err) {
      return fail(extractError(err));
    }
  },

  /**
   * Fetch the public leaderboard.
   * @param {number} limit  Max results (default 50, max 100)
   * @returns {Result<LeaderboardUser[]>}
   */
  async getLeaderboard(limit = 50) {
    try {
      const { data } = await api.get("/users/leaderboard", {
        params: { limit },
      });
      return ok(data.users);
    } catch (err) {
      return fail(extractError(err));
    }
  },

  /**
   * Fetch the authenticated user's game history.
   * @param {number} limit  Max results (default 20)
   * @returns {Result<GameHistoryItem[]>}
   */
  async getGameHistory(limit = 20) {
    try {
      const { data } = await api.get("/users/history", { params: { limit } });
      return ok(data.data.history);
    } catch (err) {
      return fail(extractError(err));
    }
  },
};

export default UserService;
