import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import {
  addListItem,
  loadList,
  refreshList,
  removeListItem,
  selectListError,
  selectListItems,
  selectListRefreshing,
  selectListStatus,
  toggleListItem,
} from '../store/listSlice';
import useOnReconnect from './useOnReconnect';

export default function useShoppingList() {
  const { user } = useAuth();
  const ownerId = user?._id ?? user?.id;
  const dispatch = useDispatch();
  const items = useSelector(selectListItems);
  const storedStatus = useSelector(selectListStatus);
  const status = storedStatus === 'idle' ? 'loading' : storedStatus;
  const error = useSelector(selectListError);
  const refreshing = useSelector(selectListRefreshing);

  const reload = useCallback(() => {
    dispatch(loadList(ownerId));
  }, [dispatch, ownerId]);

  const refresh = useCallback(async () => {
    try {
      await dispatch(refreshList(ownerId)).unwrap();
      return true;
    } catch {
      return false;
    }
  }, [dispatch, ownerId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useOnReconnect(refresh);

  const run = useCallback(
    async (thunkAction) => {
      try {
        await dispatch(thunkAction).unwrap();
        return { ok: true };
      } catch (message) {
        return { ok: false, message };
      }
    },
    [dispatch]
  );

  const add = useCallback(
    (name) => {
      const trimmedName = name.trim();
      if (!trimmedName) return Promise.resolve({ ok: false, message: 'Enter an item name first.' });
      return run(addListItem(trimmedName));
    },
    [run]
  );

  const toggle = useCallback((item) => run(toggleListItem(item)), [run]);
  const remove = useCallback((item) => run(removeListItem(item)), [run]);

  return { items, status, error, refreshing, reload, refresh, add, toggle, remove };
}
