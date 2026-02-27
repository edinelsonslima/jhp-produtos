import { cn } from '@/lib/utils'
import type { ComponentProps, PropsWithChildren, ReactNode, RefObject, TouchEvent } from 'react'
import { Children, createContext, createElement, isValidElement, useContext, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Animate } from './animate'

interface ModalContextValue {
  ref: RefObject<HTMLDialogElement | null>
}

const ModalContext = createContext<ModalContextValue>({
  ref: { current: null },
})

export function Modal({ children, className, ...props }: ComponentProps<'div'>) {
  const ref = useRef<HTMLDialogElement>(null)
  const startY = useRef(0)
  const currentY = useRef(0)

  const [dragY, setDragY] = useState(0)
  const [open, setOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = (e: TouchEvent) => {
    const current = e.currentTarget
    const { overflowY } = window.getComputedStyle(current)

    if (['auto', 'scroll'].includes(overflowY) && current.scrollTop > 0) {
      return
    }

    startY.current = e.touches[0].clientY
    currentY.current = 0
    setIsDragging(true)
  }

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) {
      return
    }

    const delta = e.touches[0].clientY - startY.current

    if (delta > 0) {
      currentY.current = delta
      setDragY(delta)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) {
      return
    }

    setIsDragging(false)

    if (currentY.current > 100) {
      ref.current?.close()
    }

    setDragY(0)
    currentY.current = 0
  }

  const handleSetRef = (dialogRef: HTMLDialogElement | null) => {
    if (!dialogRef) {
      return
    }

    const handleClose = () => setOpen(false)
    dialogRef.addEventListener('close', handleClose)

    const originalShowModal = dialogRef.showModal
    dialogRef.showModal = function () {
      originalShowModal?.call(this)
      setOpen(true)
    }

    ref.current = dialogRef

    return () => {
      dialogRef.removeEventListener('close', handleClose)
    }
  }

  const equalsElements = (child: ReactNode, Component: unknown) => isValidElement(child) && child.type === Component

  const childrenArray = Children.toArray(children)

  const trigger = childrenArray.find((child) => equalsElements(child, Modal.Trigger))

  const childrenWithoutTrigger = childrenArray.filter((child) => !equalsElements(child, Modal.Trigger))

  return (
    <ModalContext value={{ ref }}>
      {trigger}
      {createPortal(
        <dialog ref={handleSetRef} className='daisy-modal daisy-modal-bottom sm:daisy-modal-middle'>
          <Animate
            as='div'
            show={open}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={cn('daisy-modal-box max-h-[80vh]', className)}
            style={
              !isDragging
                ? undefined
                : {
                    transform: `translateY(${dragY}px)`,
                    transition: 'transform 0.2s ease-out',
                    opacity: Math.max(0.5, 1 - dragY / 300),
                  }
            }
            {...props}
          >
            <div className='w-10 h-1 rounded-full bg-base-content/20 mx-auto -mt-2 mb-3 sm:hidden' />
            {childrenWithoutTrigger}
          </Animate>

          <div
            role='button'
            tabIndex={-1}
            aria-label='Fechar'
            className='daisy-modal-backdrop'
            onClick={() => ref?.current?.close()}
          />
        </dialog>,
        document.body,
      )}
    </ModalContext>
  )
}

Modal.Content = function Content<TElement extends keyof React.JSX.IntrinsicElements>({
  as,
  children,
  ...props
}: ComponentProps<TElement> & { as?: TElement }) {
  return as ? createElement(as, props, children) : children
}

Modal.Title = function Title({ children, className, ...props }: PropsWithChildren<ComponentProps<'div'>>) {
  return (
    <div className={cn('flex items-center gap-3 mb-6', className)} {...props}>
      {children}
    </div>
  )
}

Modal.Actions = function Actions({
  className,
  children,
  ...props
}: Omit<ComponentProps<'div'>, 'children'> & {
  children: ({ close }: { close: () => void }) => ReactNode
}) {
  const { ref } = useContext(ModalContext)

  return (
    <div className={cn('daisy-modal-action', className)} {...props}>
      {children({ close: () => ref.current?.close() })}
    </div>
  )
}

Modal.Trigger = function Trigger<TElement extends keyof React.JSX.IntrinsicElements>({
  children,
  as,
  onClick,
  ...props
}: ComponentProps<TElement> & { as: TElement }) {
  const { ref } = useContext(ModalContext)

  const handleClick = (e: never) => (ref.current?.showModal(), onClick?.(e))
  return createElement(as, { ...props, onClick: handleClick }, children)
}
