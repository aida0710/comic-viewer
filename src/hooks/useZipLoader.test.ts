import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useZipLoader } from './useZipLoader';

// Mock fflate
vi.mock('fflate', () => ({
  unzip: vi.fn((_data: Uint8Array, cb: (err: Error | null, result: Record<string, Uint8Array>) => void) => {
    cb(null, {
      'page1.jpg': new Uint8Array([0xff, 0xd8, 0xff]),
      'page2.png': new Uint8Array([0x89, 0x50, 0x4e]),
      'readme.txt': new Uint8Array([0x48, 0x65]),
      '__MACOSX/._page1.jpg': new Uint8Array([0x00]),
    });
  }),
}));

// Polyfill File.arrayBuffer for jsdom
if (!File.prototype.arrayBuffer) {
  File.prototype.arrayBuffer = function () {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.readAsArrayBuffer(this);
    });
  };
}

beforeEach(() => {
  class MockImage {
    naturalWidth = 800;
    naturalHeight = 1200;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    private _src = '';
    get src() { return this._src; }
    set src(v: string) {
      this._src = v;
      const self = this;
      Promise.resolve().then(() => {
        if (self.onload) self.onload();
      });
    }
  }
  vi.stubGlobal('Image', MockImage);
});

describe('useZipLoader', () => {
  it('starts with idle state', () => {
    const { result } = renderHook(() => useZipLoader());
    expect(result.current.loadingState.status).toBe('idle');
    expect(result.current.pages).toEqual([]);
  });

  it('loads a zip file and extracts image pages', async () => {
    const { result } = renderHook(() => useZipLoader());
    const file = new File([new Uint8Array([0x50, 0x4b])], 'test.zip', {
      type: 'application/zip',
    });

    await act(async () => {
      await result.current.loadZip(file);
    });

    expect(result.current.loadingState.status).toBe('ready');
    expect(result.current.loadingState.fileName).toBe('test.zip');
    expect(result.current.pages).toHaveLength(2);
    expect(result.current.pages[0].filename).toBe('page1.jpg');
    expect(result.current.pages[1].filename).toBe('page2.png');
  });

  it('filters out non-image files', async () => {
    const { result } = renderHook(() => useZipLoader());
    const file = new File([new Uint8Array([0x50, 0x4b])], 'test.zip');

    await act(async () => {
      await result.current.loadZip(file);
    });

    const filenames = result.current.pages.map((p) => p.filename);
    expect(filenames).not.toContain('readme.txt');
    expect(filenames).not.toContain('__MACOSX/._page1.jpg');
  });

  it('cleans up object URLs on cleanup', async () => {
    const revokeSpy = vi.spyOn(URL, 'revokeObjectURL');
    const { result } = renderHook(() => useZipLoader());
    const file = new File([new Uint8Array([0x50, 0x4b])], 'test.zip');

    await act(async () => {
      await result.current.loadZip(file);
    });

    const urlCount = result.current.pages.length;
    act(() => result.current.cleanup());
    expect(revokeSpy).toHaveBeenCalledTimes(urlCount);
  });
});
