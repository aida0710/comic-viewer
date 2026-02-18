import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DirectoryBrowser } from './DirectoryBrowser';

describe('DirectoryBrowser', () => {
  const defaultThumbnailProps = {
    thumbnails: new Map<string, string>(),
    thumbnailsLoading: false,
  };

  it('renders nothing when not supported', () => {
    const { container } = render(
      <DirectoryBrowser
        zipFiles={[]}
        isSupported={false}
        onOpenDirectory={vi.fn()}
        onSelectFile={vi.fn()}
        {...defaultThumbnailProps}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders open folder button when supported', () => {
    render(
      <DirectoryBrowser
        zipFiles={[]}
        isSupported={true}
        onOpenDirectory={vi.fn()}
        onSelectFile={vi.fn()}
        {...defaultThumbnailProps}
      />
    );
    expect(screen.getByText('Open Folder')).toBeInTheDocument();
  });

  it('lists zip files', () => {
    const files = [
      { name: 'manga1.zip', handle: {} as FileSystemFileHandle },
      { name: 'manga2.zip', handle: {} as FileSystemFileHandle },
    ];
    render(
      <DirectoryBrowser
        zipFiles={files}
        isSupported={true}
        onOpenDirectory={vi.fn()}
        onSelectFile={vi.fn()}
        {...defaultThumbnailProps}
      />
    );
    expect(screen.getByText('manga1.zip')).toBeInTheDocument();
    expect(screen.getByText('manga2.zip')).toBeInTheDocument();
  });

  it('calls onSelectFile when file clicked', async () => {
    const onSelectFile = vi.fn();
    const files = [{ name: 'manga1.zip', handle: {} as FileSystemFileHandle }];
    render(
      <DirectoryBrowser
        zipFiles={files}
        isSupported={true}
        onOpenDirectory={vi.fn()}
        onSelectFile={onSelectFile}
        {...defaultThumbnailProps}
      />
    );
    await userEvent.click(screen.getByText('manga1.zip'));
    expect(onSelectFile).toHaveBeenCalledWith(files[0]);
  });
});
