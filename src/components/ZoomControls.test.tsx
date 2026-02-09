import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ZoomControls } from './ZoomControls';

describe('ZoomControls', () => {
  it('renders zoom in and out buttons', () => {
    render(
      <ZoomControls isZoomed={false} onZoomIn={vi.fn()} onZoomOut={vi.fn()} onResetZoom={vi.fn()} />
    );
    expect(screen.getByLabelText('Zoom in')).toBeInTheDocument();
    expect(screen.getByLabelText('Zoom out')).toBeInTheDocument();
  });

  it('shows reset button only when zoomed', () => {
    const { rerender } = render(
      <ZoomControls isZoomed={false} onZoomIn={vi.fn()} onZoomOut={vi.fn()} onResetZoom={vi.fn()} />
    );
    expect(screen.queryByLabelText('Reset zoom')).not.toBeInTheDocument();

    rerender(
      <ZoomControls isZoomed={true} onZoomIn={vi.fn()} onZoomOut={vi.fn()} onResetZoom={vi.fn()} />
    );
    expect(screen.getByLabelText('Reset zoom')).toBeInTheDocument();
  });

  it('calls callbacks on click', async () => {
    const onZoomIn = vi.fn();
    const onZoomOut = vi.fn();
    render(
      <ZoomControls isZoomed={false} onZoomIn={onZoomIn} onZoomOut={onZoomOut} onResetZoom={vi.fn()} />
    );

    await userEvent.click(screen.getByLabelText('Zoom in'));
    expect(onZoomIn).toHaveBeenCalledOnce();

    await userEvent.click(screen.getByLabelText('Zoom out'));
    expect(onZoomOut).toHaveBeenCalledOnce();
  });
});
