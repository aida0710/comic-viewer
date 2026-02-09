import { ZoomInIcon, ZoomOutIcon, RotateCcwIcon } from './Icons';

interface ZoomControlsProps {
  isZoomed: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export function ZoomControls({ isZoomed, onZoomIn, onZoomOut, onResetZoom }: ZoomControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onZoomOut}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Zoom out"
        title="Zoom out"
      >
        <ZoomOutIcon width={18} height={18} />
      </button>
      <button
        onClick={onZoomIn}
        className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Zoom in"
        title="Zoom in"
      >
        <ZoomInIcon width={18} height={18} />
      </button>
      {isZoomed && (
        <button
          onClick={onResetZoom}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Reset zoom"
          title="Reset zoom"
        >
          <RotateCcwIcon width={18} height={18} />
        </button>
      )}
    </div>
  );
}
