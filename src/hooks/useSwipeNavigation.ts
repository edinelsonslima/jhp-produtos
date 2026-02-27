import type { RefObject } from 'react'
import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const SWIPE_THRESHOLD = 60
const SWIPE_MAX_VERTICAL = 80
const DURATION = 320
const IGNORE_ATTR = 'data-swipe-ignore'

export function useSwipeNavigation(ref: RefObject<HTMLElement | null>, pages: string[]) {
  const navigate = useNavigate()
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)
  const touchTarget = useRef<EventTarget | null>(null)

  useEffect(() => {
    const el = ref.current

    if (!el) {
      return
    }

    const pagesItems = [...pages]

    function shouldIgnoreSwipe(target: EventTarget | null, deltaX: number, root: HTMLElement): boolean {
      let el = target as HTMLElement | null

      while (el && el !== root) {
        if (el.hasAttribute(IGNORE_ATTR)) {
          return true
        }

        const { overflowX } = window.getComputedStyle(el)

        const canScrollX = (overflowX === 'auto' || overflowX === 'scroll') && el.scrollWidth > el.clientWidth

        if (canScrollX) {
          const atLeftEdge = el.scrollLeft <= 0
          const atRightEdge = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1

          if (deltaX > 0 && !atLeftEdge) {
            return true
          }

          if (deltaX < 0 && !atRightEdge) {
            return true
          }
        }

        el = el.parentElement
      }

      return false
    }

    const getCurrentIndex = () => {
      const index = pagesItems.indexOf(window.location.pathname)
      return index === -1 ? 0 : index
    }

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
      touchStartY.current = e.touches[0].clientY
      touchTarget.current = e.target
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX.current
      const deltaY = Math.abs(e.changedTouches[0].clientY - touchStartY.current)

      if (deltaY > SWIPE_MAX_VERTICAL) {
        return
      }

      if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
        return
      }

      if (shouldIgnoreSwipe(touchTarget.current, deltaX, el)) {
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
