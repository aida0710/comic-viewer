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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl" style={{ overscrollBehavior: 'contain' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 id="settings-title" className="text-lg font-semibold">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close settings"
            autoFocus
          >
            <XIcon width={20} height={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* View Mode */}
          <div>
            <label className="block text-sm font-medium mb-1">View Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => onSetViewMode('single')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  settings.viewMode === 'single'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Single Page
              </button>
              <button
                onClick={() => onSetViewMode('dual')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  settings.viewMode === 'dual'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Dual Page
              </button>
            </div>
          </div>

          {/* Reading Direction */}
          <div>
            <label className="block text-sm font-medium mb-1">Reading Direction</label>
            <div className="flex gap-2">
              <button
                onClick={() => onSetReadingDirection('rtl')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  settings.readingDirection === 'rtl'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Right to Left
              </button>
              <button
                onClick={() => onSetReadingDirection('ltr')}
                className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                  settings.readingDirection === 'ltr'
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Left to Right
              </button>
            </div>
          </div>

          {/* Auto Play */}
          <div>
            <label className="block text-sm font-medium mb-1">Auto-Play</label>
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
