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
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">{fileName}</p>
      )}
      {status === 'error' ? (
        <p className="text-sm text-red-500">{error ?? 'Unknown error'}</p>
      ) : (
        <>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-[width] duration-200"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {STATUS_LABELS[status]} {progress}%
          </p>
        </>
      )}
    </div>
  );
}
