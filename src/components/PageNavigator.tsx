import { useState, useCallback } from 'react';
import type { ReadingDirection } from '../types';
import { cn } from '../utils/cn';

interface PageNavigatorProps {
  currentIndex: number;
  totalSpreads: number;
  totalPages: number;
  currentPageNumbers: number[];
  readingDirection: ReadingDirection;
  onGoTo: (index: number) => void;
  onGoToPage: (pageIndex: number) => void;
}

export function PageNavigator({
  currentIndex,
  totalSpreads,
  totalPages,
  currentPageNumbers,
  readingDirection,
  onGoTo,
  onGoToPage,
}: PageNavigatorProps) {
  const [jumpInput, setJumpInput] = useState('');
  const [showJump, setShowJump] = useState(false);

  const handleSliderChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value, 10);
      if (readingDirection === 'rtl') {
        onGoTo(totalSpreads - 1 - value);
      } else {
        onGoTo(value);
      }
    },
    [readingDirection, totalSpreads, onGoTo]
  );

  const sliderValue =
    readingDirection === 'rtl' ? totalSpreads - 1 - currentIndex : currentIndex;

  const handleJump = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const pageNum = parseInt(jumpInput, 10);
      if (pageNum >= 1 && pageNum <= totalPages) {
        onGoToPage(pageNum - 1);
        setShowJump(false);
        setJumpInput('');
      }
    },
    [jumpInput, totalPages, onGoToPage]
  );

  const pageLabel = currentPageNumbers.length > 0
    ? currentPageNumbers.join('-')
    : '0';

  return (
    <div className="flex items-center gap-3 w-full">
      <button
        onClick={() => setShowJump(!showJump)}
        className="text-sm font-mono whitespace-nowrap px-3 py-1.5 rounded-xl text-cocoa-600 dark:text-petal-300 hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-colors duration-200"
        title="Jump to page"
      >
        {pageLabel} / {totalPages}
      </button>

      <input
        type="range"
        min={0}
        max={Math.max(0, totalSpreads - 1)}
        value={sliderValue}
        onChange={handleSliderChange}
        className={cn('flex-1 h-1.5 cursor-pointer')}
        aria-label="Page slider"
      />

      {showJump && (
        <form onSubmit={handleJump} className="flex items-center gap-1">
          <input
            type="number"
            min={1}
            max={totalPages}
            value={jumpInput}
            onChange={(e) => setJumpInput(e.target.value)}
            placeholder="Page\u2026"
            aria-label="Jump to page"
            className="w-16 px-2 py-1 text-sm font-body rounded-xl border border-blush-200 dark:border-night-700 bg-linen dark:bg-night-800 text-cocoa-900 dark:text-petal-50"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm font-body font-semibold bg-rose-400 text-white rounded-xl hover:bg-rose-500 transition-colors duration-200"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
}
