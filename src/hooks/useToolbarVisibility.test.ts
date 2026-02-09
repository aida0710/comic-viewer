import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToolbarVisibility } from './useToolbarVisibility';

describe('useToolbarVisibility', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts visible', () => {
    const { result } = renderHook(() => useToolbarVisibility());
    expect(result.current.isVisible).toBe(true);
  });

  it('hides after 3 seconds of inactivity', () => {
    const { result } = renderHook(() => useToolbarVisibility());
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.isVisible).toBe(false);
  });

  it('shows on mouse move', () => {
    const { result } = renderHook(() => useToolbarVisibility());

    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(result.current.isVisible).toBe(false);

    act(() => {
      document.dispatchEvent(new MouseEvent('mousemove'));
    });
    expect(result.current.isVisible).toBe(true);
  });

  it('can be manually shown and hidden', () => {
    const { result } = renderHook(() => useToolbarVisibility());

    act(() => result.current.hide());
    expect(result.current.isVisible).toBe(false);

    act(() => result.current.show());
    expect(result.current.isVisible).toBe(true);
  });
});
