const PREFIX = 'comic-viewer:';

export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function removeStorageItem(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    // Silently ignore
  }
}
