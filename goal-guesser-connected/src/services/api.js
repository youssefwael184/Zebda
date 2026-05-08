/**
 * @module api
 * @description Axios HTTP client — single source of truth for all API communication.
 *
 * Responsibilities (Single Responsibility Principle):
 *  - Base URL configuration
 *  - Attaching Authorization header to every request
 *  - Transparent access-token refresh on 401
 *  - Queuing concurrent requests during token refresh (no duplicate refresh calls)
 *
 * Nothing else belongs here.  All business logic stays in the service layer.
 */

import axios from 'axios';

// ─── Base instance ────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Token storage helpers (Dependency Inversion — swap storage here only) ───

const TOKEN_KEY   = 'gg_access_token';
const REFRESH_KEY = 'gg_refresh_token';

export const tokenStorage = {
  getAccess:     ()      => localStorage.getItem(TOKEN_KEY),
  setAccess:     (t)     => localStorage.setItem(TOKEN_KEY, t),
  getRefresh:    ()      => localStorage.getItem(REFRESH_KEY),
  setRefresh:    (t)     => localStorage.setItem(REFRESH_KEY, t),
  setTokens:     (a, r)  => { tokenStorage.setAccess(a); tokenStorage.setRefresh(r); },
  clearTokens:   ()      => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(REFRESH_KEY); },
};

// ─── Request interceptor — attach Bearer token ────────────────────────────────

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccess();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor — silent token refresh on 401 ──────────────────────

let isRefreshing = false;
let failedQueue  = [];   // requests that arrived while refresh was in-flight

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token)
  );
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    const is401       = error.response?.status === 401;
    const alreadyTried = original._retry;
    const isRefreshUrl = original.url?.includes('/auth/refresh');

    // If not 401, or we already retried, or this IS the refresh call → bail
    if (!is401 || alreadyTried || isRefreshUrl) {
      return Promise.reject(error);
    }

    // Queue this request while a refresh is already in-flight
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry  = true;
    isRefreshing     = true;

    try {
      const refreshToken = tokenStorage.getRefresh();
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        { refreshToken }
      );

      const { accessToken, refreshToken: newRefresh } = data.data;
      tokenStorage.setTokens(accessToken, newRefresh);

      processQueue(null, accessToken);

      original.headers.Authorization = `Bearer ${accessToken}`;
      return api(original);
    } catch (refreshError) {
      processQueue(refreshError);
      tokenStorage.clearTokens();
      // Emit a custom event so the store can react (Observer pattern)
      window.dispatchEvent(new Event('gg:session-expired'));
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
