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
  const { timeoutMinutes, isEnabled } = useSessionClear();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const handleRefresh = useCallback(() => {
    window.location.reload();
  }, []);

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!isEnabled) return;

    timeoutRef.current = setTimeout(() => {
      handleRefresh();
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, isEnabled, handleRefresh]);

  useEffect(() => {
    if (!isEnabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
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
    };
  }, [isEnabled, resetTimer]);

  return { resetTimer };
}
