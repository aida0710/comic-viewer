import { describe, it, expect, beforeEach } from 'vitest';
import { getStorageItem, setStorageItem, removeStorageItem } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns fallback when key does not exist', () => {
    expect(getStorageItem('missing', 42)).toBe(42);
  });

  it('stores and retrieves a value', () => {
    setStorageItem('test', { a: 1 });
    expect(getStorageItem('test', null)).toEqual({ a: 1 });
  });

  it('uses namespaced keys', () => {
    setStorageItem('key', 'value');
    expect(localStorage.getItem('comic-viewer:key')).toBe('"value"');
  });

  it('returns fallback for corrupted data', () => {
    localStorage.setItem('comic-viewer:bad', 'not json{');
    expect(getStorageItem('bad', 'default')).toBe('default');
  });

  it('removes items', () => {
    setStorageItem('temp', 'data');
    removeStorageItem('temp');
    expect(getStorageItem('temp', null)).toBeNull();
  });
});
