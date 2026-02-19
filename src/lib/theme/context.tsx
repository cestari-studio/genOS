'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type CarbonTheme = 'g10' | 'g100';

interface ThemeContextValue {
  theme: CarbonTheme;
  sidebarTheme: CarbonTheme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'g10',
  sidebarTheme: 'g100',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<CarbonTheme>('g10');

  useEffect(() => {
    const saved = localStorage.getItem('genos-theme') as CarbonTheme | null;
    if (saved === 'g10' || saved === 'g100') {
      setTheme(saved);
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'g10' ? 'g100' : 'g10';
      localStorage.setItem('genos-theme', next);
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, sidebarTheme: 'g100', toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
