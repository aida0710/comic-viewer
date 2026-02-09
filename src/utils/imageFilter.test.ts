import { describe, it, expect } from 'vitest';
import { isImageFile, filterImageFiles } from './imageFilter';

describe('isImageFile', () => {
  it('accepts common image extensions', () => {
    expect(isImageFile('page1.jpg')).toBe(true);
    expect(isImageFile('page2.jpeg')).toBe(true);
    expect(isImageFile('page3.png')).toBe(true);
    expect(isImageFile('page4.gif')).toBe(true);
    expect(isImageFile('page5.webp')).toBe(true);
    expect(isImageFile('page6.bmp')).toBe(true);
    expect(isImageFile('page7.avif')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isImageFile('PAGE1.JPG')).toBe(true);
    expect(isImageFile('PAGE1.PNG')).toBe(true);
  });

  it('rejects non-image files', () => {
    expect(isImageFile('readme.txt')).toBe(false);
    expect(isImageFile('comic.zip')).toBe(false);
    expect(isImageFile('metadata.xml')).toBe(false);
  });

  it('rejects hidden files', () => {
    expect(isImageFile('.DS_Store')).toBe(false);
    expect(isImageFile('.hidden.jpg')).toBe(false);
  });

  it('rejects __MACOSX resource fork files', () => {
    expect(isImageFile('__MACOSX/._page1.jpg')).toBe(false);
    expect(isImageFile('comic/__MACOSX/page1.jpg')).toBe(false);
  });

  it('handles paths with directories', () => {
    expect(isImageFile('chapter1/page1.jpg')).toBe(true);
    expect(isImageFile('vol1/ch1/001.png')).toBe(true);
  });
});

describe('filterImageFiles', () => {
  it('filters to image files only', () => {
    const files = [
      'page1.jpg',
      'readme.txt',
      '__MACOSX/._page1.jpg',
      'page2.png',
      '.DS_Store',
    ];
    expect(filterImageFiles(files)).toEqual(['page1.jpg', 'page2.png']);
  });
});
