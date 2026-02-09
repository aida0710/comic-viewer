import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Viewer } from './Viewer';
import type { PageSpread } from '../types';
import { createRef } from 'react';

function makeSpread(overrides?: Partial<PageSpread>): PageSpread {
  return {
    left: {
      index: 0,
      filename: 'left.jpg',
      blob: new Blob(),
      url: 'blob:left',
      width: 800,
      height: 1200,
      aspectRatio: 0.67,
      isLandscape: false,
    },
    right: {
      index: 1,
      filename: 'right.jpg',
      blob: new Blob(),
      url: 'blob:right',
      width: 800,
      height: 1200,
      aspectRatio: 0.67,
      isLandscape: false,
    },
    isSingleWide: false,
    ...overrides,
  };
}

describe('Viewer', () => {
  const defaultProps = {
    readingDirection: 'rtl' as const,
    zoom: { scale: 1, translateX: 0, translateY: 0 },
    isZoomed: false,
    onClickLeft: vi.fn(),
    onClickRight: vi.fn(),
    containerRef: createRef<HTMLDivElement>(),
  };

  it('shows message when no spread', () => {
    render(<Viewer {...defaultProps} spread={null} />);
    expect(screen.getByText('No pages to display')).toBeInTheDocument();
  });

  it('renders dual page spread', () => {
    const spread = makeSpread();
    render(<Viewer {...defaultProps} spread={spread} />);
    expect(screen.getByAltText('left.jpg')).toBeInTheDocument();
    expect(screen.getByAltText('right.jpg')).toBeInTheDocument();
  });

  it('renders single wide page', () => {
    const spread = makeSpread({
      right: null,
      isSingleWide: true,
    });
    render(<Viewer {...defaultProps} spread={spread} />);
    expect(screen.getByAltText('left.jpg')).toBeInTheDocument();
  });

  it('calls onClickLeft/Right based on click position', () => {
    const onClickLeft = vi.fn();
    const onClickRight = vi.fn();
    const spread = makeSpread();

    render(
      <Viewer
        {...defaultProps}
        spread={spread}
        onClickLeft={onClickLeft}
        onClickRight={onClickRight}
      />
    );

    const viewer = screen.getByTestId('viewer');
    // Mock getBoundingClientRect
    vi.spyOn(viewer, 'getBoundingClientRect').mockReturnValue({
      left: 0,
      right: 1000,
      width: 1000,
      top: 0,
      bottom: 800,
      height: 800,
      x: 0,
      y: 0,
      toJSON: () => {},
    });

    // Click left side
    fireEvent.click(viewer, { clientX: 200, clientY: 400 });
    expect(onClickLeft).toHaveBeenCalledOnce();

    // Click right side
    fireEvent.click(viewer, { clientX: 800, clientY: 400 });
    expect(onClickRight).toHaveBeenCalledOnce();
  });
});
