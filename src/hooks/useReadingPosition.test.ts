import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useReadingPosition } from './useReadingPosition';

describe('useReadingPosition', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null for unknown file', () => {
    const { result } = renderHook(() => useReadingPosition());
    expect(result.current.getPosition('unknown.zip')).toBeNull();
  });

  it('saves and retrieves position', () => {
    const { result } = renderHook(() => useReadingPosition());

    act(() => {
      result.current.savePosition('manga.zip', 5, 100);
    });

    const pos = result.current.getPosition('manga.zip');
    expect(pos).not.toBeNull();
    expect(pos!.page).toBe(5);
    expect(pos!.totalPages).toBe(100);
    expect(pos!.fileName).toBe('manga.zip');
  });

  it('clears position for a file', () => {
    const { result } = renderHook(() => useReadingPosition());

    act(() => {
      result.current.savePosition('manga.zip', 5, 100);
      result.current.clearPosition('manga.zip');
    });

    expect(result.current.getPosition('manga.zip')).toBeNull();
  });

  it('clears all positions', () => {
    const { result } = renderHook(() => useReadingPosition());

    act(() => {
      result.current.savePosition('manga1.zip', 5, 100);
      result.current.savePosition('manga2.zip', 10, 200);
      result.current.clearAll();
    });

    expect(result.current.getPosition('manga1.zip')).toBeNull();
    expect(result.current.getPosition('manga2.zip')).toBeNull();
  });
});
