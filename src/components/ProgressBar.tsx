import type { LoadingState } from '../types';

interface ProgressBarProps {
  loadingState: LoadingState;
}

const STATUS_LABELS: Record<LoadingState['status'], string> = {
  idle: '',
  loading: 'Loading\u2026',
  extracting: 'Extracting images\u2026',
  ready: 'Ready',
  error: 'Error',
};

export function ProgressBar({ loadingState }: ProgressBarProps) {
  const { status, progress, error, fileName } = loadingState;

  if (status === 'idle' || status === 'ready') return null;

  return (
    <div className="w-full max-w-md mx-auto p-4" role="status" aria-live="polite">
      {fileName && (
        <p className="text-sm font-body text-cocoa-600 dark:text-petal-300 mb-2 truncate">{fileName}</p>
      )}
      {status === 'error' ? (
        <p className="text-sm font-body text-coral-400">{error ?? 'Unknown error'}</p>
      ) : (
        <>
          <div className="w-full bg-blush-100 dark:bg-night-800 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-peach-300 to-rose-400 h-2.5 rounded-full transition-[width] duration-500 ease-[var(--ease-soft)]"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-sm font-body text-cocoa-600 dark:text-petal-300 mt-1">
            {STATUS_LABELS[status]} {progress}%
          </p>
        </>
      )}
    </div>
  );
}
