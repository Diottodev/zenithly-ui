'use client'

import { useMounted } from '$/hooks/use-mounted'
import { RiMoonFill, RiSunFill } from '@remixicon/react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'

/**
 * ThemeToggle is a switch component for toggling between light and dark themes.
 * It uses the `next-themes` package to manage theme state and supports system preference.
 * The toggle is animated using Framer Motion.
 */
export default function ThemeToggle() {
  // Get theme state and setter from next-themes
  const { theme, setTheme, systemTheme } = useTheme()
  // Ensure component is mounted before rendering (avoids hydration mismatch)
  const mounted = useMounted()
  if (!mounted) {
    return null
  }
  // Determine the current theme, resolving "system" to the actual system theme
  const currentTheme = theme === 'system' ? (systemTheme ?? 'light') : theme
  const isLight = currentTheme === 'light'
  /**
   * Toggles the theme between light and dark.
   * If the theme is set to "system", it toggles based on the current system theme.
   */
  const toggleTheme = () => {
    if (theme === 'system') {
      const prefersDark = systemTheme === 'dark'
      setTheme(prefersDark ? 'light' : 'dark')
    } else {
      setTheme(theme === 'light' ? 'dark' : 'light')
    }
  }
  return (
    <label className="relative inline-block">
      <input
        aria-checked={isLight}
        aria-label="Toggle theme"
        checked={isLight}
        className="peer sr-only"
        onChange={toggleTheme}
        role="switch"
        type="checkbox"
      />
      <motion.div
        className="relative flex h-9 w-16 cursor-pointer items-center rounded-3xl border border-input bg-secondary/32 p-2 shadow-xs transition-colors duration-500 hover:bg-secondary/64 hover:text-accent-foreground"
        whileTap={{ scale: 1 }}
      >
        {/* Animated knob that slides left/right depending on theme */}
        <motion.div
          animate={{ x: isLight ? 0 : 23 }}
          className={`z-10 flex h-7 w-7 items-center justify-center rounded-full p-1 ${
            isLight
              ? 'bg-foreground text-background'
              : 'bg-foreground text-background'
          } shadow-xs`}
          transition={{
            type: 'spring',
            stiffness: 600,
            damping: 80,
          }}
        >
          {/* Icon changes based on theme */}
          {isLight ? (
            <RiSunFill className="h-4 w-4" />
          ) : (
            <RiMoonFill className="h-4 w-4" />
          )}
        </motion.div>
      </motion.div>
    </label>
  )
}
