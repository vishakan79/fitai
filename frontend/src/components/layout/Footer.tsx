import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { Logo } from './Logo'

const columns = [
  {
    title: 'Product',
    links: [
      { to: '/features', label: 'Features' },
      { to: '/how-it-works', label: 'How It Works' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/contact', label: 'Contact' },
      { to: '/privacy', label: 'Privacy Policy' },
      { to: '/terms', label: 'Terms of Service' },
    ],
  },
  {
    title: 'Account',
    links: [
      { to: '/login', label: 'Sign In' },
      { to: '/register', label: 'Create Account' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-line bg-navy-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Your Personal Fitness Coach, Powered by AI. Practise at home with real-time rep counting and general
              posture guidance.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-semibold text-ink">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-muted transition hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex gap-3 rounded-2xl border border-line bg-card/60 p-4 text-sm text-muted">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
          <p>
            <strong className="font-semibold text-ink">Safety & privacy.</strong> FitAI provides general exercise
            guidance only and is not medical advice. Stop if you feel pain or dizziness and consult a qualified
            professional if you have a health condition. Camera video is processed on your device and is not uploaded
            or stored.
          </p>
        </div>

        <p className="mt-8 text-xs text-faint">© {new Date().getFullYear()} FitAI. All rights reserved.</p>
      </div>
    </footer>
  )
}
