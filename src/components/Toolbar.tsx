import type { ReadingDirection, Theme, ViewMode } from '../types';
import { PageNavigator } from './PageNavigator';
import { ZoomControls } from './ZoomControls';
import { ThemeToggle } from './ThemeToggle';
import { ChevronLeftIcon, MaximizeIcon, MinimizeIcon, PauseIcon, PlayIcon, SettingsIcon } from './Icons';

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
  // Auto-play
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
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
  isAutoPlaying,
  onToggleAutoPlay,
  onToggleSettings,
  onClose,
}: ToolbarProps) {
  return (
    <div
      className="bg-linen/85 dark:bg-night-900/85 backdrop-blur-xl border-t border-blush-200/50 dark:border-night-700/50 px-4 py-2 z-50 rounded-t-2xl shadow-[0_-4px_20px_rgba(61,44,46,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]"
      data-testid="toolbar"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onClose}
          className="p-2 rounded-xl hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-colors duration-200"
          aria-label="Back to home"
          title="Back to home"
        >
          <ChevronLeftIcon width={18} height={18} />
        </button>

        <div className="border-l border-blush-200/50 dark:border-night-700/50 pl-3 flex-1">
          <PageNavigator
            currentIndex={currentIndex}
            totalSpreads={totalSpreads}
            totalPages={totalPages}
            currentPageNumbers={currentPageNumbers}
            readingDirection={readingDirection}
            onGoTo={onGoTo}
            onGoToPage={onGoToPage}
          />
        </div>

        <div className="flex items-center gap-2 border-l border-blush-200/50 dark:border-night-700/50 pl-3">
          <ZoomControls
            isZoomed={isZoomed}
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onResetZoom={onResetZoom}
          />

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-colors duration-200"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <MinimizeIcon width={18} height={18} />
            ) : (
              <MaximizeIcon width={18} height={18} />
            )}
          </button>

          <button
            onClick={onToggleAutoPlay}
            className={`p-2 rounded-xl transition-colors duration-200 ${isAutoPlaying ? 'text-rose-400 hover:bg-rose-100/60 dark:hover:bg-rose-900/40' : 'hover:bg-rose-100/60 dark:hover:bg-rose-900/40'}`}
            aria-label={isAutoPlaying ? 'Pause auto-play' : 'Start auto-play'}
            title={isAutoPlaying ? 'Pause (Space)' : 'Auto-play (Space)'}
          >
            {isAutoPlaying ? (
              <PauseIcon width={18} height={18} />
            ) : (
              <PlayIcon width={18} height={18} />
            )}
          </button>

          <ThemeToggle theme={theme} onToggle={onToggleTheme} />

          <button
            onClick={onToggleSettings}
            className="p-2 rounded-xl hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-colors duration-200"
            aria-label="Settings"
            title="Settings"
          >
            <SettingsIcon width={18} height={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
