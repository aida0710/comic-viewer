import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Toolbar } from './Toolbar';

describe('Toolbar', () => {
  const defaultProps = {
    currentIndex: 0,
    totalSpreads: 10,
    totalPages: 20,
    currentPageNumbers: [1, 2],
    readingDirection: 'rtl' as const,
    onGoTo: vi.fn(),
    onGoToPage: vi.fn(),
    isZoomed: false,
    onZoomIn: vi.fn(),
    onZoomOut: vi.fn(),
    onResetZoom: vi.fn(),
    theme: 'dark' as const,
    onToggleTheme: vi.fn(),
    isFullscreen: false,
    onToggleFullscreen: vi.fn(),
    isAutoPlaying: false,
    onToggleAutoPlay: vi.fn(),
    onToggleSettings: vi.fn(),
    onClose: vi.fn(),
    viewMode: 'dual' as const,
  };

  it('renders toolbar with all controls', () => {
    render(<Toolbar {...defaultProps} />);
    expect(screen.getByLabelText('Page slider')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Enter fullscreen')).toBeInTheDocument();
    expect(screen.getByLabelText('Settings')).toBeInTheDocument();
    expect(screen.getByLabelText('Close')).toBeInTheDocument();
  });

  it('is always visible in the document', () => {
    render(<Toolbar {...defaultProps} />);
    const toolbar = screen.getByTestId('toolbar');
    expect(toolbar).toBeInTheDocument();
  });
});
