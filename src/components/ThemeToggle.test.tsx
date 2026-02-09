import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';

describe('ThemeToggle', () => {
  it('shows sun icon in dark mode', () => {
    render(<ThemeToggle theme="dark" onToggle={() => {}} />);
    expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument();
  });

  it('shows moon icon in light mode', () => {
    render(<ThemeToggle theme="light" onToggle={() => {}} />);
    expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    render(<ThemeToggle theme="dark" onToggle={onToggle} />);
    await userEvent.click(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
