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

function ThumbnailCard({ entry, thumbnailUrl, isLoading, onSelect }: ThumbnailCardProps & { index?: number }) {
  return (
    <button
      onClick={() => onSelect(entry)}
      aria-label={`Open ${entry.name}`}
      className="group flex flex-col rounded-2xl overflow-hidden border border-blush-200 dark:border-night-700 hover:border-rose-300 dark:hover:border-lavender-400 hover:shadow-lg hover:shadow-rose-400/10 hover:-translate-y-1 transition-all duration-300 bg-linen dark:bg-night-900 shadow-sm shadow-rose-400/5"
    >
      {/* サムネイル領域（正方形） */}
      <div className="relative aspect-square w-full overflow-hidden bg-blush-100 dark:bg-night-800">
        {isLoading && !thumbnailUrl ? (
          <div className="absolute inset-0 bg-gradient-to-r from-blush-100 via-linen to-blush-100 dark:from-night-800 dark:via-night-900 dark:to-night-800 animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
        ) : !thumbnailUrl ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <FolderIcon width={48} height={48} className="text-blush-200 dark:text-night-700" />
          </div>
        ) : (
          <img
            src={thumbnailUrl}
            alt=""
            loading="lazy"
            draggable={false}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      {/* ファイル名 */}
      <div className="px-3 py-2">
        <p className="text-xs font-body text-cocoa-600 dark:text-petal-300 break-all">{entry.name}</p>
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
        <div className="flex-1 h-px bg-blush-200 dark:bg-night-700" />
        <span className="text-xs font-body text-cocoa-400 dark:text-petal-500">or</span>
        <div className="flex-1 h-px bg-blush-200 dark:bg-night-700" />
      </div>

      <button
        onClick={onOpenDirectory}
        className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-2xl border border-blush-200 dark:border-night-700 hover:bg-rose-100/40 dark:hover:bg-rose-900/20 hover:border-rose-300 dark:hover:border-rose-400 transition-all duration-300"
      >
        <FolderIcon width={18} height={18} className="text-peach-300" />
        <span className="text-sm font-body text-cocoa-900 dark:text-petal-50">Open Folder</span>
      </button>

      {sortedFiles.length > 0 && (
        <>
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setSortAsc((v) => !v)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-body text-cocoa-400 dark:text-petal-500 hover:text-rose-400 transition-colors"
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
