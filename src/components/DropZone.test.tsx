import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropZone } from './DropZone';

describe('DropZone', () => {
  const defaultProps = {
    onFileSelect: vi.fn(),
    loadingState: { status: 'idle' as const, progress: 0 },
  };

  it('renders drop zone text', () => {
    render(<DropZone {...defaultProps} />);
    expect(screen.getByText('Drop a ZIP file here')).toBeInTheDocument();
    expect(screen.getByText('or click to select')).toBeInTheDocument();
  });

  it('handles file drop', () => {
    const onFileSelect = vi.fn();
    render(<DropZone {...defaultProps} onFileSelect={onFileSelect} />);

    const dropZone = screen.getByRole('button');
    const file = new File(['content'], 'test.zip', { type: 'application/zip' });

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(onFileSelect).toHaveBeenCalledWith(file);
  });

  it('ignores non-zip files on drop', () => {
    const onFileSelect = vi.fn();
    render(<DropZone {...defaultProps} onFileSelect={onFileSelect} />);

    const dropZone = screen.getByRole('button');
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [file] },
    });

    expect(onFileSelect).not.toHaveBeenCalled();
  });

  it('shows progress bar during loading', () => {
    render(
      <DropZone
        onFileSelect={vi.fn()}
        loadingState={{ status: 'loading', progress: 30, fileName: 'manga.zip' }}
      />
    );
    expect(screen.getByText('manga.zip')).toBeInTheDocument();
  });
});
