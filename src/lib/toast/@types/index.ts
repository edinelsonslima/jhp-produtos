import type { ComponentProps, ReactNode } from 'react'

export interface IToastWithoutType {
  content: ReactNode
  duration?: number
}

export interface IToast extends IToastWithoutType {
  type: 'success' | 'info' | 'warn' | 'error' | 'ghost'
}

export interface IToastData extends IToast {
  id: string
}

export interface IToastContainerProps extends Omit<ComponentProps<'div'>, 'children'> {
  defaultDuration?: number
  children: (props: IToastData & { remove: (id: string) => void }) => ReactNode
}

export interface IToastMessageProps extends ComponentProps<'span'> {
  id: string
  duration?: IToastData['duration']
  animationUnmount?: string
  onRemoveMessage(id: string): void
}
