import { useMemo, useState } from 'react';
import { FolderIcon } from './Icons';
import { naturalSort } from '../utils/naturalSort';
import type { ZipFileEntry } from '../types';

interface DirectoryBrowserProps {
  zipFiles: ZipFileEntry[];
  isSupported: boolean;
  onOpenDirectory: () => void;
  onSelectFile: (entry: ZipFileEntry) => void;
  thumbnails: Map<string, string>;
  thumbnailsLoading: boolean;
}

interface ThumbnailCardProps {
  entry: ZipFileEntry;
  thumbnailUrl: string | undefined;
  isLoading: boolean;
  onSelect: (entry: ZipFileEntry) => void;
}

function ThumbnailCard({ entry, thumbnailUrl, isLoading, onSelect }: ThumbnailCardProps) {
  return (
    <button
      onClick={() => onSelect(entry)}
      aria-label={`Open ${entry.name}`}
      className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all duration-150 bg-white dark:bg-gray-900"
    >
      {/* サムネイル領域（正方形） */}
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
        {isLoading && !thumbnailUrl ? (
          <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
        ) : !thumbnailUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <FolderIcon width={48} height={48} className="text-gray-300 dark:text-gray-600" />
          </div>
        ) : (
          <img
            src={thumbnailUrl}
            alt=""
            loading="lazy"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
        )}
      </div>
      {/* ファイル名 */}
      <div className="px-2 py-1.5">
        <p className="text-xs text-gray-700 dark:text-gray-300 break-all">{entry.name}</p>
      </div>
    </button>
  );
}

export function DirectoryBrowser({
  zipFiles,
  isSupported,
  onOpenDirectory,
  onSelectFile,
  thumbnails,
  thumbnailsLoading,
}: DirectoryBrowserProps) {
  const [sortAsc, setSortAsc] = useState(true);

  const sortedFiles = useMemo(
    () => [...zipFiles].sort((a, b) => naturalSort(a.name, b.name) * (sortAsc ? 1 : -1)),
    [zipFiles, sortAsc]
  );

  if (!isSupported) return null;

  return (
    <div className="mt-6 w-full">
      {/* 区切り */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-xs text-gray-400 dark:text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      <button
        onClick={onOpenDirectory}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <FolderIcon width={18} height={18} />
        <span className="text-sm">Open Folder</span>
      </button>

      {sortedFiles.length > 0 && (
        <>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setSortAsc((v) => !v)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={sortAsc ? 'Sort descending' : 'Sort ascending'}
            >
              Name
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${sortAsc ? '' : 'rotate-180'}`}
              >
                <path d="M12 5v14M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {sortedFiles.map((entry) => (
              <ThumbnailCard
                key={entry.name}
                entry={entry}
                thumbnailUrl={thumbnails.get(entry.name)}
                isLoading={thumbnailsLoading}
                onSelect={onSelectFile}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
