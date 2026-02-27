import type { GetStyleConfig } from '@/lib/utils'
import { cn, createStyle } from '@/lib/utils'
import type { ComponentProps } from 'react'

const styled = createStyle({
  variant: {
    neutral: 'daisy-btn-neutral',
    primary: 'daisy-btn-primary',
    secondary: 'daisy-btn-secondary',
    accent: 'daisy-btn-accent',
    info: 'daisy-btn-info',
    success: 'daisy-btn-success',
    warning: 'daisy-btn-warning',
    error: 'daisy-btn-error',
  },
  size: {
    xs: 'daisy-btn-xs',
    sm: 'daisy-btn-sm',
    md: 'daisy-btn-md',
    lg: 'daisy-btn-lg',
    xl: 'daisy-btn-xl',
  },
  appearance: {
    outline: 'daisy-btn-outline',
    dash: 'daisy-btn-dash',
    soft: 'daisy-btn-soft',
    ghost: 'daisy-btn-ghost',
    link: 'daisy-btn-link',
  },
  modifier: {
    wide: 'daisy-btn-wide',
    block: 'daisy-btn-block',
    square: 'daisy-btn-square',
    circle: 'daisy-btn-circle',
  },
})

interface StylesExtra {
  active?: boolean
  disabled?: boolean
}

interface ButtonProps extends ComponentProps<'button'>, StylesExtra {
  variant?: GetStyleConfig<typeof styled, 'variant'>
  size?: GetStyleConfig<typeof styled, 'size'>
  appearance?: GetStyleConfig<typeof styled, 'appearance'>
  modifier?: GetStyleConfig<typeof styled, 'modifier'>
}

export function Button({ variant, size, appearance, modifier, className, active = false, ...props }: ButtonProps) {
  return (
    <button
      className={Button.getStyle(
        className,
        { variant, size, appearance, modifier },
        { active, disabled: props.disabled },
      )}
      {...props}
    />
  )
}

Button.getStyle = styled<StylesExtra>((className, props, styles, extra) => {
  const { active, disabled } = extra || {}
  const { appearance, modifier, size, variant } = props || {}

  return cn(
    'daisy-btn',
    size && styles.size[size],
    variant && styles.variant[variant],
    appearance && styles.appearance[appearance],
    modifier && styles.modifier[modifier],
    disabled && 'daisy-btn-disabled',
    active && 'daisy-btn-active',
    className,
  )
})
