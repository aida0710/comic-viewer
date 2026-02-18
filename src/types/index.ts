export interface ZipFileEntry {
  name: string;
  handle: FileSystemFileHandle;
}

export interface ComicPage {
  index: number;
  filename: string;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  aspectRatio: number;
  isLandscape: boolean;
}

export interface LoadingState {
  status: 'idle' | 'loading' | 'extracting' | 'ready' | 'error';
  progress: number;
  error?: string;
  fileName?: string;
}

export type ViewMode = 'single' | 'dual';
export type ReadingDirection = 'rtl' | 'ltr';
export type Theme = 'dark' | 'light';

export interface Settings {
  viewMode: ViewMode;
  readingDirection: ReadingDirection;
  autoTurnInterval: number;
  theme: Theme;
}

export interface PageSpread {
  left: ComicPage | null;
  right: ComicPage | null;
  isSingleWide: boolean;
}

export interface ReadingPositionRecord {
  fileName: string;
  page: number;
  totalPages: number;
  timestamp: number;
}
