'use client'

import { usePathname } from 'next/navigation'

/**
 * Applies "dark" class to <html> only on /admin routes.
 * Public pages are forced to light mode.
 */
export default function ThemeController() {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  // Inject class onto <html> via useEffect-free trick: just render a script-like inline style
  // that manipulates document.documentElement immediately (no flash)
  if (typeof document !== 'undefined') {
    if (isAdmin) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return null
}
