import { useEffect } from 'react';
import type { ReadingDirection } from '../types';

interface UseKeyboardNavOptions {
  onNext: () => void;
  onPrev: () => void;
  onToggleAutoPlay: () => void;
  readingDirection: ReadingDirection;
  enabled?: boolean;
}

export function useKeyboardNav({
  onNext,
  onPrev,
  onToggleAutoPlay,
  readingDirection,
  enabled = true,
}: UseKeyboardNavOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't handle if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          readingDirection === 'rtl' ? onPrev() : onNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          readingDirection === 'rtl' ? onNext() : onPrev();
          break;
        case 'ArrowDown':
        case 'PageDown':
          e.preventDefault();
          onNext();
          break;
        case ' ':
          e.preventDefault();
          onToggleAutoPlay();
          break;
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          onPrev();
          break;
        case 'Home':
          e.preventDefault();
          // Will be handled at component level with goTo(0)
          break;
        case 'End':
          e.preventDefault();
          // Will be handled at component level
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onToggleAutoPlay, readingDirection, enabled]);
}
