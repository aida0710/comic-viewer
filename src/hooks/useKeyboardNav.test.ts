import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useKeyboardNav } from './useKeyboardNav';
import { fireEvent } from '@testing-library/react';

describe('useKeyboardNav', () => {
  it('calls onNext on ArrowRight in LTR mode', () => {
    const onNext = vi.fn();
    const onPrev = vi.fn();
    renderHook(() => useKeyboardNav({ onNext, onPrev, readingDirection: 'ltr' }));

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(onNext).toHaveBeenCalledOnce();
    expect(onPrev).not.toHaveBeenCalled();
  });

  it('calls onPrev on ArrowRight in RTL mode', () => {
    const onNext = vi.fn();
    const onPrev = vi.fn();
    renderHook(() => useKeyboardNav({ onNext, onPrev, readingDirection: 'rtl' }));

    fireEvent.keyDown(document, { key: 'ArrowRight' });
    expect(onPrev).toHaveBeenCalledOnce();
    expect(onNext).not.toHaveBeenCalled();
  });

  it('calls onNext on ArrowLeft in RTL mode', () => {
    const onNext = vi.fn();
    const onPrev = vi.fn();
    renderHook(() => useKeyboardNav({ onNext, onPrev, readingDirection: 'rtl' }));

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('calls onNext on Space', () => {
    const onNext = vi.fn();
    renderHook(() => useKeyboardNav({ onNext, onPrev: vi.fn(), readingDirection: 'rtl' }));

    fireEvent.keyDown(document, { key: ' ' });
    expect(onNext).toHaveBeenCalledOnce();
  });

  it('does not fire when disabled', () => {
    const onNext = vi.fn();
    renderHook(() =>
      useKeyboardNav({ onNext, onPrev: vi.fn(), readingDirection: 'rtl', enabled: false })
    );

    fireEvent.keyDown(document, { key: 'ArrowLeft' });
    expect(onNext).not.toHaveBeenCalled();
  });

  it('does not fire when typing in input', () => {
    const onNext = vi.fn();
    renderHook(() => useKeyboardNav({ onNext, onPrev: vi.fn(), readingDirection: 'ltr' }));

    const input = document.createElement('input');
    document.body.appendChild(input);
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(onNext).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });
});
