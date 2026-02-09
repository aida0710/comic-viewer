import type { ReadingDirection, Theme, ViewMode } from '../types';
import { PageNavigator } from './PageNavigator';
import { ZoomControls } from './ZoomControls';
import { ThemeToggle } from './ThemeToggle';
import { MaximizeIcon, MinimizeIcon, SettingsIcon, XIcon } from './Icons';

interface ToolbarProps {
  // Page navigation
  currentIndex: number;
  totalSpreads: number;
  totalPages: number;
  currentPageNumbers: number[];
  readingDirection: ReadingDirection;
  onGoTo: (index: number) => void;
  onGoToPage: (pageIndex: number) => void;
  // Zoom
  isZoomed: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  // Theme
  theme: Theme;
  onToggleTheme: () => void;
  // Fullscreen
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  // Settings
  onToggleSettings: () => void;
  // Close
  onClose: () => void;
  // View mode (for display)
  viewMode: ViewMode;
}

export function Toolbar({
  currentIndex,
  totalSpreads,
  totalPages,
  currentPageNumbers,
  readingDirection,
  onGoTo,
  onGoToPage,
  isZoomed,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  theme,
  onToggleTheme,
  isFullscreen,
  onToggleFullscreen,
  onToggleSettings,
  onClose,
}: ToolbarProps) {
  return (
    <div
      className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-4 py-2 z-50"
      data-testid="toolbar"
    >
      <div className="flex items-center gap-3">
        <PageNavigator
          currentIndex={currentIndex}
          totalSpreads={totalSpreads}
          totalPages={totalPages}
          currentPageNumbers={currentPageNumbers}
          readingDirection={readingDirection}
          onGoTo={onGoTo}
          onGoToPage={onGoToPage}
        />

        <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-3">
          <ZoomControls
            isZoomed={isZoomed}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onResetZoom={onResetZoom}
          />

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <MinimizeIcon width={18} height={18} />
            ) : (
              <MaximizeIcon width={18} height={18} />
            )}
          </button>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <button
            onClick={onToggleSettings}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Settings"
            title="Settings"
          >
            <SettingsIcon width={18} height={18} />
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
            title="Close"
          >
            <XIcon width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
