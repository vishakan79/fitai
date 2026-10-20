import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Logo } from './Logo'
import { LinkButton } from '@/components/ui'
import { cn } from '@/lib/cn'

export const publicNav = [
  { to: '/', label: 'Home', end: true },
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/faq', label: 'FAQ' },
] as const

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'relative py-2 text-sm font-medium transition-colors',
    isActive ? 'text-secondary' : 'text-muted hover:text-ink',
    isActive && 'after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-primary',
  )

export function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname])

  // Allow Escape to close the mobile menu.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-navy-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
          {publicNav.map((item) => (
            <NavLink key={item.to} to={item.to} end={'end' in item ? item.end : false} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LinkButton to="/login" variant="secondary" size="sm">
            Sign In
          </LinkButton>
          <LinkButton to="/register" size="sm">
            Get Started Free <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        </div>

        <button
          type="button"
          className="rounded-xl p-2 text-ink hover:bg-white/10 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" aria-hidden="true" /> : <Menu className="size-6" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div id="mobile-menu" className="border-t border-line/60 bg-navy-900 lg:hidden">
          <nav aria-label="Mobile" className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
            {publicNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={'end' in item ? item.end : false}
                className={({ isActive }) =>
                  cn(
                    'rounded-xl px-4 py-3 text-base font-medium',
                    isActive ? 'bg-primary/15 text-secondary' : 'text-muted hover:bg-white/5 hover:text-ink',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <LinkButton to="/login" variant="secondary">
                Sign In
              </LinkButton>
              <LinkButton to="/register">Get Started</LinkButton>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
