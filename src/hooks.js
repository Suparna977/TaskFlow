import { useCallback, useEffect, useState } from 'react';

const THEME_KEY = 'taskflow-theme';

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStored(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage can be unavailable (private mode, quota) — the app still works.
  }
}

// A string state that survives page reloads.
export function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => readStored(key, initialValue));

  useEffect(() => {
    writeStored(key, value);
  }, [key, value]);

  return [value, setValue];
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const saved = readStored(THEME_KEY, null);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    writeStored(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(
    () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    []
  );

  return [theme, toggleTheme];
}
