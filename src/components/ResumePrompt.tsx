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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm mx-4 shadow-xl" style={{ overscrollBehavior: 'contain' }}>
        <h2 id="resume-title" className="text-lg font-semibold mb-2">Continue Reading?</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          You were on page {position.page + 1} of {position.totalPages} ({percentage}%)
        </p>
        <div className="flex gap-3">
          <button
            onClick={onResume}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            autoFocus
          >
            Continue
          </button>
          <button
            onClick={onStartOver}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
