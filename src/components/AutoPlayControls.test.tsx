import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AutoPlayControls } from './AutoPlayControls';

describe('AutoPlayControls', () => {
  it('shows play button when not playing', () => {
    render(
      <AutoPlayControls isPlaying={false} interval={5} onToggle={vi.fn()} onIntervalChange={vi.fn()} />
    );
    expect(screen.getByLabelText('Start auto-play')).toBeInTheDocument();
  });

  it('shows pause button when playing', () => {
    render(
      <AutoPlayControls isPlaying={true} interval={5} onToggle={vi.fn()} onIntervalChange={vi.fn()} />
    );
    expect(screen.getByLabelText('Pause auto-play')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    render(
      <AutoPlayControls isPlaying={false} interval={5} onToggle={onToggle} onIntervalChange={vi.fn()} />
    );
    await userEvent.click(screen.getByLabelText('Start auto-play'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('shows interval value in number input', () => {
    render(
      <AutoPlayControls isPlaying={false} interval={10} onToggle={vi.fn()} onIntervalChange={vi.fn()} />
    );
    const input = screen.getByLabelText('Auto-play interval seconds') as HTMLInputElement;
    expect(input.value).toBe('10');
  });

  it('calls onIntervalChange when slider changes', () => {
    const onIntervalChange = vi.fn();
    render(
      <AutoPlayControls isPlaying={false} interval={5} onToggle={vi.fn()} onIntervalChange={onIntervalChange} />
    );
    fireEvent.change(screen.getByLabelText('Auto-play interval'), { target: { value: '15' } });
    expect(onIntervalChange).toHaveBeenCalledWith(15);
  });
});
