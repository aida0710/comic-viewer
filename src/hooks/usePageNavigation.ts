import { useState, useMemo, useCallback } from 'react';
import type { ComicPage, PageSpread, ViewMode, ReadingDirection } from '../types';

export function usePageNavigation(
  pages: ComicPage[],
  viewMode: ViewMode,
  readingDirection: ReadingDirection
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const spreads = useMemo(() => {
    if (pages.length === 0) return [];

    if (viewMode === 'single') {
      return pages.map((page): PageSpread => ({
        left: readingDirection === 'ltr' ? page : null,
        right: readingDirection === 'rtl' ? page : null,
        isSingleWide: false,
      }));
    }

    // Dual mode: compute spreads
    const result: PageSpread[] = [];
    let i = 0;

    // First page (cover) is always shown alone
    if (pages.length > 0) {
      const first = pages[0];
      result.push({
        left: readingDirection === 'rtl' ? null : first,
        right: readingDirection === 'rtl' ? first : null,
        isSingleWide: first.isLandscape,
      });
      i = 1;
    }

    while (i < pages.length) {
      const page = pages[i];

      // Landscape pages shown alone
      if (page.isLandscape) {
        result.push({
          left: page,
          right: null,
          isSingleWide: true,
        });
        i++;
        continue;
      }

      // If there's a next page and it's not landscape, pair them
      const next = i + 1 < pages.length ? pages[i + 1] : null;
      if (next && !next.isLandscape) {
        if (readingDirection === 'rtl') {
          result.push({ left: next, right: page, isSingleWide: false });
        } else {
          result.push({ left: page, right: next, isSingleWide: false });
        }
        i += 2;
      } else {
        // Single page remaining
        result.push({
          left: readingDirection === 'ltr' ? page : null,
          right: readingDirection === 'rtl' ? page : null,
          isSingleWide: false,
        });
        i++;
      }
    }

    return result;
  }, [pages, viewMode, readingDirection]);

  const totalSpreads = spreads.length;
  const safeIndex = Math.min(currentIndex, Math.max(0, totalSpreads - 1));
  const currentSpread = spreads[safeIndex] ?? null;

  // Compute which page numbers are shown for display
  const currentPageNumbers = useMemo(() => {
    if (!currentSpread) return [];
    const nums: number[] = [];
    if (currentSpread.left) nums.push(currentSpread.left.index + 1);
    if (currentSpread.right) nums.push(currentSpread.right.index + 1);
    return nums.sort((a, b) => a - b);
  }, [currentSpread]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalSpreads - 1));
  }, [totalSpreads]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goTo = useCallback(
    (spreadIndex: number) => {
      setCurrentIndex(Math.max(0, Math.min(spreadIndex, totalSpreads - 1)));
    },
    [totalSpreads]
  );

  const goToPage = useCallback(
    (pageIndex: number) => {
      // Find the spread containing this page
      const spreadIdx = spreads.findIndex(
        (s) => s.left?.index === pageIndex || s.right?.index === pageIndex
      );
      if (spreadIdx >= 0) {
        setCurrentIndex(spreadIdx);
      }
    },
    [spreads]
  );

  const canGoNext = safeIndex < totalSpreads - 1;
  const canGoPrev = safeIndex > 0;
  const isLastSpread = safeIndex === totalSpreads - 1;

  return {
    currentIndex: safeIndex,
    currentSpread,
    currentPageNumbers,
    totalSpreads,
    totalPages: pages.length,
    spreads,
    goNext,
    goPrev,
    goTo,
    goToPage,
    canGoNext,
    canGoPrev,
    isLastSpread,
    setCurrentIndex,
  };
}
