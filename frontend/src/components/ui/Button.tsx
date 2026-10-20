import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap transition ' +
  'duration-200 disabled:cursor-not-allowed disabled:opacity-50 select-none'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-primary to-[#8b5cf6] text-white shadow-glow hover:brightness-110 active:brightness-95',
  secondary:
    'border border-line-strong bg-card/60 text-ink hover:border-secondary/60 hover:bg-card-hover',
  ghost: 'text-muted hover:text-ink hover:bg-white/5',
  danger: 'bg-danger/90 text-white hover:bg-danger',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm',
  lg: 'h-14 px-8 text-base',
}

/** Class string for anything that should look like a button (links, etc.). */
export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) {
  return cn(base, variants[variant], sizes[size], className)
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading = false, disabled, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonStyles(variant, size, className)}
      {...rest}
    >
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
})

export interface LinkButtonProps extends LinkProps {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function LinkButton({ variant = 'primary', size = 'md', className, ...rest }: LinkButtonProps) {
  return <Link className={buttonStyles(variant, size, className)} {...rest} />
}
