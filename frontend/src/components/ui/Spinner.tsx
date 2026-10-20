import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Spinner({ className, label = 'Loading' }: { className?: string; label?: string }) {
  return (
    <span role="status" className="inline-flex items-center">
      <Loader2 className={cn('size-5 animate-spin text-secondary', className)} aria-hidden="true" />
      <span className="sr-only">{label}</span>
    </span>
  )
}

/** Full-area loading state for routes and data panels. */
export function LoadingState({ label = 'Loading…', className }: { label?: string; className?: string }) {
  return (
    <div className={cn('flex min-h-48 flex-col items-center justify-center gap-3 text-muted', className)}>
      <Spinner className="size-7" label={label} />
      <p className="text-sm" aria-hidden="true">
        {label}
      </p>
    </div>
  )
}
