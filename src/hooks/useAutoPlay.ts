import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAutoPlayOptions {
  interval: number; // seconds
  onTick: () => void;
  isLastSpread: boolean;
}

export function useAutoPlay({ interval, onTick, isLastSpread }: UseAutoPlayOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  const play = useCallback(() => {
    setIsPlaying(true);
  }, []);

  // Stop at last spread
  useEffect(() => {
    if (isLastSpread && isPlaying) {
      stop();
    }
  }, [isLastSpread, isPlaying, stop]);

  // Timer
  useEffect(() => {
    if (isPlaying && !isLastSpread) {
      intervalRef.current = setInterval(() => {
        onTick();
      }, interval * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, interval, onTick, isLastSpread]);

  return { isPlaying, play, stop, toggle };
}
