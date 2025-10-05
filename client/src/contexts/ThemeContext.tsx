import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define the Theme state and context structure
type Theme = 'dark' | 'light' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 2. Define the Provider component
interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

// This component manages the theme state and applies the 'dark' class to the HTML root element.
export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
  
  // Initialize state from local storage or default
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // 3. Effect to manage the 'dark' class on the HTML element
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Always clear both classes to ensure a clean slate
    root.classList.remove('light', 'dark');

    // Determine the actual theme based on state
    const actualTheme = 
      theme === 'system' 
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : theme;

    // Apply the active theme class
    root.classList.add(actualTheme);
    
    // Store the selected preference in local storage
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // 4. Function to change the theme
  const setTheme = (theme: Theme) => {
    setThemeState(theme);
  };

  const value = {
    theme,
    setTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// 5. Custom hook to consume the context
export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    // This will now throw the error in the correct context, not in the broken file's imports
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
