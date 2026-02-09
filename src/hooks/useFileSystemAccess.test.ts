import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileSystemAccess } from './useFileSystemAccess';

describe('useFileSystemAccess', () => {
  it('starts with empty file list', () => {
    const { result } = renderHook(() => useFileSystemAccess());
    expect(result.current.zipFiles).toEqual([]);
  });

  it('detects browser support', () => {
    const { result } = renderHook(() => useFileSystemAccess());
    // In jsdom, showDirectoryPicker is not available
    expect(result.current.isSupported).toBe(false);
  });

  it('clears files', () => {
    const { result } = renderHook(() => useFileSystemAccess());
    act(() => result.current.clearFiles());
    expect(result.current.zipFiles).toEqual([]);
  });
});
