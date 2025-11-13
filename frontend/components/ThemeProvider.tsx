'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'cyber'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'cyber',
  toggleTheme: () => {},
  setTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('cyber')

  const setTheme = (newTheme: Theme) => {
    // Remove all theme classes
    document.documentElement.classList.remove('dark', 'light', 'cyber')
    // Add the new theme class
    document.documentElement.classList.add(newTheme)
    // Save to localStorage
    localStorage.setItem('theme', newTheme)
    // Update state
    setThemeState(newTheme)
  }

  const toggleTheme = () => {
    setTheme(theme === 'cyber' ? 'dark' : 'cyber')
  }

  useEffect(() => {
    // Set initial theme
    const savedTheme = localStorage.getItem('theme') as Theme | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme(systemPrefersDark ? 'cyber' : 'light')
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'cyber' 
          ? 'bg-cyber-darker text-cyber-blue' 
          : theme === 'dark' 
            ? 'bg-gray-900 text-gray-100' 
            : 'bg-gray-50 text-gray-900'
      }`}>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
