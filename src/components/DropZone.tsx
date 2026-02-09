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
          'group w-full max-w-lg p-10 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all duration-200',
          isDragOver
            ? 'border-blue-500 bg-blue-500/10 scale-[1.02]'
            : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-900/50',
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
          className="mx-auto mb-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 group-hover:-translate-y-1"
          width={40} height={40}
        />
        <p className="text-base font-medium mb-1">Drop a ZIP file here</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">or click to select</p>
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
