import { createAction } from '@reduxjs/toolkit';

// "The user's session is over." Dispatched on sign-out. Every slice that holds
// per-user data listens for it and resets itself.
export const sessionEnded = createAction('session/ended');