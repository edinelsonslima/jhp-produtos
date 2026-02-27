import { cn, formatCurrency, vibrate } from '@/lib/utils'
import type { Product } from '@/types'
import { m } from 'framer-motion'
import { Package, Trash2 } from 'lucide-react'
import type { ComponentProps } from 'react'
import { useRef, useState } from 'react'
import { Button } from '../_ui/button'

interface Props extends Omit<ComponentProps<typeof m.button>, 'onSelect'> {
  product: Product
  quantity?: number
  onSelect: (product: Product, quantity: number) => void
}

export function ProductItem({ product, className, quantity = 0, onSelect, ...props }: Props) {
  const [longPressActive, setLongPressActive] = useState(false)
  const longPressTimer = useRef<number | null>(null)
  const isDragging = useRef(false)
  const selected = quantity > 0

  const updateProductByQuantity = (qty: number = 0) => {
    const newQuantity = Math.max(qty, 0)
    onSelect(product, newQuantity)
    vibrate(10)
  }

  const handlePointerDown = () => {
    if (!selected) {
      return
    }

    longPressTimer.current = window.setTimeout(() => {
      setLongPressActive((prev) => !prev)
      vibrate(10)
    }, 500)
  }

  const handlePointerUp = () => {
    if (!longPressTimer.current) {
      return
    }

    window.clearTimeout(longPressTimer.current)
    longPressTimer.current = null
  }

  const handleDragStart = () => {
    isDragging.current = true
  }

  const handleDragEnd = (_: TouchEvent, info: { offset: { x: number } }) => {
    isDragging.current = false

    if (info.offset.x < -80) {
      updateProductByQuantity(quantity + 1)
    }

    if (info.offset.x > 80) {
      updateProductByQuantity(quantity - 1)
    }
  }

  const handleClick = () => {
    if (isDragging.current) {
      return
    }
    updateProductByQuantity(quantity + 1)
  }

  if (quantity === 0 && longPressActive) {
    setLongPressActive(false)
  }

  return (
    <m.button
      data-swipe-ignore
      drag={!longPressActive ? 'x' : false}
      dragTransition={{ bounceStiffness: 100, bounceDamping: 9999 }}
      dragElastic={1}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onDragStart={handleDragStart}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
      className={Button.getStyle(cn('flex-col items-start px-2 h-18', className), {
        variant: selected ? 'primary' : undefined,
        appearance: selected ? undefined : 'soft',
        size: 'xl',
      })}
      {...props}
    >
      <h3 className='flex items-center justify-between w-full'>
        <span className='mb-2 text-sm truncate'>
          <Package size={16} className='min-w-4 mr-1 inline' />
          {product.name}
        </span>

        {longPressActive && (
          <span
            role='button'
            aria-label='Remover produto'
            className={Button.getStyle('-mr-1 -mt-3', {
              variant: 'error',
              modifier: 'square',
              appearance: 'soft',
              size: 'xs',
            })}
            onClick={(e) => {
              if (longPressTimer.current) {
                return
              }

              e.stopPropagation()
              updateProductByQuantity(0)
              setLongPressActive(false)
            }}
          >
            <Trash2 size={14} />
          </span>
        )}
      </h3>

      <div className='flex items-center justify-between w-full'>
        <span className='font-mono font-bold text-sm truncate'>{formatCurrency(product.price)}</span>

        <span className={cn('text-xs', quantity && 'font-bold')}>
          {!quantity ? (product.unit === 'litro' ? 'litro' : 'uni') : `${quantity}x`}
        </span>
      </div>
    </m.button>
  )
}
