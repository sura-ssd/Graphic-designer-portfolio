import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'hermela-theme'

function getInitialTheme() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light'
  } catch (error) {
    console.warn('Unable to read the saved theme preference:', error)
    return 'light'
  }
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#171a18' : '#f8f6f1')
    try {
      window.localStorage.setItem(STORAGE_KEY, theme)
    } catch (error) {
      console.warn('Unable to save the theme preference:', error)
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((current) => current === 'light' ? 'dark' : 'light')
  }, [])

  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
