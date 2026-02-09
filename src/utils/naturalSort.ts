const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
});

export function naturalSort(a: string, b: string): number {
  return collator.compare(a, b);
}

export function sortByFilename<T>(items: T[], getFilename: (item: T) => string): T[] {
  return [...items].sort((a, b) => naturalSort(getFilename(a), getFilename(b)));
}
