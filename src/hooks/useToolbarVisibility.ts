import { useState, useCallback, useRef, useEffect } from 'react';

const HIDE_DELAY = 3000;

export function useToolbarVisibility() {
  const [isVisible, setIsVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetTimer = useCallback(() => {
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, HIDE_DELAY);
  }, []);

  const show = useCallback(() => {
    setIsVisible(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    setIsVisible(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = () => resetTimer();
    document.addEventListener('mousemove', handleMouseMove);
    resetTimer();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [resetTimer]);

  return { isVisible, show, hide, resetTimer };
}
