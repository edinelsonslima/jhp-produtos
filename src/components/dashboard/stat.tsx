import { cn, formatCurrency } from '@/lib/utils'
import type { LucideProps } from 'lucide-react'
import type { ComponentProps, ForwardRefExoticComponent, RefAttributes } from 'react'
import { Card } from '../_ui/card'

interface StatProps {
  title: string
  subtitle?: string
  value: number
  variant?: ComponentProps<typeof Card>['variant']
  icon: Parameters<typeof Card.getStyle>[1] & {
    element: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  }
  classNames?: {
    title?: string
    subtitle?: string
    value?: string
    icon?: string
  }
}

export function Stat({ title, subtitle, value, variant, icon, classNames }: StatProps) {
  return (
    <Card variant={variant} className='[&>div]:flex-row [&>div]:items-center [&>div]:justify-between'>
      <div className='space-y-1'>
        <Card.Title className={cn('text-xs uppercase', classNames?.title)}>{title}</Card.Title>

        <p className={cn('text-xl sm:text-2xl font-extrabold font-mono truncate', classNames?.value)}>
          {formatCurrency(value)}
        </p>

        <small className={cn('text-xs text-base-content/60 mt-1', classNames?.subtitle)}>{subtitle}</small>
      </div>

      <icon.element
        className={Card.getStyle(cn(`text-${icon.variant} w-full size-7 p-1`, classNames?.icon), {
          variant: icon.variant,
          modifier: icon.modifier ?? 'square',
          size: icon.size ?? 'lg',
          appearance: icon.appearance,
        })}
      />
    </Card>
  )
}
