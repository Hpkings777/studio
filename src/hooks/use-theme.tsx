'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

interface Theme {
  backgroundColor: string;
  color: string;
}

interface ThemeContextType {
  theme: Theme;
  setTheme: (birthdayId: string, newTheme: Theme) => void;
  themeStyles: React.CSSProperties;
}

const THEME_STORAGE_PREFIX = 'birthday-theme-';

const defaultTheme: Theme = {
  backgroundColor: '#40798C', 
  color: '#FFFFFF',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, _setTheme] = useState<Theme>(defaultTheme);
  const [birthdayId, setBirthdayId] = useState<string | null>(null);

  useEffect(() => {
    const id = window.location.pathname.split('/birthday/')[1];
    if (id) {
      setBirthdayId(id);
      const storedTheme = localStorage.getItem(`${THEME_STORAGE_PREFIX}${id}`);
      if (storedTheme) {
        _setTheme(JSON.parse(storedTheme));
      } else {
        _setTheme(defaultTheme);
      }
    }
  }, []);

  const setTheme = (id: string, newTheme: Theme) => {
    localStorage.setItem(`${THEME_STORAGE_PREFIX}${id}`, JSON.stringify(newTheme));
    _setTheme(newTheme);
  };
  
  const themeStyles = useMemo(() => ({
    '--page-background-color': theme.backgroundColor,
    '--page-text-color': theme.color,
    backgroundColor: 'var(--page-background-color)',
    color: 'var(--page-text-color)',
    transition: 'background-color 0.5s, color 0.5s',
  } as React.CSSProperties), [theme]);


  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeStyles }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
