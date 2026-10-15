import NetInfo from '@react-native-community/netinfo';

// Thrown before a request is even attempted, when the device says it has no connection.
export class OfflineError extends Error {
  constructor() {
    super('The device is offline');
    this.name = 'OfflineError';
  }
}

// Fail fast, instead of making the user wait ten seconds for a timeout.
// (isConnected can also be null, meaning "not known yet". We only block when it is definitely false.)
export async function ensureOnline() {
  const state = await NetInfo.fetch();
  if (state.isConnected === false) {
    throw new OfflineError();
  }
}