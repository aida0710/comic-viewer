import { PlayIcon, PauseIcon } from './Icons';

interface AutoPlayControlsProps {
  isPlaying: boolean;
  interval: number;
  onToggle: () => void;
  onIntervalChange: (interval: number) => void;
}

export function AutoPlayControls({
  isPlaying,
  interval,
  onToggle,
  onIntervalChange,
}: AutoPlayControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onToggle}
        className="p-2 rounded-xl hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-colors duration-200"
        aria-label={isPlaying ? 'Pause auto-play' : 'Start auto-play'}
        title={isPlaying ? 'Pause' : 'Auto-play'}
      >
        {isPlaying ? (
          <PauseIcon width={18} height={18} />
        ) : (
          <PlayIcon width={18} height={18} />
        )}
      </button>
      <label className="flex items-center gap-1 text-sm font-body">
        <input
          type="range"
          min={1}
          max={60}
          value={interval}
          onChange={(e) => onIntervalChange(parseInt(e.target.value, 10))}
          className="w-20"
          aria-label="Auto-play interval"
        />
        <input
          type="number"
          min={1}
          max={60}
          value={interval}
          onChange={(e) => {
            const v = parseInt(e.target.value, 10);
            if (v >= 1 && v <= 60) onIntervalChange(v);
          }}
          className="w-12 px-1 text-right font-mono text-sm rounded-lg border border-blush-200 dark:border-night-700 bg-linen dark:bg-night-800 text-cocoa-900 dark:text-petal-50"
          aria-label="Auto-play interval seconds"
        />
        <span className="text-sm text-cocoa-400 dark:text-petal-500">s</span>
      </label>
    </div>
  );
}
