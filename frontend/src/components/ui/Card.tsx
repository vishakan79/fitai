import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a hover treatment for cards that are interactive. */
  interactive?: boolean
  padded?: boolean
}

export function Card({ interactive = false, padded = true, className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        'surface',
        padded && 'p-6',
        interactive && 'transition duration-200 hover:border-secondary/40 hover:bg-card-hover',
        className,
      )}
      {...rest}
    />
  )
}

export function CardTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold text-ink', className)} {...rest} />
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-1 text-sm leading-relaxed text-muted', className)} {...rest} />
}
