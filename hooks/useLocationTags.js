import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ensureLocationPermission, getCurrentCoords } from '../lib/location';
import { selectTags, tagCleared, tagSet } from '../store/tagsSlice';

export default function useLocationTags() {
  const dispatch = useDispatch();
  const tags = useSelector(selectTags);

  const tagItem = useCallback(
    async (itemId) => {
      try {
        const permission = await ensureLocationPermission();
        if (!permission.granted) {
          return {
            ok: false,
            needsSettings: !permission.canAskAgain,
            message: permission.canAskAgain
              ? 'Location permission is needed to tag an item.'
              : 'Location is turned off for Shopfront. Open Settings to allow it.',
          };
        }

        const { latitude, longitude } = await getCurrentCoords();
        dispatch(tagSet(itemId, { latitude, longitude }));
        return { ok: true };
      } catch {
        return {
          ok: false,
          needsSettings: false,
          message: 'Could not read your location. Check that Location Services is turned on.',
        };
      }
    },
    [dispatch]
  );

  const clearTag = useCallback((itemId) => dispatch(tagCleared(itemId)), [dispatch]);

  return { tags, tagItem, clearTag };
}
