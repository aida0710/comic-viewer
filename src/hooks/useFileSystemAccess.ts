import { useState, useCallback, useRef } from 'react';
import { unzip } from 'fflate';
import type { ZipFileEntry } from '../types';
import { isImageFile } from '../utils/imageFilter';
import { naturalSort } from '../utils/naturalSort';

async function extractFirstImageUrl(file: File): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);
    const files = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
      unzip(uint8, (err, data) => { if (err) reject(err); else resolve(data); });
    });
    const imageNames = Object.keys(files).filter(isImageFile).sort(naturalSort);
    if (imageNames.length === 0) return null;
    const blob = new Blob([files[imageNames[0]] as BlobPart]);
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}

export function useFileSystemAccess() {
  const [zipFiles, setZipFiles] = useState<ZipFileEntry[]>([]);
  const [isSupported] = useState(() => 'showDirectoryPicker' in window);
  const [thumbnails, setThumbnails] = useState<Map<string, string>>(new Map());
  const [thumbnailsLoading, setThumbnailsLoading] = useState(false);
  const thumbnailUrlsRef = useRef<string[]>([]);

  const openDirectory = useCallback(async () => {
    if (!window.showDirectoryPicker) return;

    try {
      const dirHandle = await window.showDirectoryPicker({ mode: 'read' });
      const files: ZipFileEntry[] = [];

      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.zip')) {
          files.push({ name: entry.name, handle: entry as FileSystemFileHandle });
        }
      }

      files.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
      setZipFiles(files);

      // 前回分のURL解放
      for (const url of thumbnailUrlsRef.current) URL.revokeObjectURL(url);
      thumbnailUrlsRef.current = [];

      setThumbnailsLoading(true);
      setThumbnails(new Map());

      const newMap = new Map<string, string>();
      const newUrls: string[] = [];

      // 4件ずつ並列処理（メモリ・スレッドのバランス）
      const BATCH = 4;
      for (let i = 0; i < files.length; i += BATCH) {
        await Promise.all(
          files.slice(i, i + BATCH).map(async (entry) => {
            try {
              if ((await entry.handle.queryPermission({ mode: 'read' })) !== 'granted') {
                const r = await entry.handle.requestPermission({ mode: 'read' });
                if (r !== 'granted') return;
              }
              const file = await entry.handle.getFile();
              const url = await extractFirstImageUrl(file);
              if (url) {
                newMap.set(entry.name, url);
                newUrls.push(url);
              }
            } catch { /* URLなしのまま → プレースホルダー表示 */ }
          })
        );
        // バッチ完了ごとに中間結果をフラッシュ（グリッドが段階的に埋まる）
        setThumbnails(new Map(newMap));
      }

      thumbnailUrlsRef.current = newUrls;
      setThumbnailsLoading(false);
    } catch {
      // User cancelled or permission denied
    }
  }, []);

  const getFile = useCallback(async (entry: ZipFileEntry): Promise<File> => {
    if ((await entry.handle.queryPermission({ mode: 'read' })) !== 'granted') {
      const result = await entry.handle.requestPermission({ mode: 'read' });
      if (result !== 'granted') {
        throw new Error(`Permission denied for ${entry.name}`);
      }
    }
    return entry.handle.getFile();
  }, []);

  const clearFiles = useCallback(() => {
    for (const url of thumbnailUrlsRef.current) URL.revokeObjectURL(url);
    thumbnailUrlsRef.current = [];
    setZipFiles([]);
    setThumbnails(new Map());
    setThumbnailsLoading(false);
  }, []);

  return { zipFiles, isSupported, openDirectory, getFile, clearFiles, thumbnails, thumbnailsLoading };
}
