import { useEffect, useState } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

/**
 * Returns true only when the primary pointing device supports hover
 * (i.e. mouse). Touch devices report false, so hover/scale effects
 * can be disabled to avoid the "sticky hover" behavior on tap.
 */
export function useHasHover() {
  const [hasHover, setHasHover] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(QUERY)
    const listener = (e: MediaQueryListEvent) => setHasHover(e.matches)
    mql.addEventListener('change', listener)
    return () => mql.removeEventListener('change', listener)
  }, [])

  return hasHover
}
