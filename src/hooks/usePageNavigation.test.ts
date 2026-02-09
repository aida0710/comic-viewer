import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePageNavigation } from './usePageNavigation';
import type { ComicPage } from '../types';

function makePage(index: number, isLandscape = false): ComicPage {
  const width = isLandscape ? 1200 : 800;
  const height = isLandscape ? 800 : 1200;
  return {
    index,
    filename: `page${index}.jpg`,
    blob: new Blob(),
    url: `blob:page${index}`,
    width,
    height,
    aspectRatio: width / height,
    isLandscape,
  };
}

describe('usePageNavigation', () => {
  it('returns empty spread for no pages', () => {
    const { result } = renderHook(() => usePageNavigation([], 'single', 'rtl'));
    expect(result.current.totalSpreads).toBe(0);
    expect(result.current.currentSpread).toBeNull();
  });

  describe('single mode', () => {
    const pages = [makePage(0), makePage(1), makePage(2)];

    it('creates one spread per page', () => {
      const { result } = renderHook(() => usePageNavigation(pages, 'single', 'rtl'));
      expect(result.current.totalSpreads).toBe(3);
    });

    it('navigates forward and back', () => {
      const { result } = renderHook(() => usePageNavigation(pages, 'single', 'rtl'));
      expect(result.current.currentIndex).toBe(0);

      act(() => result.current.goNext());
      expect(result.current.currentIndex).toBe(1);

      act(() => result.current.goPrev());
      expect(result.current.currentIndex).toBe(0);
    });

    it('clamps at boundaries', () => {
      const { result } = renderHook(() => usePageNavigation(pages, 'single', 'rtl'));
      act(() => result.current.goPrev());
      expect(result.current.currentIndex).toBe(0);

      act(() => result.current.goTo(2));
      act(() => result.current.goNext());
      expect(result.current.currentIndex).toBe(2);
    });
  });

  describe('dual mode RTL', () => {
    it('puts cover alone', () => {
      const pages = [makePage(0), makePage(1), makePage(2), makePage(3)];
      const { result } = renderHook(() => usePageNavigation(pages, 'dual', 'rtl'));

      // First spread: cover alone on right
      expect(result.current.spreads[0].right?.index).toBe(0);
      expect(result.current.spreads[0].left).toBeNull();
    });

    it('pairs portrait pages in RTL order', () => {
      const pages = [makePage(0), makePage(1), makePage(2), makePage(3), makePage(4)];
      const { result } = renderHook(() => usePageNavigation(pages, 'dual', 'rtl'));

      // Second spread: pages 1 and 2, RTL means 2 on left, 1 on right
      expect(result.current.spreads[1].right?.index).toBe(1);
      expect(result.current.spreads[1].left?.index).toBe(2);
    });

    it('handles landscape pages as single wide', () => {
      const pages = [makePage(0), makePage(1, true), makePage(2)];
      const { result } = renderHook(() => usePageNavigation(pages, 'dual', 'rtl'));

      // Landscape page should be single wide
      const landscapeSpread = result.current.spreads.find((s) => s.isSingleWide && s.left?.index === 1);
      expect(landscapeSpread).toBeDefined();
    });
  });

  describe('dual mode LTR', () => {
    it('pairs portrait pages in LTR order', () => {
      const pages = [makePage(0), makePage(1), makePage(2), makePage(3), makePage(4)];
      const { result } = renderHook(() => usePageNavigation(pages, 'dual', 'ltr'));

      // Second spread: pages 1 and 2, LTR means 1 on left, 2 on right
      expect(result.current.spreads[1].left?.index).toBe(1);
      expect(result.current.spreads[1].right?.index).toBe(2);
    });
  });

  it('goToPage finds correct spread', () => {
    const pages = [makePage(0), makePage(1), makePage(2), makePage(3), makePage(4)];
    const { result } = renderHook(() => usePageNavigation(pages, 'dual', 'rtl'));

    act(() => result.current.goToPage(3));
    // Page 3 should be in some spread
    const spread = result.current.currentSpread;
    expect(spread?.left?.index === 3 || spread?.right?.index === 3).toBe(true);
  });

  it('reports canGoNext and canGoPrev correctly', () => {
    const pages = [makePage(0), makePage(1)];
    const { result } = renderHook(() => usePageNavigation(pages, 'single', 'rtl'));

    expect(result.current.canGoPrev).toBe(false);
    expect(result.current.canGoNext).toBe(true);

    act(() => result.current.goNext());
    expect(result.current.canGoPrev).toBe(true);
    expect(result.current.canGoNext).toBe(false);
  });
});
