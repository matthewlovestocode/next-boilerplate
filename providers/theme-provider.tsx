'use client'

import { ReactNode, createContext, useContext, useEffect, useState, useMemo } from 'react'
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { useTheme as useNextTheme } from 'next-themes'
import { lightTheme, darkTheme } from '@/app/theme'

type ThemeContextType = {
  toggleTheme: () => void
  mode: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme, setTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const mode = resolvedTheme === 'dark' ? 'dark' : 'light'

  const muiTheme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode])

  if (!mounted) return <></>

  const toggleTheme = () => {
    setTheme(mode === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ toggleTheme, mode }}>
      <MUIThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  )
}
