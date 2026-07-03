import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const SWIPE_THRESHOLD = 70
const SWIPE_MAX_VERTICAL = 60
const HORIZONTAL_LOCK_RATIO = 1.4
const DURATION = 320
const IGNORE_ATTR = 'data-swipe-ignore'

export function useSwipeNavigation(ref: RefObject<HTMLElement | null>, pages: string[]) {
  const navigate = useNavigate()
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const shouldIgnore = useRef(false)

  useEffect(() => {
    const el = ref.current

    if (!el) {
      return
    }

    const pagesItems = [...pages]

    // Ignore swipe when the gesture starts inside an element that opts out
    // (data-swipe-ignore) or inside any horizontally-scrollable ancestor.
    // Deciding at touchstart avoids racing with pointer capture from
    // draggable children (e.g. framer-motion product cards).
    function shouldIgnoreGesture(target: EventTarget | null, root: HTMLElement): boolean {
      let node = target as HTMLElement | null

      while (node && node !== root) {
        if (node.hasAttribute?.(IGNORE_ATTR)) {
          return true
        }

        const style = window.getComputedStyle(node)
        const overflowX = style.overflowX
        const canScrollX = (overflowX === 'auto' || overflowX === 'scroll') && node.scrollWidth > node.clientWidth

        if (canScrollX) {
          return true
        }

        node = node.parentElement
      }

      return false
    }

    const getCurrentIndex = () => {
      const index = pagesItems.indexOf(window.location.pathname)
      return index === -1 ? 0 : index
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        shouldIgnore.current = true
        return
      }

      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
      shouldIgnore.current = shouldIgnoreGesture(e.target, el)
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (shouldIgnore.current) {
        return
      }

      const deltaX = e.changedTouches[0].clientX - touchStartX.current
      const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current)

      if (deltaY > SWIPE_MAX_VERTICAL) {
        return
      }

      const absX = Math.abs(deltaX)

      if (absX < SWIPE_THRESHOLD || absX < deltaY * HORIZONTAL_LOCK_RATIO) {
        return
      }

      const currentIndex = getCurrentIndex()

      if (deltaX < 0) {
        const nextIndex = currentIndex + 1

        if (nextIndex < pagesItems.length) {
          navigateWithAnimation(pagesItems[nextIndex], 'left')
        }
      } else {
        const prevIndex = currentIndex - 1

        if (prevIndex >= 0) {
          navigateWithAnimation(pagesItems[prevIndex], 'right')
        }
      }
    }

    const navigateWithAnimation = (path: string, direction: 'left' | 'right') => {
      const main = ref.current

      if (!main) {
        navigate(path)
        return
      }

      // eslint-disable-next-line react-compiler/react-compiler
      main.dataset.swipeExit = direction

      window.setTimeout(() => {
        navigate(path)

        delete main.dataset.swipeExit
        main.dataset.swipeEnter = direction

        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            main.dataset.swipeEntering = 'true'

            window.setTimeout(() => {
              delete main.dataset.swipeEnter
              delete main.dataset.swipeEntering
            }, DURATION + 50)
          })
        })
      }, DURATION / 2)
    }

    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [navigate, pages, ref])
}
