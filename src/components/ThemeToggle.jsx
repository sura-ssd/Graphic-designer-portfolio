import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const nextTheme = theme === 'light' ? 'dark' : 'light'

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      title={`Switch to ${nextTheme} theme`}
    >
      <span className="theme-toggle-icon" aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
      <span className="theme-toggle-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
    </button>
  )
}
