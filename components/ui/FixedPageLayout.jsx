'use client'

import { useEffect } from 'react'

/**
 * FixedPageLayout
 * 
 * Locks the parent #main-scroll-container's scroll while this component is mounted.
 * Used by tutorial detail pages to enable the two-panel fixed layout pattern.
 * 
 * Without this, `position: fixed` children don't work correctly because
 * `overflow-y-auto` on a parent creates a new containing block for fixed elements.
 */
export default function FixedPageLayout({ children }) {
  useEffect(() => {
    const scrollContainer = document.getElementById('main-scroll-container')
    if (!scrollContainer) return

    // Lock the parent scroll container
    const prevOverflow = scrollContainer.style.overflow
    scrollContainer.style.overflow = 'hidden'

    // Restore on unmount (when navigating away)
    return () => {
      scrollContainer.style.overflow = prevOverflow
    }
  }, [])

  return <>{children}</>
}
