import type { ReactNode } from 'react'
import { Logo } from '@/components/layout/Logo'
import { Card } from '@/components/ui'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { cn } from '@/lib/cn'

const PHOTOS = {
  woman: { src: '/images/athlete-woman.webp', alt: 'Woman squatting with a pose-tracking overlay' },
  man: { src: '/images/athlete-man.webp', alt: 'Man squatting with a pose-tracking overlay' },
}

/**
 * Full-screen auth layout: brand + photo on the left (large screens), form card on the right.
 * `photo` omitted gives a simple centred card (forgot/reset password).
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  photo,
  side,
  photoSide = 'left',
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  photo?: keyof typeof PHOTOS
  /** Content shown beside/above the photo (welcome copy). */
  side?: ReactNode
  photoSide?: 'left' | 'right'
}) {
  useDocumentTitle(`${title} – FitAI`)
  const img = photo ? PHOTOS[photo] : null
  return (
    <div className="min-h-screen bg-hero-glow">
      <header className="mx-auto flex max-w-7xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <Logo />
      </header>
      <div
        className={cn(
          'mx-auto grid max-w-7xl items-center gap-8 px-4 pb-12 sm:px-6 lg:px-8',
          img ? 'lg:grid-cols-2' : 'max-w-md',
        )}
      >
        {img && (
          <div className={cn('relative hidden lg:block', photoSide === 'right' && 'order-2')}>
            <div className="relative z-10 max-w-md">{side}</div>
            <div className="relative mt-6 h-[28rem]">
              <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgb(124_58_237/0.4),transparent)]" aria-hidden="true" />
              <img
                src={img.src}
                alt={img.alt}
                className="relative mx-auto h-full w-auto max-w-full rounded-[2rem] border border-line-strong object-cover [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
              />
            </div>
          </div>
        )}
        <div className={cn('w-full', img && 'mx-auto max-w-md')}>
          <Card className="p-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
            <div className="mt-6">{children}</div>
          </Card>
          {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
        </div>
      </div>
    </div>
  )
}
