import { useEffect } from 'react';
import type { ReadingPositionRecord } from '../types';

interface ResumePromptProps {
  position: ReadingPositionRecord;
  onResume: () => void;
  onStartOver: () => void;
}

export function ResumePrompt({ position, onResume, onStartOver }: ResumePromptProps) {
  const percentage = Math.round((position.page / position.totalPages) * 100);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onStartOver();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onStartOver]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/40 dark:bg-night-950/60 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className="bg-linen dark:bg-night-900 rounded-3xl p-8 max-w-sm mx-4 shadow-2xl shadow-rose-400/10 border border-blush-100 dark:border-night-700" style={{ overscrollBehavior: 'contain' }}>
        <h2 id="resume-title" className="font-display text-xl font-semibold text-cocoa-900 dark:text-petal-50 mb-2">Continue Reading?</h2>
        <p className="text-sm font-body text-cocoa-600 dark:text-petal-300 mb-6">
          You were on page {position.page + 1} of {position.totalPages} ({percentage}%)
        </p>
        <div className="flex gap-3">
          <button
            onClick={onResume}
            className="flex-1 px-4 py-2.5 font-body font-semibold bg-rose-400 text-white rounded-xl hover:bg-rose-500 shadow-md shadow-rose-400/20 transition-all duration-200"
            autoFocus
          >
            Continue
          </button>
          <button
            onClick={onStartOver}
            className="flex-1 px-4 py-2.5 font-body font-semibold bg-blush-100 dark:bg-night-800 text-cocoa-600 dark:text-petal-300 rounded-xl hover:bg-blush-200 dark:hover:bg-night-700 transition-all duration-200"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
