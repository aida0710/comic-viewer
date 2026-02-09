import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsPanel } from './SettingsPanel';
import type { Settings } from '../types';

describe('SettingsPanel', () => {
  const defaultSettings: Settings = {
    viewMode: 'dual',
    readingDirection: 'rtl',
    autoTurnInterval: 5,
    theme: 'dark',
  };

  const defaultProps = {
    settings: defaultSettings,
    isAutoPlaying: false,
    onSetViewMode: vi.fn(),
    onSetReadingDirection: vi.fn(),
    onSetAutoTurnInterval: vi.fn(),
    onToggleAutoPlay: vi.fn(),
    onClose: vi.fn(),
  };

  it('renders settings panel', () => {
    render(<SettingsPanel {...defaultProps} />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Single Page')).toBeInTheDocument();
    expect(screen.getByText('Dual Page')).toBeInTheDocument();
    expect(screen.getByText('Right to Left')).toBeInTheDocument();
    expect(screen.getByText('Left to Right')).toBeInTheDocument();
  });

  it('calls onSetViewMode when view mode clicked', async () => {
    const onSetViewMode = vi.fn();
    render(<SettingsPanel {...defaultProps} onSetViewMode={onSetViewMode} />);
    await userEvent.click(screen.getByText('Single Page'));
    expect(onSetViewMode).toHaveBeenCalledWith('single');
  });

  it('calls onSetReadingDirection when direction clicked', async () => {
    const onSetReadingDirection = vi.fn();
    render(<SettingsPanel {...defaultProps} onSetReadingDirection={onSetReadingDirection} />);
    await userEvent.click(screen.getByText('Left to Right'));
    expect(onSetReadingDirection).toHaveBeenCalledWith('ltr');
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    render(<SettingsPanel {...defaultProps} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText('Close settings'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
