import { useState, useEffect, useCallback } from 'react';
import type { Settings, ViewMode, ReadingDirection } from '../types';
import { getStorageItem, setStorageItem } from '../utils/storage';

const SETTINGS_KEY = 'settings';

const DEFAULT_SETTINGS: Settings = {
  viewMode: 'dual',
  readingDirection: 'rtl',
  autoTurnInterval: 5,
  theme: 'dark',
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() =>
    getStorageItem<Settings>(SETTINGS_KEY, DEFAULT_SETTINGS)
  );

  useEffect(() => {
    setStorageItem(SETTINGS_KEY, settings);
  }, [settings]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [settings.theme]);

  const setViewMode = useCallback((viewMode: ViewMode) => {
    setSettings((prev) => ({ ...prev, viewMode }));
  }, []);

  const setReadingDirection = useCallback((readingDirection: ReadingDirection) => {
    setSettings((prev) => ({ ...prev, readingDirection }));
  }, []);

  const setAutoTurnInterval = useCallback((autoTurnInterval: number) => {
    setSettings((prev) => ({ ...prev, autoTurnInterval }));
  }, []);

  const toggleTheme = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  }, []);

  return {
    settings,
    setViewMode,
    setReadingDirection,
    setAutoTurnInterval,
    toggleTheme,
  };
}
