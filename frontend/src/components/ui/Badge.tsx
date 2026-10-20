import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

const tones: Record<BadgeTone, string> = {
  neutral: 'border-line-strong bg-white/5 text-muted',
  primary: 'border-secondary/40 bg-primary/15 text-secondary',
  success: 'border-success/40 bg-success/15 text-success-glow',
  warning: 'border-warning/40 bg-warning/15 text-warning',
  danger: 'border-danger/40 bg-danger/15 text-danger',
}

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
}

export function Badge({ tone = 'neutral', className, ...rest }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
        tones[tone],
        className,
      )}
      {...rest}
    />
  )
}
