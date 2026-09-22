import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType>({ 
  isDarkMode: true, 
  toggleTheme: () => {},
  setTheme: () => {}
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme: () => setIsDarkMode(!isDarkMode), setTheme: setIsDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
