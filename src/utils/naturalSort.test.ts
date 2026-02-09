import { describe, it, expect } from 'vitest';
import { naturalSort, sortByFilename } from './naturalSort';

describe('naturalSort', () => {
  it('sorts numbers naturally', () => {
    expect(naturalSort('page1', 'page2')).toBeLessThan(0);
    expect(naturalSort('page2', 'page10')).toBeLessThan(0);
    expect(naturalSort('page10', 'page2')).toBeGreaterThan(0);
  });

  it('sorts equal strings as 0', () => {
    expect(naturalSort('abc', 'abc')).toBe(0);
  });

  it('handles mixed names', () => {
    const files = ['img12.jpg', 'img2.jpg', 'img1.jpg', 'img20.jpg'];
    const sorted = files.sort(naturalSort);
    expect(sorted).toEqual(['img1.jpg', 'img2.jpg', 'img12.jpg', 'img20.jpg']);
  });
});

describe('sortByFilename', () => {
  it('sorts objects by filename', () => {
    const items = [
      { name: 'page10.png' },
      { name: 'page1.png' },
      { name: 'page2.png' },
    ];
    const sorted = sortByFilename(items, (i) => i.name);
    expect(sorted.map((i) => i.name)).toEqual([
      'page1.png',
      'page2.png',
      'page10.png',
    ]);
  });

  it('does not mutate original array', () => {
    const items = [{ name: 'b' }, { name: 'a' }];
    const sorted = sortByFilename(items, (i) => i.name);
    expect(sorted).not.toBe(items);
    expect(items[0].name).toBe('b');
  });
});
