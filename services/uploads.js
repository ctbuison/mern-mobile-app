import { api } from '../lib/api';
import { ensureOnline } from '../lib/network';

// Sends one picked or captured image to the Day 2 avatar endpoint and returns its public URL.
// `asset` is { uri, mimeType } - the shape the image picker gives us.
export async function uploadAvatar(asset) {
  await ensureOnline();

  const type = asset.mimeType ?? 'image/jpeg';

  const formData = new FormData();
  formData.append('avatar', {
    uri: asset.uri,
    name: `avatar.${type.split('/')[1]}`,
    type,
  });

  const response = await api.post('/uploads/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 30000,
  });

  return response.data.data.url;
}