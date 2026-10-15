import axios from 'axios';
import { API_URL } from '../config';
import { getAccessToken, getRefreshToken, setAccessToken, clearTokens } from './tokenStore';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// The code that owns the session (the AuthProvider, in Module 7) registers a callback here.
let onAuthFailure = () => {};

export function setAuthFailureHandler(handler) {
  onAuthFailure = handler;
}

// 1. Request interceptor: attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── NEW IN PHASE 4 ──
// 2. Response interceptor: when a request fails with 401, refresh the token once and retry it.
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/refresh'];
let refreshPromise = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    console.log('[api] Access token rejected - refreshing it...');
    // Plain axios, not `api`, so this call can never trigger the interceptors again.
    refreshPromise = axios
      .post(`${API_URL}/auth/refresh`, { refreshToken: getRefreshToken() }, { timeout: 10000 })
      .then((response) => {
        const newAccessToken = response.data.data.accessToken;
        setAccessToken(newAccessToken);
        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    const isUnauthorized = error.response?.status === 401;
    const isAuthRoute = AUTH_PATHS.some((path) => original?.url?.startsWith(path));

    // Only a 401 on a protected route is an expired-token problem.
    // (A 401 from /auth/login just means "wrong password".)
    if (!isUnauthorized || !original || isAuthRoute) {
      return Promise.reject(error);
    }

    // Already retried once, or nothing to refresh with: the session is over.
    if (original._retried || !getRefreshToken()) {
      clearTokens();
      onAuthFailure();
      return Promise.reject(error);
    }

    original._retried = true;

    // A slower request can get its 401 AFTER another request already refreshed the token.
    // If the token has changed since this request was sent, just retry with the current one.
    const currentToken = getAccessToken();
    if (currentToken && original.headers.Authorization !== `Bearer ${currentToken}`) {
      original.headers.Authorization = `Bearer ${currentToken}`;
      return api(original);
    }

    try {
      const newAccessToken = await refreshAccessToken();
      original.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(original);
    } catch (refreshError) {
      if (refreshError.response?.status === 401) {
        // The server itself rejected the refresh token: sign the user out.
        clearTokens();
        onAuthFailure();
        return Promise.reject(error);
      }
      // No answer (network down) or a server error: keep the session and surface the real problem.
      return Promise.reject(refreshError);
    }
  }
);