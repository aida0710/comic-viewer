import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useZoom } from './useZoom';
import { useRef } from 'react';

describe('useZoom', () => {
  function renderUseZoom() {
    return renderHook(() => {
      const ref = useRef<HTMLDivElement>(null);
      return useZoom(ref);
    });
  }

  it('starts at scale 1 with no translation', () => {
    const { result } = renderUseZoom();
    expect(result.current.zoom.scale).toBe(1);
    expect(result.current.zoom.translateX).toBe(0);
    expect(result.current.zoom.translateY).toBe(0);
    expect(result.current.isZoomed).toBe(false);
  });

  it('zooms in', () => {
    const { result } = renderUseZoom();
    act(() => result.current.zoomIn());
    expect(result.current.zoom.scale).toBe(1.25);
    expect(result.current.isZoomed).toBe(true);
  });

  it('zooms out', () => {
    const { result } = renderUseZoom();
    act(() => result.current.zoomIn());
    act(() => result.current.zoomIn());
    act(() => result.current.zoomOut());
    expect(result.current.zoom.scale).toBeCloseTo(1.25);
  });

  it('resets zoom', () => {
    const { result } = renderUseZoom();
    act(() => result.current.zoomIn());
    act(() => result.current.resetZoom());
    expect(result.current.zoom.scale).toBe(1);
    expect(result.current.isZoomed).toBe(false);
  });

  it('clamps zoom to min/max', () => {
    const { result } = renderUseZoom();
    for (let i = 0; i < 20; i++) {
      act(() => result.current.zoomIn());
    }
    expect(result.current.zoom.scale).toBeLessThanOrEqual(5);

    for (let i = 0; i < 30; i++) {
      act(() => result.current.zoomOut());
    }
    expect(result.current.zoom.scale).toBeGreaterThanOrEqual(0.5);
  });
});
