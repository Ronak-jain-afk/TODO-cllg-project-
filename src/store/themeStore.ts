import { create } from 'zustand'

type Theme = 'light' | 'dark'

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem('flowforge-theme')
  if (stored === 'dark' || stored === 'light') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () => set(state => {
    const next = state.theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('flowforge-theme', next)
    return { theme: next }
  }),
}))
