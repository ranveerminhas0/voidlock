import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type SessionClearTimeout = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface SessionClearContextType {
  timeoutMinutes: SessionClearTimeout;
  setTimeoutMinutes: (minutes: SessionClearTimeout) => void;
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
}

const SessionClearContext = createContext<SessionClearContextType | undefined>(undefined);

export function SessionClearProvider({ children }: { children: ReactNode }) {
  const [timeoutMinutes, setTimeoutMinutesState] = useState<SessionClearTimeout>(() => {
    const stored = localStorage.getItem('voidlock-session-clear-timeout');
    return stored ? (parseInt(stored) as SessionClearTimeout) : 2;
  });

  const [isEnabled, setIsEnabledState] = useState<boolean>(() => {
    const stored = localStorage.getItem('voidlock-session-clear-enabled');
    return stored !== null ? stored === 'true' : true;
  });

  const setTimeoutMinutes = (minutes: SessionClearTimeout) => {
    setTimeoutMinutesState(minutes);
    localStorage.setItem('voidlock-session-clear-timeout', minutes.toString());
  };

  const setIsEnabled = (enabled: boolean) => {
    setIsEnabledState(enabled);
    localStorage.setItem('voidlock-session-clear-enabled', enabled.toString());
  };

  useEffect(() => {
    localStorage.setItem('voidlock-session-clear-timeout', timeoutMinutes.toString());
  }, [timeoutMinutes]);

  useEffect(() => {
    localStorage.setItem('voidlock-session-clear-enabled', isEnabled.toString());
  }, [isEnabled]);

  return (
    <SessionClearContext.Provider value={{ timeoutMinutes, setTimeoutMinutes, isEnabled, setIsEnabled }}>
      {children}
    </SessionClearContext.Provider>
  );
}

export function useSessionClear() {
  const context = useContext(SessionClearContext);
  if (!context) {
    throw new Error('useSessionClear must be used within SessionClearProvider');
  }
  return context;
}
