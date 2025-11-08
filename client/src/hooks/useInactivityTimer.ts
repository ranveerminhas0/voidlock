import { useEffect, useRef, useCallback } from 'react';
import { useSessionClear } from '@/components/SessionClearProvider';

const ACTIVITY_EVENTS = [
  'mousedown',
  'mousemove',
  'keypress',
  'scroll',
  'touchstart',
  'click'
];

export function useInactivityTimer() {
  const { timeoutMinutes, isEnabled, isOperationInProgress, setTimeRemaining } = useSessionClear();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const updateTimeRemaining = useCallback(() => {
    const elapsed = Date.now() - lastActivityRef.current;
    const totalTime = timeoutMinutes * 60 * 1000;
    const remaining = Math.max(0, totalTime - elapsed);
    setTimeRemaining(Math.ceil(remaining / 1000));
  }, [timeoutMinutes, setTimeRemaining]);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!isEnabled || isOperationInProgress) {
      setTimeRemaining(0);
      return;
    }

    setTimeRemaining(timeoutMinutes * 60);

    intervalRef.current = setInterval(() => {
      updateTimeRemaining();
    }, 100);

    timeoutRef.current = setTimeout(() => {
      if (!isOperationInProgress) {
        handleRefresh();
      }
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, isEnabled, isOperationInProgress, handleRefresh, setTimeRemaining, updateTimeRemaining]);

  useEffect(() => {
    if (!isEnabled || isOperationInProgress) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (isOperationInProgress) return;
    }

    resetTimer();

    const handleActivity = () => {
      resetTimer();
    };

    ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isEnabled, isOperationInProgress, resetTimer]);

  return { resetTimer };
}
