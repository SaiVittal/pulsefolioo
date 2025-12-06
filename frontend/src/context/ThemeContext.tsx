import React, { createContext, useState, useMemo, useCallback } from 'react';
import { theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = theme;

interface ThemeContextType {
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  antdAlgorithm: typeof defaultAlgorithm;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleTheme = useCallback(() => {
    // 1. Start the animation
    setIsAnimating(true);
    
    // 2. Toggle the theme after a short delay (e.g., 200ms) to let the animation start
    setTimeout(() => {
        setThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    }, 200);

    // 3. Stop the animation after the full animation duration (e.g., 600ms)
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); 

  }, []);

  const antdAlgorithm = useMemo(() => {
    return themeMode === 'light' ? defaultAlgorithm : darkAlgorithm;
  }, [themeMode]);

  const value = useMemo(() => ({ 
      themeMode, 
      toggleTheme, 
      antdAlgorithm 
  }), [themeMode, toggleTheme, antdAlgorithm]);

  return (
    <ThemeContext.Provider value={value}>
        {/* 
          The animation overlay is rendered here. 
          Its CSS handles the "paint" effect.
        */}
        <div 
            className={`theme-transition-overlay ${isAnimating ? 'is-animating' : ''} ${themeMode === 'light' ? 'to-dark' : 'to-light'}`}
        />
        {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for convenience
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};