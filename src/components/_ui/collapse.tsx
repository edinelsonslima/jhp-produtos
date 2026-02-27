import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

interface Props extends ComponentProps<'details'> {
  icon?: 'arrow' | 'plus'
}

export function Collapse({ children, className, icon, ...props }: Props) {
  return (
    <details
      className={cn(
        'daisy-collapse bg-base-100 border border-base-300',
        icon === 'arrow' && 'daisy-collapse-arrow',
        icon === 'plus' && 'daisy-collapse-plus',
        className,
      )}
      {...props}
    >
      {children}
    </details>
  )
}

Collapse.Summary = function Summary({ children, className, ...props }: ComponentProps<'summary'>) {
  return (
    <summary {...props} className={cn('daisy-collapse-title font-semibold', className)}>
      {children}
    </summary>
  )
}

Collapse.Content = function Content({ children, className, ...props }: ComponentProps<'div'>) {
  return (
    <div {...props} className={cn('daisy-collapse-content text-sm', className)}>
      {children}
    </div>
  )
}
