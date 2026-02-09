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
        className="text-sm font-mono whitespace-nowrap px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
        className={cn('flex-1 h-1.5 cursor-pointer accent-blue-500')}
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
            className="w-16 px-2 py-1 text-sm rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            autoFocus
          />
          <button
            type="submit"
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go
          </button>
        </form>
      )}
    </div>
  );
}
