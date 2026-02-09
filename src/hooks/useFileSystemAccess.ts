import { useState, useCallback } from 'react';

interface ZipFileEntry {
  name: string;
  handle: FileSystemFileHandle;
}

export function useFileSystemAccess() {
  const [zipFiles, setZipFiles] = useState<ZipFileEntry[]>([]);
  const [isSupported] = useState(() => 'showDirectoryPicker' in window);

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
    setZipFiles([]);
  }, []);

  return { zipFiles, isSupported, openDirectory, getFile, clearFiles };
}
