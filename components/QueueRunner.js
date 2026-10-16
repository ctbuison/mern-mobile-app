import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useOnReconnect from '../hooks/useOnReconnect';
import { sendPendingAvatar } from '../store/profileSlice';

// Draws nothing. Its only job: send queued uploads at launch, and again whenever the connection returns.
export default function QueueRunner() {
  const dispatch = useDispatch();

  const flush = useCallback(() => {
    dispatch(sendPendingAvatar());
  }, [dispatch]);

  useEffect(() => {
    flush();
  }, [flush]);

  useOnReconnect(flush);

  return null;
}