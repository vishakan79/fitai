import type { ReactNode } from 'react'
import { Info } from 'lucide-react'
import { Card } from '@/components/ui'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { cn } from '@/lib/cn'

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  useDocumentTitle(`${title} – FitAI`)
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/** Shown on every page that renders sample data so it is never mistaken for real user metrics. */
export function SampleBanner({ what = 'figures' }: { what?: string }) {
  return (
    <div
      role="note"
      className="mb-6 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning"
    >
      <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        <strong className="font-semibold">Preview with sample data.</strong> These {what} are examples. Your real
        numbers appear here once the backend is connected and you have saved workouts.
      </p>
    </div>
  )
}

export function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card className="p-5">
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className={cn('mt-2 text-3xl font-bold tabular-nums tracking-tight', accent && 'text-secondary')}>{value}</p>
    </Card>
  )
}

export const chartTooltip = {
  cursor: { fill: 'rgb(124 58 237 / 0.12)' },
  contentStyle: { background: '#10182b', border: '1px solid #2b3a5f', borderRadius: 12, color: '#f8fafc' },
}
