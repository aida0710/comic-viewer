const IMAGE_EXTENSIONS = new Set([
  '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.avif',
]);

export function isImageFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  // Skip hidden files and macOS resource forks
  const basename = lower.split('/').pop() ?? '';
  if (basename.startsWith('.') || basename.startsWith('__macosx')) return false;
  if (lower.includes('__macosx/')) return false;

  const dotIndex = basename.lastIndexOf('.');
  if (dotIndex === -1) return false;
  return IMAGE_EXTENSIONS.has(basename.slice(dotIndex));
}

export function filterImageFiles(filenames: string[]): string[] {
  return filenames.filter(isImageFile);
}
