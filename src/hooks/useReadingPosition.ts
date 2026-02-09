import { useCallback } from 'react';
import type { ReadingPositionRecord } from '../types';
import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

const READING_POSITIONS_KEY = 'reading-positions';

function getPositions(): Record<string, ReadingPositionRecord> {
  return getStorageItem<Record<string, ReadingPositionRecord>>(READING_POSITIONS_KEY, {});
}

export function useReadingPosition() {
  const savePosition = useCallback(
    (fileName: string, page: number, totalPages: number) => {
      const positions = getPositions();
      positions[fileName] = {
        fileName,
        page,
        totalPages,
        timestamp: Date.now(),
      };
      setStorageItem(READING_POSITIONS_KEY, positions);
    },
    []
  );

  const getPosition = useCallback(
    (fileName: string): ReadingPositionRecord | null => {
      const positions = getPositions();
      return positions[fileName] ?? null;
    },
    []
  );

  const clearPosition = useCallback((fileName: string) => {
    const positions = getPositions();
    delete positions[fileName];
    setStorageItem(READING_POSITIONS_KEY, positions);
  }, []);

  const clearAll = useCallback(() => {
    removeStorageItem(READING_POSITIONS_KEY);
  }, []);

  return { savePosition, getPosition, clearPosition, clearAll };
}
