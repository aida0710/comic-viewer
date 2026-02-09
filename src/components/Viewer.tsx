import { useRef, useCallback } from 'react';
import type { PageSpread, ReadingDirection } from '../types';
import type { ZoomState } from '../hooks/useZoom';
import { cn } from '../utils/cn';

interface ViewerProps {
  spread: PageSpread | null;
  readingDirection: ReadingDirection;
  zoom: ZoomState;
  isZoomed: boolean;
  onClickLeft: () => void;
  onClickRight: () => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export function Viewer({
  spread,
  readingDirection,
  zoom,
  isZoomed,
  onClickLeft,
  onClickRight,
  containerRef,
}: ViewerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isZoomed) return;

      const rect = viewerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const isLeftSide = x < rect.width / 2;

      if (isLeftSide) {
        onClickLeft();
      } else {
        onClickRight();
      }
    },
    [isZoomed, onClickLeft, onClickRight]
  );

  if (!spread) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No pages to display
      </div>
    );
  }

  const transform = `scale(${zoom.scale}) translate(${zoom.translateX / zoom.scale}px, ${zoom.translateY / zoom.scale}px)`;

  return (
    <div
      ref={(node) => {
        (viewerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof containerRef === 'object' && containerRef !== null) {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      }}
      className={cn(
        'flex items-center justify-center h-full w-full overflow-hidden select-none',
        isZoomed ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
      )}
      onClick={handleClick}
      data-testid="viewer"
    >
      <div
        className="flex items-center justify-center h-full"
        style={{ transform, transformOrigin: 'center center' }}
      >
        {spread.isSingleWide ? (
          <img
            src={(spread.left ?? spread.right)!.url}
            alt={(spread.left ?? spread.right)!.filename}
            width={(spread.left ?? spread.right)!.width}
            height={(spread.left ?? spread.right)!.height}
            className="max-h-full max-w-full object-contain"
            draggable={false}
          />
        ) : (
          <div className={cn('flex h-full items-center', readingDirection === 'rtl' && 'flex-row')}>
            {spread.left && (
              <img
                src={spread.left.url}
                alt={spread.left.filename}
                width={spread.left.width}
                height={spread.left.height}
                className="max-h-full object-contain"
                style={{ maxWidth: spread.right ? '50vw' : '100vw' }}
                draggable={false}
              />
            )}
            {spread.right && (
              <img
                src={spread.right.url}
                alt={spread.right.filename}
                width={spread.right.width}
                height={spread.right.height}
                className="max-h-full object-contain"
                style={{ maxWidth: spread.left ? '50vw' : '100vw' }}
                draggable={false}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
