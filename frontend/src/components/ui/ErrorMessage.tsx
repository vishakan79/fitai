import type { ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/cn'

export interface ErrorMessageProps {
  title?: string
  message: ReactNode
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({ title = 'Something went wrong', message, onRetry, className }: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={cn('flex gap-3 rounded-2xl border border-danger/40 bg-danger/10 p-4 text-sm', className)}
    >
      <AlertTriangle className="mt-0.5 size-5 shrink-0 text-danger" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-ink">{title}</p>
        <div className="mt-0.5 text-muted">{message}</div>
        {onRetry && (
          <Button variant="secondary" size="sm" className="mt-3" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    </div>
  )
}
