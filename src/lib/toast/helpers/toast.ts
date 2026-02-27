import type { ReactNode } from 'react'
import { isValidElement } from 'react'
import type { IToast, IToastWithoutType } from '../@types'
import EventManager from '../services/eventManager'

export const toastEventManager = new EventManager<{ 'add-toast': IToast }>()

/**
 * @param {object} { duration, content, type }
 */
function toast({ duration, content, type }: IToast) {
  content = toastContentSanitize(content)
  toastEventManager.emit('add-toast', { content, duration, type })
}
/**
 * @param {object} { duration, content }
 * @param {ReactNode} ReactNode ReactElement | string | number | Iterable<ReactNode> | ReactPortal | boolean | null | undefined
 */
toast.error = toastType('error')
/**
 * @param {object} { duration, content }
 * @param {ReactNode} ReactNode ReactElement | string | number | Iterable<ReactNode> | ReactPortal | boolean | null | undefined
 */
toast.success = toastType('success')
/**
 * @param {object} { duration, content }
 * @param {ReactNode} ReactNode ReactElement | string | number | Iterable<ReactNode> | ReactPortal | boolean | null | undefined
 */
toast.warn = toastType('warn')
/**
 * @param {object} { duration, content }
 * @param {ReactNode} ReactNode ReactElement | string | number | Iterable<ReactNode> | ReactPortal | boolean | null | undefined
 */
toast.info = toastType('info')
/**
 * @param {object} { duration, content }
 * @param {ReactNode} ReactNode ReactElement | string | number | Iterable<ReactNode> | ReactPortal | boolean | null | undefined
 */
toast.ghost = toastType('ghost')

function toastContentSanitize(content?: ReactNode): ReactNode {
  if (!content) {
    return
  }

  if (isValidElement(content)) {
    return content
  }

  return !(typeof content === 'object') || Array.isArray(content) ? content : JSON.stringify(content)
}

function toastType(type: IToast['type']) {
  return function (data: IToastWithoutType | ReactNode) {
    if (isValidElement(data)) {
      return toast({ content: data, type: type })
    }

    if (typeof data === 'object') {
      const { content, duration } = data as IToastWithoutType
      return toast({ content, duration, type })
    }

    return toast({ content: String(data), type })
  }
}

export { toast }
