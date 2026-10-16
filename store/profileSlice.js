import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { uploadAvatar } from '../services/uploads';
import { getErrorMessage } from '../lib/errors';
import { OfflineError } from '../lib/network';
import { sessionEnded } from './sessionActions';

// "No answer from the server" is worth retrying later. A rejection (wrong file type, too big) is not.
function isConnectionProblem(err) {
  return err instanceof OfflineError || (err?.isAxiosError && !err.response);
}

// Sends the photo that is waiting in the queue. If the phone is offline, the photo simply stays queued.
export const sendPendingAvatar = createAsyncThunk(
  'profile/sendPending',
  async (_arg, { getState, rejectWithValue }) => {
    try {
      return await uploadAvatar(getState().profile.pendingAvatar);
    } catch (err) {
      return rejectWithValue({ retry: isConnectionProblem(err), message: getErrorMessage(err) });
    }
  },
  {
    // Nothing waiting, or an upload already running: do nothing.
    condition: (_arg, { getState }) => {
      const { pendingAvatar, uploading } = getState().profile;
      return pendingAvatar !== null && !uploading;
    },
  }
);

const initialState = {
  avatarUrl: null, // the photo the server has
  pendingAvatar: null, // { uri, mimeType } - a photo chosen but not uploaded yet
  uploading: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Only the newest photo matters, so a new pick replaces whatever was waiting.
    avatarQueued(state, action) {
      state.pendingAvatar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendPendingAvatar.pending, (state) => {
        state.uploading = true;
      })
      .addCase(sendPendingAvatar.fulfilled, (state, action) => {
        state.avatarUrl = action.payload;
        state.pendingAvatar = null;
        state.uploading = false;
      })
      .addCase(sendPendingAvatar.rejected, (state, action) => {
        state.uploading = false;
        // A real rejection by the server: give up on this photo instead of retrying forever.
        if (action.payload && !action.payload.retry) {
          state.pendingAvatar = null;
        }
      })
      .addCase(sessionEnded, () => initialState);
  },
});

export const { avatarQueued } = profileSlice.actions;
export default profileSlice.reducer;

// Queue the photo, then try to send it straight away.
export const submitAvatar = (asset) => (dispatch) => {
  dispatch(avatarQueued(asset));
  return dispatch(sendPendingAvatar());
};

export const selectAvatarUri = (state) => state.profile.pendingAvatar?.uri ?? state.profile.avatarUrl;
export const selectAvatarWaiting = (state) => state.profile.pendingAvatar !== null;
export const selectAvatarUploading = (state) => state.profile.uploading;