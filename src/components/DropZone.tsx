import { useState, useCallback, useRef } from 'react';
import { cn } from '../utils/cn';
import { UploadIcon } from './Icons';
import type { LoadingState } from '../types';
import { ProgressBar } from './ProgressBar';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  loadingState: LoadingState;
}

export function DropZone({ onFileSelect, loadingState }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file && file.name.toLowerCase().endsWith('.zip')) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
      // Reset so same file can be selected again
      e.target.value = '';
    },
    [onFileSelect]
  );

  const isLoading = loadingState.status === 'loading' || loadingState.status === 'extracting';

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && inputRef.current?.click()}
        className={cn(
          'group w-full max-w-lg p-12 md:p-16 border-2 border-dashed rounded-3xl text-center cursor-pointer transition-all duration-300 shadow-sm',
          isDragOver
            ? 'border-rose-400 bg-rose-100/60 dark:bg-rose-900/40 scale-[1.03]'
            : 'border-blush-200 dark:border-night-700 hover:border-rose-400 dark:hover:border-rose-400 hover:bg-rose-100/30 dark:hover:bg-rose-900/20 hover:shadow-md hover:shadow-rose-400/10',
          isLoading && 'pointer-events-none opacity-60'
        )}
        role="button"
        tabIndex={0}
        aria-label="Drop ZIP file here or click to select"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
      >
        <UploadIcon
          className="mx-auto mb-4 text-blush-300 dark:text-night-700"
          width={48} height={48}
        />
        <p className="text-base font-body font-medium text-cocoa-900 dark:text-petal-50 mb-1">Drop your comic here</p>
        <p className="text-xs font-body text-cocoa-400 dark:text-petal-500">ZIP files supported</p>
        <input
          ref={inputRef}
          type="file"
          accept=".zip,application/zip"
          onChange={handleFileInput}
          className="hidden"
          aria-hidden="true"
        />
      </div>
      <ProgressBar loadingState={loadingState} />
    </div>
  );
}
