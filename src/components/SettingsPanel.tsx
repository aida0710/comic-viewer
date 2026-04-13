import { useEffect } from 'react';
import type { Settings, ViewMode, ReadingDirection } from '../types';
import { XIcon } from './Icons';
import { AutoPlayControls } from './AutoPlayControls';

interface SettingsPanelProps {
  settings: Settings;
  isAutoPlaying: boolean;
  onSetViewMode: (mode: ViewMode) => void;
  onSetReadingDirection: (dir: ReadingDirection) => void;
  onSetAutoTurnInterval: (interval: number) => void;
  onToggleAutoPlay: () => void;
  onClose: () => void;
}

export function SettingsPanel({
  settings,
  isAutoPlaying,
  onSetViewMode,
  onSetReadingDirection,
  onSetAutoTurnInterval,
  onToggleAutoPlay,
  onClose,
}: SettingsPanelProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-night-950/40 dark:bg-night-950/60 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="bg-linen dark:bg-night-900 rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl shadow-rose-400/10 border border-blush-100 dark:border-night-700" style={{ overscrollBehavior: 'contain' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 id="settings-title" className="font-display text-xl font-semibold text-cocoa-900 dark:text-petal-50">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-xl hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-colors duration-200"
            aria-label="Close settings"
            autoFocus
          >
            <XIcon width={20} height={20} />
          </button>
        </div>

        <div className="space-y-5">
          {/* View Mode */}
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-wider text-cocoa-600 dark:text-petal-300 mb-2">View Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => onSetViewMode('single')}
                className={`flex-1 px-3 py-2 text-sm font-body font-semibold rounded-xl border transition-all duration-200 ${
                  settings.viewMode === 'single'
                    ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-400/20'
                    : 'border-blush-200 dark:border-night-700 text-cocoa-600 dark:text-petal-300 hover:bg-rose-100/40 dark:hover:bg-rose-900/30'
                }`}
              >
                Single Page
              </button>
              <button
                onClick={() => onSetViewMode('dual')}
                className={`flex-1 px-3 py-2 text-sm font-body font-semibold rounded-xl border transition-all duration-200 ${
                  settings.viewMode === 'dual'
                    ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-400/20'
                    : 'border-blush-200 dark:border-night-700 text-cocoa-600 dark:text-petal-300 hover:bg-rose-100/40 dark:hover:bg-rose-900/30'
                }`}
              >
                Dual Page
              </button>
            </div>
          </div>

          {/* Reading Direction */}
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-wider text-cocoa-600 dark:text-petal-300 mb-2">Reading Direction</label>
            <div className="flex gap-2">
              <button
                onClick={() => onSetReadingDirection('rtl')}
                className={`flex-1 px-3 py-2 text-sm font-body font-semibold rounded-xl border transition-all duration-200 ${
                  settings.readingDirection === 'rtl'
                    ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-400/20'
                    : 'border-blush-200 dark:border-night-700 text-cocoa-600 dark:text-petal-300 hover:bg-rose-100/40 dark:hover:bg-rose-900/30'
                }`}
              >
                Right to Left
              </button>
              <button
                onClick={() => onSetReadingDirection('ltr')}
                className={`flex-1 px-3 py-2 text-sm font-body font-semibold rounded-xl border transition-all duration-200 ${
                  settings.readingDirection === 'ltr'
                    ? 'bg-rose-400 text-white border-rose-400 shadow-md shadow-rose-400/20'
                    : 'border-blush-200 dark:border-night-700 text-cocoa-600 dark:text-petal-300 hover:bg-rose-100/40 dark:hover:bg-rose-900/30'
                }`}
              >
                Left to Right
              </button>
            </div>
          </div>

          {/* Auto Play */}
          <div>
            <label className="block text-xs font-body font-semibold uppercase tracking-wider text-cocoa-600 dark:text-petal-300 mb-2">Auto-Play</label>
            <AutoPlayControls
              isPlaying={isAutoPlaying}
              interval={settings.autoTurnInterval}
              onToggle={onToggleAutoPlay}
              onIntervalChange={onSetAutoTurnInterval}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
