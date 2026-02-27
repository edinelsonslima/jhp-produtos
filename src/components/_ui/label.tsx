import { cn } from '@/lib/utils'

function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn('daisy-label text-sm font-medium', className)} {...props} />
}

export { Label }
