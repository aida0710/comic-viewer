import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../App';

// Mock fflate
vi.mock('fflate', () => ({
  unzip: vi.fn((_data: Uint8Array, cb: (err: Error | null, result: Record<string, Uint8Array>) => void) => {
    cb(null, {
      'page01.jpg': new Uint8Array([0xff, 0xd8]),
      'page02.jpg': new Uint8Array([0xff, 0xd8]),
      'page03.jpg': new Uint8Array([0xff, 0xd8]),
    });
  }),
}));

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove('dark');

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
});

describe('Reading Flow Integration', () => {
  it('renders drop zone initially', () => {
    render(<App />);
    expect(screen.getByText('Drop a ZIP file here')).toBeInTheDocument();
  });

  it('shows file select prompt', () => {
    render(<App />);
    expect(screen.getByText('or click to select')).toBeInTheDocument();
  });
});
