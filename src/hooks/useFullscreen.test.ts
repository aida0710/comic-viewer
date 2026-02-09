import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFullscreen } from './useFullscreen';

describe('useFullscreen', () => {
  it('starts not fullscreen', () => {
    const { result } = renderHook(() => useFullscreen());
    expect(result.current.isFullscreen).toBe(false);
  });

  it('provides toggleFullscreen function', () => {
    const { result } = renderHook(() => useFullscreen());
    expect(typeof result.current.toggleFullscreen).toBe('function');
  });
});
