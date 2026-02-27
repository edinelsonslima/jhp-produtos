import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'
import { createElement, useEffect, useState } from 'react'

type Props<TElement extends keyof React.JSX.IntrinsicElements> = {
  as?: TElement
  show?: boolean
  animationIn?: string
  animationOut?: string
  className?: string
  onShouldRender?: (show: boolean) => void
}

export function Animate<TElement extends keyof React.JSX.IntrinsicElements>({
  as,
  className,
  show = true,
  animationIn = 'animate-fade-in-up',
  animationOut = 'animate-fade-out-down',
  onShouldRender,
  ...props
}: ComponentProps<TElement> & Props<TElement>) {
  const [shouldRender, setShouldRender] = useState(show)

  useEffect(() => {
    onShouldRender?.(show)
  }, [show, onShouldRender])

  const handleAnimationEnd = (event: never) => {
    props.onAnimationEnd?.(event)

    if (show) {
      return
    }

    setShouldRender(false)
  }

  useEffect(() => {
    if (show) {
      setShouldRender(true)
    }
  }, [show])

  if (!shouldRender) {
    return null
  }

  return createElement(as ?? 'div', {
    ...props,
    onAnimationEnd: handleAnimationEnd,
    className: cn('transition-all', show ? animationIn : animationOut, className),
  })
}
