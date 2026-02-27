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

  const handleAnimationEnd = (event: never) => {
    props.onAnimationEnd?.(event)

    if (show) {
      return
    }

    window.setTimeout(() => setShouldRender(false), 100)
  }

  useEffect(() => {
    if (!show) {
      return
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShouldRender(true)
  }, [show])

  useEffect(() => {
    onShouldRender?.(shouldRender)
  }, [shouldRender, onShouldRender])

  if (!shouldRender) {
    return null
  }

  return createElement(as ?? 'div', {
    ...props,
    onAnimationEnd: handleAnimationEnd,
    className: cn('transition-all', show ? animationIn : animationOut, className),
  })
}
