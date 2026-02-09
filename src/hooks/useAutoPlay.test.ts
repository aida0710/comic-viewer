import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAutoPlay } from './useAutoPlay';

describe('useAutoPlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts not playing', () => {
    const { result } = renderHook(() =>
      useAutoPlay({ interval: 5, onTick: vi.fn(), isLastSpread: false })
    );
    expect(result.current.isPlaying).toBe(false);
  });

  it('toggles play/pause', () => {
    const { result } = renderHook(() =>
      useAutoPlay({ interval: 5, onTick: vi.fn(), isLastSpread: false })
    );
    act(() => result.current.toggle());
    expect(result.current.isPlaying).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.isPlaying).toBe(false);
  });

  it('calls onTick at interval when playing', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() =>
      useAutoPlay({ interval: 3, onTick, isLastSpread: false })
    );

    act(() => result.current.play());
    expect(onTick).not.toHaveBeenCalled();

    act(() => vi.advanceTimersByTime(3000));
    expect(onTick).toHaveBeenCalledOnce();

    act(() => vi.advanceTimersByTime(3000));
    expect(onTick).toHaveBeenCalledTimes(2);
  });

  it('stops calling onTick after pause', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() =>
      useAutoPlay({ interval: 3, onTick, isLastSpread: false })
    );

    act(() => result.current.play());
    act(() => vi.advanceTimersByTime(3000));
    expect(onTick).toHaveBeenCalledOnce();

    act(() => result.current.stop());
    act(() => vi.advanceTimersByTime(6000));
    expect(onTick).toHaveBeenCalledOnce();
  });

  it('stops when reaching last spread', () => {
    const onTick = vi.fn();
    const { result, rerender } = renderHook(
      ({ isLastSpread }) =>
        useAutoPlay({ interval: 3, onTick, isLastSpread }),
      { initialProps: { isLastSpread: false } }
    );

    act(() => result.current.play());
    expect(result.current.isPlaying).toBe(true);

    rerender({ isLastSpread: true });
    expect(result.current.isPlaying).toBe(false);
  });
});
