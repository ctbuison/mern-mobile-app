import * as SecureStore from 'expo-secure-store';

const SESSION_KEY = 'shopfront.session';

// Keep the item on this device only: it is not copied to a new phone by a backup restore.
const OPTIONS = { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY };

// What we keep between launches: the refresh token and the user's basic details.
// The access token is NOT saved: it is short-lived, and the refresh token can always get a new one.
export async function loadSession() {
  try {
    const saved = await SecureStore.getItemAsync(SESSION_KEY, OPTIONS);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.log('Could not read the saved session:', error.message);
    return null;
  }
}

export async function saveSession(session) {
  await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(session), OPTIONS);
}

export async function clearSession() {
  await SecureStore.deleteItemAsync(SESSION_KEY, OPTIONS);
}