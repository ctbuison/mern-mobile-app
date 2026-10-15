import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, setAuthFailureHandler } from '../lib/api';
import { clearTokens, setTokens } from '../lib/tokenStore';
import { clearSession, loadSession, saveSession } from '../lib/sessionStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 'loading' = still checking for a saved session, then 'signedOut' or 'signedIn'
  const [status, setStatus] = useState('loading');
  const [user, setUser] = useState(null);

  const endSession = useCallback(async () => {
    clearTokens();
    await clearSession();
    setUser(null);
    setStatus('signedOut');
  }, []);

  useEffect(() => {
    // If a request discovers the session is dead (refresh rejected), sign out.
    setAuthFailureHandler(endSession);

    async function restore() {
      const saved = await loadSession();
      if (saved) {
        // Only the refresh token is stored. The first request gets a fresh access token by itself.
        setTokens({ refreshToken: saved.refreshToken });
        setUser(saved.user);
        setStatus('signedIn');
      } else {
        setStatus('signedOut');
      }
    }
    restore();
  }, [endSession]);

  const signIn = useCallback(async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken, refreshToken, user: signedInUser } = response.data.data;
    setTokens({ accessToken, refreshToken });
    await saveSession({ refreshToken, user: signedInUser });
    setUser(signedInUser);
    setStatus('signedIn');
  }, []);

  const signUp = useCallback(
    async (email, password) => {
      await api.post('/auth/register', { email, password });
      await signIn(email, password);
    },
    [signIn]
  );

  const signOut = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Even if the server can't be reached, the user must be able to sign out of this device.
    }
    await endSession();
  }, [endSession]);

  const value = useMemo(
    () => ({ status, user, signIn, signUp, signOut }),
    [status, user, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }
  return context;
}