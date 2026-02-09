interface FileSystemDirectoryHandle {
  kind: 'directory';
  name: string;
  values(): AsyncIterableIterator<FileSystemHandle>;
  getFileHandle(name: string): Promise<FileSystemFileHandle>;
}

interface FileSystemPermissionDescriptor {
  mode?: 'read' | 'readwrite';
}

interface FileSystemFileHandle {
  kind: 'file';
  name: string;
  getFile(): Promise<File>;
  queryPermission(descriptor?: FileSystemPermissionDescriptor): Promise<PermissionState>;
  requestPermission(descriptor?: FileSystemPermissionDescriptor): Promise<PermissionState>;
}

type FileSystemHandle = FileSystemDirectoryHandle | FileSystemFileHandle;

interface ShowDirectoryPickerOptions {
  id?: string;
  mode?: 'read' | 'readwrite';
  startIn?: 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos';
}

interface Window {
  showDirectoryPicker?: (options?: ShowDirectoryPickerOptions) => Promise<FileSystemDirectoryHandle>;
}
