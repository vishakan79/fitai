import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Bot,
  ClipboardList,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  X,
  BarChart3,
  Receipt,
  type LucideIcon,
} from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { useToast } from '@/components/ui'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

const userNav: NavItem[] = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/workouts', label: 'Workouts', icon: Dumbbell, end: true },
  { to: '/app/plans', label: 'Plans', icon: ClipboardList },
  { to: '/app/exercises', label: 'Exercises', icon: BookOpen },
  { to: '/app/progress', label: 'Progress', icon: TrendingUp },
  { to: '/app/assistant', label: 'AI Assistant', icon: Bot },
  { to: '/app/subscription', label: 'Subscription', icon: CreditCard },
  { to: '/app/settings', label: 'Settings', icon: Settings },
]

const adminNav: NavItem[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/exercises', label: 'Exercises', icon: BookOpen },
  { to: '/admin/subscriptions', label: 'Plans', icon: CreditCard },
  { to: '/admin/payments', label: 'Payments', icon: Receipt },
  { to: '/admin/usage', label: 'AI Usage', icon: BarChart3 },
]

function NavList({ items, onNavigate }: { items: NavItem[]; onNavigate?: () => void }) {
  return (
    <nav aria-label="App" className="space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition',
              isActive
                ? 'bg-primary/25 text-ink shadow-[inset_0_0_0_1px_rgb(167_139_250/0.35)]'
                : 'text-muted hover:bg-white/5 hover:text-ink',
            )
          }
        >
          <item.icon className="size-[18px] shrink-0" aria-hidden="true" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

/** Sidebar layout used by the signed-in app and by the admin area. */
export function AppShell({ variant = 'user' }: { variant?: 'user' | 'admin' }) {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const items = variant === 'admin' ? adminNav : userNav

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => window.scrollTo(0, 0), [pathname])

  async function logOut() {
    try {
      await api.post('/auth/logout')
    } catch {
      // The server session may already be gone (or the API unreachable); leave the app regardless.
      toast.info('Signed out on this device.')
    }
    navigate('/login')
  }

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-5">
      <div className="flex items-center justify-between">
        <Logo to={variant === 'admin' ? '/admin' : '/app/dashboard'} className="[&_span]:text-xl" />
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="rounded-lg p-1.5 text-muted hover:bg-white/10 lg:hidden"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      {variant === 'admin' && (
        <p className="flex items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-xs font-semibold text-warning">
          <ShieldCheck className="size-4" aria-hidden="true" /> Admin area
        </p>
      )}
      <div className="flex-1 overflow-y-auto">
        <NavList items={items} onNavigate={() => setOpen(false)} />
      </div>
      <button
        type="button"
        onClick={logOut}
        className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted transition hover:bg-white/5 hover:text-ink"
      >
        <LogOut className="size-[18px]" aria-hidden="true" /> Log Out
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-hero-glow lg:grid lg:grid-cols-[15.5rem_1fr]">
      <a
        href="#app-main"
        className="sr-only z-[200] rounded-full bg-primary px-4 py-2 text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-navy-950/70 backdrop-blur lg:block">{sidebar}</aside>

      <div className="flex items-center justify-between border-b border-line bg-navy-950/80 px-4 py-3 backdrop-blur lg:hidden">
        <Logo to={variant === 'admin' ? '/admin' : '/app/dashboard'} className="[&_span]:text-xl" />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="rounded-xl p-2 hover:bg-white/10"
        >
          <Menu className="size-6" aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-[90] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-navy-950/80" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-line bg-navy-900">{sidebar}</aside>
        </div>
      )}

      <main id="app-main" className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">
        <Outlet />
      </main>
    </div>
  )
}
