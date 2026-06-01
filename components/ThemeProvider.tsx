'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextValue {
  theme:     Theme
  resolved:  'light' | 'dark'
  setTheme:  (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  theme:    'system',
  resolved: 'light',
  setTheme: () => {},
})

export function useTheme() { return useContext(ThemeContext) }

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme,    setThemeState] = useState<Theme>('system')
  const [resolved, setResolved]   = useState<'light' | 'dark'>('light')
  const [mounted,  setMounted]    = useState(false)

  useEffect(() => {
    // Read persisted preference
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      setThemeState(stored)
    }
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const root   = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark   = theme === 'dark' || (theme === 'system' && prefersDark)

    // Suppress the CSS transition on programmatic toggle to keep it snappy
    document.body.classList.add('no-transition')
    root.classList.toggle('dark', dark)
    setResolved(dark ? 'dark' : 'light')
    // Re-enable transitions on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => document.body.classList.remove('no-transition'))
    })
  }, [theme, mounted])

  const setTheme = (t: Theme) => {
    localStorage.setItem('theme', t)
    setThemeState(t)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolved, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
