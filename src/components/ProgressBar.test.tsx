import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from './ProgressBar';

describe('ProgressBar', () => {
  it('renders nothing when idle', () => {
    const { container } = render(
      <ProgressBar loadingState={{ status: 'idle', progress: 0 }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when ready', () => {
    const { container } = render(
      <ProgressBar loadingState={{ status: 'ready', progress: 100 }} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows progress during loading', () => {
    render(
      <ProgressBar loadingState={{ status: 'loading', progress: 50, fileName: 'test.zip' }} />
    );
    expect(screen.getByText('test.zip')).toBeInTheDocument();
    expect(screen.getByText(/Loading/)).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50');
  });

  it('shows error message', () => {
    render(
      <ProgressBar
        loadingState={{ status: 'error', progress: 0, error: 'Bad file', fileName: 'bad.zip' }}
      />
    );
    expect(screen.getByText('Bad file')).toBeInTheDocument();
  });
});
