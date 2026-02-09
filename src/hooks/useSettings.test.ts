import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSettings } from './useSettings';

describe('useSettings', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('returns default settings', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings).toEqual({
      viewMode: 'dual',
      readingDirection: 'rtl',
      autoTurnInterval: 5,
      theme: 'dark',
    });
  });

  it('persists settings to localStorage', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setViewMode('single'));
    const stored = JSON.parse(localStorage.getItem('comic-viewer:settings')!);
    expect(stored.viewMode).toBe('single');
  });

  it('toggles theme', () => {
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings.theme).toBe('dark');
    act(() => result.current.toggleTheme());
    expect(result.current.settings.theme).toBe('light');
    act(() => result.current.toggleTheme());
    expect(result.current.settings.theme).toBe('dark');
  });

  it('applies dark class to html element', () => {
    renderHook(() => useSettings());
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('removes dark class when light theme', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.toggleTheme());
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('sets reading direction', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setReadingDirection('ltr'));
    expect(result.current.settings.readingDirection).toBe('ltr');
  });

  it('sets auto turn interval', () => {
    const { result } = renderHook(() => useSettings());
    act(() => result.current.setAutoTurnInterval(10));
    expect(result.current.settings.autoTurnInterval).toBe(10);
  });

  it('loads saved settings from localStorage', () => {
    localStorage.setItem(
      'comic-viewer:settings',
      JSON.stringify({
        viewMode: 'single',
        readingDirection: 'ltr',
        autoTurnInterval: 10,
        theme: 'light',
      })
    );
    const { result } = renderHook(() => useSettings());
    expect(result.current.settings.viewMode).toBe('single');
    expect(result.current.settings.readingDirection).toBe('ltr');
  });
});
