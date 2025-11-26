'use client'

import { Moon, Sun } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="p-2 rounded-lg w-9 h-9" />
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-300 rotate-0 hover:rotate-12" />
      ) : (
        <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400 transition-transform duration-300 rotate-0 hover:-rotate-12" />
      )}
    </button>
  )
}
