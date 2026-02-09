import { useState, useCallback, useRef, useEffect } from 'react';

export interface ZoomState {
  scale: number;
  translateX: number;
  translateY: number;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 5;

export function useZoom(containerRef: React.RefObject<HTMLDivElement | null>) {
  const [zoom, setZoom] = useState<ZoomState>({
    scale: 1,
    translateX: 0,
    translateY: 0,
  });
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const resetZoom = useCallback(() => {
    setZoom({ scale: 1, translateX: 0, translateY: 0 });
  }, []);

  const zoomIn = useCallback(() => {
    setZoom((prev) => ({
      ...prev,
      scale: Math.min(prev.scale * 1.25, MAX_SCALE),
    }));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => {
      const newScale = Math.max(prev.scale / 1.25, MIN_SCALE);
      if (newScale <= 1) {
        return { scale: newScale, translateX: 0, translateY: 0 };
      }
      return { ...prev, scale: newScale };
    });
  }, []);

  // Wheel zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();

      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => {
        const newScale = Math.max(MIN_SCALE, Math.min(prev.scale * delta, MAX_SCALE));
        if (newScale <= 1) {
          return { scale: newScale, translateX: 0, translateY: 0 };
        }
        return { ...prev, scale: newScale };
      });
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [containerRef]);

  // Pan when zoomed
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (zoom.scale <= 1) return;
      isPanning.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPanning.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setZoom((prev) => ({
        ...prev,
        translateX: prev.translateX + dx,
        translateY: prev.translateY + dy,
      }));
    };

    const handlePointerUp = () => {
      isPanning.current = false;
    };

    el.addEventListener('pointerdown', handlePointerDown);
    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerup', handlePointerUp);
    el.addEventListener('pointercancel', handlePointerUp);

    return () => {
      el.removeEventListener('pointerdown', handlePointerDown);
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerup', handlePointerUp);
      el.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [containerRef, zoom.scale]);

  const isZoomed = zoom.scale > 1;

  return {
    zoom,
    isZoomed,
    zoomIn,
    zoomOut,
    resetZoom,
  };
}
