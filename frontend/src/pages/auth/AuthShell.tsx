import type { ReactNode } from 'react'
import { Card } from '@/components/ui'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
}) {
  useDocumentTitle(`${title} – FitAI`)
  return (
    <section className="bg-hero-glow">
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-14 sm:px-6">
        <Card className="p-8">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </Card>
        {footer && <p className="mt-6 text-center text-sm text-muted">{footer}</p>}
      </div>
    </section>
  )
}
