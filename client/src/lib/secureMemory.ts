import { useState, useCallback, useEffect, useRef } from 'react';

export function secureWipe(data: any): void {
  if (!data) return;

  if (typeof data === 'string') {
    return;
  }

  if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    const view = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
    crypto.getRandomValues(view);
    view.fill(0);
  } else if (Array.isArray(data)) {
    data.forEach(item => secureWipe(item));
    data.length = 0;
  } else if (typeof data === 'object') {
    Object.keys(data).forEach(key => {
      secureWipe(data[key]);
      delete data[key];
    });
  }
}

export function secureWipeString(str: string): string {
  if (!str) return '';
  const encoder = new TextEncoder();
  const buffer = encoder.encode(str);
  crypto.getRandomValues(buffer);
  buffer.fill(0);
  return '';
}

interface SensitiveStateOptions {
  autoWipeOnUnmount?: boolean;
  autoWipeDelay?: number;
}

export function useSensitiveState<T>(
  initialValue: T,
  options: SensitiveStateOptions = {}
): [T, (value: T) => void, () => void] {
  const { autoWipeOnUnmount = true, autoWipeDelay } = options;
  const [state, setState] = useState<T>(initialValue);
  const previousValueRef = useRef<T>(initialValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const secureSet = useCallback((newValue: T) => {
    const oldValue = previousValueRef.current;
    
    if (typeof oldValue === 'string') {
      secureWipeString(oldValue);
    } else if (oldValue instanceof Uint8Array || oldValue instanceof ArrayBuffer) {
      secureWipe(oldValue);
    } else if (Array.isArray(oldValue)) {
      secureWipe(oldValue);
    }
    
    previousValueRef.current = newValue;
    setState(newValue);

    if (autoWipeDelay) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        secureReset();
      }, autoWipeDelay);
    }
  }, [autoWipeDelay]);

  const secureReset = useCallback(() => {
    const currentValue = previousValueRef.current;
    
    if (typeof currentValue === 'string') {
      secureWipeString(currentValue);
      setState('' as T);
      previousValueRef.current = '' as T;
    } else if (currentValue instanceof Uint8Array) {
      secureWipe(currentValue);
      setState(new Uint8Array(0) as T);
      previousValueRef.current = new Uint8Array(0) as T;
    } else if (currentValue instanceof ArrayBuffer) {
      secureWipe(currentValue);
      setState(new ArrayBuffer(0) as T);
      previousValueRef.current = new ArrayBuffer(0) as T;
    } else if (Array.isArray(currentValue)) {
      secureWipe(currentValue);
      setState([] as T);
      previousValueRef.current = [] as T;
    } else if (currentValue === null || currentValue === undefined) {
      setState(initialValue);
      previousValueRef.current = initialValue;
    } else {
      setState(initialValue);
      previousValueRef.current = initialValue;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (autoWipeOnUnmount) {
        secureReset();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoWipeOnUnmount, secureReset]);

  return [state, secureSet, secureReset];
}

export function useAutoWipe(callback: () => void, delay: number = 60000) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback();
    }, delay);
  }, [callback, delay]);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, [clearTimer]);

  return { resetTimer, clearTimer };
}
