import { useState, useCallback, useRef } from 'react';
import { unzip } from 'fflate';
import type { ZipFileEntry } from '../types';
import { isImageFile } from '../utils/imageFilter';

async function extractFirstImageUrl(file: File): Promise<string | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const uint8 = new Uint8Array(arrayBuffer);

    // 最初の画像1枚だけ展開（ZIP全体の展開を回避してメモリ節約）
    let found = false;
    const files = await new Promise<Record<string, Uint8Array>>((resolve, reject) => {
      unzip(uint8, {
        filter: (info) => {
          if (found) return false;
          if (isImageFile(info.name)) {
            found = true;
            return true;
          }
          return false;
        },
      }, (err, data) => { if (err) reject(err); else resolve(data); });
    });

    const imageName = Object.keys(files).find(isImageFile);
    if (!imageName) return null;
    const blob = new Blob([files[imageName] as BlobPart]);
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
  const extractionIdRef = useRef(0);

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

      // 全サムネイルを並列で非同期抽出（awaitしない→UIをブロックしない）
      const currentId = ++extractionIdRef.current;

      const extractions = files.map(async (entry) => {
        try {
          if ((await entry.handle.queryPermission({ mode: 'read' })) !== 'granted') {
            const r = await entry.handle.requestPermission({ mode: 'read' });
            if (r !== 'granted') return;
          }
          const file = await entry.handle.getFile();
          const url = await extractFirstImageUrl(file);
          if (extractionIdRef.current !== currentId) return;
          if (url) {
            thumbnailUrlsRef.current.push(url);
            setThumbnails(prev => new Map(prev).set(entry.name, url));
          }
        } catch { /* skip */ }
      });

      Promise.allSettled(extractions).then(() => {
        if (extractionIdRef.current === currentId) setThumbnailsLoading(false);
      });
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
