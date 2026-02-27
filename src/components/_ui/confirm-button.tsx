import { vibrate } from '@/lib/utils'
import { Check } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useEffect, useRef, useState } from 'react'
import { Button } from './button'

interface Props extends ComponentProps<typeof Button> {
  onConfirm: () => void
}

export function ConfirmButton({ onConfirm, children, className, ...props }: Props) {
  const [confirming, setConfirming] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!confirming) {
      return
    }

    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setConfirming(false)
      }
    }

    document.addEventListener('pointerdown', handler, true)
    return () => document.removeEventListener('pointerdown', handler, true)
  }, [confirming])

  return (
    <div ref={ref} className='inline-flex'>
      <Button
        {...props}
        variant={confirming ? 'error' : props.variant}
        className={className}
        onClick={(e) => {
          e.stopPropagation()
          if (confirming) {
            onConfirm()
            setConfirming(false)
          } else {
            vibrate(10)
            setConfirming(true)
          }
        }}
      >
        {confirming ? <Check size={14} /> : children}
      </Button>
    </div>
  )
}
