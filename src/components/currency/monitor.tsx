import { cn, formatCurrency } from '@/lib/utils'
import { animate, motion, useMotionValue } from 'framer-motion'
import type { ComponentProps } from 'react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type Status = 'up' | 'down' | 'idle'

interface Props extends ComponentProps<typeof motion.div> {
  children: number
  duration?: number
}

export function CurrencyMonitor({ children, className, duration = 0.6, ...props }: Props) {
  const prevValue = useRef<number | null>(null)
  const motionValue = useMotionValue(children)

  const [display, setDisplay] = useState(children)
  const [color, setColor] = useState<Status>('idle')

  useEffect(() => {
    if (prevValue.current === null) {
      prevValue.current = children
      motionValue.set(children)
      return
    }

    const from = prevValue.current
    const to = children

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setColor(to > from ? 'up' : to < from ? 'down' : 'idle')

    const controls = animate(motionValue, to, {
      duration,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplay(latest),
      onComplete: () => setColor('idle'),
    })

    prevValue.current = to

    return () => {
      controls.stop()
    }
  }, [children, duration, motionValue])

  const content = (
    <motion.div
      className={cn(
        'inline-block transition-colors',
        color === 'up' && 'text-success',
        color === 'down' && 'text-error',
        color === 'idle' && 'text-base-content/75',
        display === 0 && 'text-base-content/20',
        className,
      )}
      transition={{ duration: 0.4 }}
      animate={{ scale: color === 'idle' ? 1 : [1.05, 1] }}
      {...props}
    >
      {formatCurrency(display)}
    </motion.div>
  )

  return className?.includes('fixed') ? createPortal(content, document.body) : content
}
