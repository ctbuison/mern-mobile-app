import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../lib/errors';
import { ensureOnline } from '../lib/network';
import { createItem, deleteItem, fetchItems, setItemDone } from '../services/tasks';
import useOnReconnect from './useOnReconnect';

export default function useShoppingList() {
  const { user } = useAuth();
  const ownerId = user?._id ?? user?.id;
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const reload = useCallback(async () => {
    setStatus('loading');
    setError('');
    try {
      await ensureOnline();
      setItems(await fetchItems(ownerId));
      setStatus('success');
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus('error');
    }
  }, [ownerId]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await ensureOnline();
      setItems(await fetchItems(ownerId));
      setStatus('success');
      return true;
    } catch (err) {
      return false;
    } finally {
      setRefreshing(false);
    }
  }, [ownerId]);

  useEffect(() => {
    reload();
  }, [reload]);

  useOnReconnect(refresh);

  const add = useCallback(async (name) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return { ok: false, message: 'Enter an item name first.' };
    }

    try {
      await ensureOnline();
      const item = await createItem(trimmedName);
      setItems((current) => [item, ...current]);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: getErrorMessage(err) };
    }
  }, []);

  const toggle = useCallback(async (item) => {
    const done = !item.done;
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id ? { ...currentItem, done } : currentItem
      )
    );

    try {
      await ensureOnline();
      const updatedItem = await setItemDone(item.id, done);
      setItems((current) =>
        current.map((currentItem) => (currentItem.id === item.id ? updatedItem : currentItem))
      );
      return { ok: true };
    } catch (err) {
      setItems((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id ? { ...currentItem, done: item.done } : currentItem
        )
      );
      return { ok: false, message: getErrorMessage(err) };
    }
  }, []);

  const remove = useCallback(async (item) => {
    try {
      await ensureOnline();
      await deleteItem(item.id);
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
      return { ok: true };
    } catch (err) {
      return { ok: false, message: getErrorMessage(err) };
    }
  }, []);

  return { items, status, error, refreshing, reload, refresh, add, toggle, remove };
}
