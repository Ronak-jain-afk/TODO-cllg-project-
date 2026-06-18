import { useThemeStore } from '../../store/themeStore'

export function ThemeToggle() {
  const theme = useThemeStore(s => s.theme)
  const toggleTheme = useThemeStore(s => s.toggleTheme)

  return (
    <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
