import type { Theme } from '../types';
import { SunIcon, MoonIcon } from './Icons';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="p-2 rounded-xl hover:bg-rose-100/60 dark:hover:bg-rose-900/40 transition-all duration-300"
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
    >
      <span className="block transition-transform duration-300 hover:rotate-12">
        {theme === 'dark' ? (
          <SunIcon width={20} height={20} className="text-peach-400" />
        ) : (
          <MoonIcon width={20} height={20} className="text-lavender-400" />
        )}
      </span>
    </button>
  );
}
