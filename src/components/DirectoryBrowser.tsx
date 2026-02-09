import { useMemo, useState } from 'react';
import { FileIcon, FolderIcon } from './Icons';
import { naturalSort } from '../utils/naturalSort';

interface ZipFileEntry {
  name: string;
  handle: FileSystemFileHandle;
}

interface DirectoryBrowserProps {
  zipFiles: ZipFileEntry[];
  isSupported: boolean;
  onOpenDirectory: () => void;
  onSelectFile: (entry: ZipFileEntry) => void;
}

export function DirectoryBrowser({
  zipFiles,
  isSupported,
  onOpenDirectory,
  onSelectFile,
}: DirectoryBrowserProps) {
  const [sortAsc, setSortAsc] = useState(true);

  const sortedFiles = useMemo(
    () => [...zipFiles].sort((a, b) => naturalSort(a.name, b.name) * (sortAsc ? 1 : -1)),
    [zipFiles, sortAsc]
  );

  if (!isSupported) return null;

  return (
    <div className="mt-6 w-full max-w-lg">
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
          <ul
            className="space-y-0 max-h-64 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-800"
            role="list"
          >
            {sortedFiles.map((entry) => (
              <li key={entry.name}>
                <button
                  onClick={() => onSelectFile(entry)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <FileIcon width={16} height={16} className="shrink-0" />
                  <span className="text-sm break-all">{entry.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
