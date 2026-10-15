// Holds the session's tokens in memory so every request can read them instantly.
let accessToken = null;
let refreshToken = null;

export function getAccessToken() {
  return accessToken;
}

export function getRefreshToken() {
  return refreshToken;
}

export function setTokens(tokens) {
  accessToken = tokens.accessToken ?? null;
  refreshToken = tokens.refreshToken ?? null;
}

export function setAccessToken(token) {
  accessToken = token;
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
}