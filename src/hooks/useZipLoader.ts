import { useState, useCallback, useRef } from 'react';
import { unzip } from 'fflate';
import type { ComicPage, LoadingState } from '../types';
import { isImageFile } from '../utils/imageFilter';
import { naturalSort } from '../utils/naturalSort';

function loadImageDimensions(_blob: Blob, url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = url;
  });
}

export function useZipLoader() {
  const [loadingState, setLoadingState] = useState<LoadingState>({
    status: 'idle',
    progress: 0,
  });
  const [pages, setPages] = useState<ComicPage[]>([]);
  const objectUrlsRef = useRef<string[]>([]);

  const cleanup = useCallback(() => {
    for (const url of objectUrlsRef.current) {
      URL.revokeObjectURL(url);
    }
    objectUrlsRef.current = [];
    setPages([]);
    setLoadingState({ status: 'idle', progress: 0 });
  }, []);

  const loadZip = useCallback(async (file: File) => {
    cleanup();

    setLoadingState({
      status: 'loading',
      progress: 0,
      fileName: file.name,
    });

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      setLoadingState((prev) => ({ ...prev, status: 'extracting', progress: 10 }));

      const files = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
        unzip(uint8, (err, data) => {
          if (err) reject(err);
          else resolve(data);
        });
      });

      const imageEntries = Object.entries(files)
        .filter(([name]) => isImageFile(name))
        .sort(([a], [b]) => naturalSort(a, b));

      if (imageEntries.length === 0) {
        setLoadingState({
          status: 'error',
          progress: 0,
          error: 'No image files found in ZIP',
          fileName: file.name,
        });
        return;
      }

      const totalImages = imageEntries.length;
      const comicPages: ComicPage[] = [];
      const urls: string[] = [];

      for (let i = 0; i < imageEntries.length; i++) {
        const [filename, data] = imageEntries[i];
        const blob = new Blob([data as BlobPart]);
        const url = URL.createObjectURL(blob);
        urls.push(url);

        try {
          const { width, height } = await loadImageDimensions(blob, url);
          const aspectRatio = width / height;

          comicPages.push({
            index: i,
            filename,
            blob,
            url,
            width,
            height,
            aspectRatio,
            isLandscape: aspectRatio > 1.2,
          });
        } catch {
          // Skip images that fail to load
        }

        setLoadingState((prev) => ({
          ...prev,
          progress: 10 + Math.round(((i + 1) / totalImages) * 90),
        }));
      }

      objectUrlsRef.current = urls;
      setPages(comicPages);
      setLoadingState({
        status: 'ready',
        progress: 100,
        fileName: file.name,
      });
    } catch (err) {
      setLoadingState({
        status: 'error',
        progress: 0,
        error: err instanceof Error ? err.message : 'Failed to load ZIP file',
        fileName: file.name,
      });
    }
  }, [cleanup]);

  return { loadingState, pages, loadZip, cleanup };
}
