import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PageNavigator } from './PageNavigator';

describe('PageNavigator', () => {
  const defaultProps = {
    currentIndex: 0,
    totalSpreads: 10,
    totalPages: 20,
    currentPageNumbers: [1, 2],
    readingDirection: 'rtl' as const,
    onGoTo: vi.fn(),
    onGoToPage: vi.fn(),
  };

  it('shows current page numbers', () => {
    render(<PageNavigator {...defaultProps} />);
    expect(screen.getByText('1-2 / 20')).toBeInTheDocument();
  });

  it('shows slider', () => {
    render(<PageNavigator {...defaultProps} />);
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('shows page jump input on button click', async () => {
    render(<PageNavigator {...defaultProps} />);
    await userEvent.click(screen.getByTitle('Jump to page'));
    expect(screen.getByRole('spinbutton', { name: 'Jump to page' })).toBeInTheDocument();
  });

  it('handles page jump', async () => {
    const onGoToPage = vi.fn();
    render(<PageNavigator {...defaultProps} onGoToPage={onGoToPage} />);

    await userEvent.click(screen.getByTitle('Jump to page'));
    const input = screen.getByRole('spinbutton', { name: 'Jump to page' });
    await userEvent.type(input, '5');
    fireEvent.submit(input.closest('form')!);

    expect(onGoToPage).toHaveBeenCalledWith(4); // 0-indexed
  });

  it('calls onGoTo when slider changes', () => {
    const onGoTo = vi.fn();
    render(<PageNavigator {...defaultProps} onGoTo={onGoTo} />);

    fireEvent.change(screen.getByRole('slider'), { target: { value: '5' } });
    expect(onGoTo).toHaveBeenCalled();
  });
});
