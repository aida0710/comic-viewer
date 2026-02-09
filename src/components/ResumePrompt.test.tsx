import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ResumePrompt } from './ResumePrompt';

describe('ResumePrompt', () => {
  const position = {
    fileName: 'manga.zip',
    page: 24,
    totalPages: 100,
    timestamp: Date.now(),
  };

  it('shows position info', () => {
    render(
      <ResumePrompt position={position} onResume={vi.fn()} onStartOver={vi.fn()} />
    );
    expect(screen.getByText(/page 25 of 100/)).toBeInTheDocument();
    expect(screen.getByText(/24%/)).toBeInTheDocument();
  });

  it('calls onResume when Continue clicked', async () => {
    const onResume = vi.fn();
    render(
      <ResumePrompt position={position} onResume={onResume} onStartOver={vi.fn()} />
    );
    await userEvent.click(screen.getByText('Continue'));
    expect(onResume).toHaveBeenCalledOnce();
  });

  it('calls onStartOver when Start Over clicked', async () => {
    const onStartOver = vi.fn();
    render(
      <ResumePrompt position={position} onResume={vi.fn()} onStartOver={onStartOver} />
    );
    await userEvent.click(screen.getByText('Start Over'));
    expect(onStartOver).toHaveBeenCalledOnce();
  });
});
