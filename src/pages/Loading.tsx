import { Brand } from '@/components/_layout/brand'
import { useEffect, useState } from 'react'

export function Loading() {
  const [slow, setSlow] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSlow(true)
    }, 1000)

    return () => window.clearTimeout(timer)
  }, [])

  if (!slow) {
    return null
  }

  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-6 z-9999'>
      <Brand />

      <div className='w-32 h-0.5 bg-base-content/10 rounded-full overflow-hidden'>
        <div className='h-full bg-primary rounded-full animate-loading-bar' />
      </div>
    </div>
  )
}
