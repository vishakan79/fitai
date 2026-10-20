import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 32" className={cn('h-8 w-12', className)} aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="logo-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#A78BFA" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect x="1" y="9" width="5" height="14" rx="2.5" fill="url(#logo-g)" />
      <rect x="42" y="9" width="5" height="14" rx="2.5" fill="url(#logo-g)" />
      <path
        d="M7 16h6l3-8 5 16 5-12 3 4h8"
        stroke="url(#logo-g)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Logo({ to = '/', className }: { to?: string; className?: string }) {
  return (
    <Link to={to} aria-label="FitAI home" className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark />
      <span className="text-2xl font-bold tracking-tight text-ink">FitAI</span>
    </Link>
  )
}
