import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Dumbbell } from 'lucide-react'
import { Card, EmptyState, LinkButton } from '@/components/ui'
import { PageHeader, SampleBanner } from '@/components/app/parts'
import { sampleHistory } from '@/lib/sample'
import { cn } from '@/lib/cn'

const FILTERS = ['All', 'Squats', 'Push-Ups', 'Lunges'] as const

export function HistoryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const rows = sampleHistory.filter((r) => filter === 'All' || r.exercise === filter)
  return (
    <>
      <PageHeader
        title="Workout History"
        subtitle="Every session you have saved."
        action={
          <Link to="/app/workouts" className="text-sm font-medium text-secondary hover:underline">
            New workout
          </Link>
        }
      />
      <SampleBanner what="sessions" />
      <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Filter by exercise">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition',
              filter === f ? 'border-secondary bg-primary/25 text-ink' : 'border-line-strong text-muted hover:text-ink',
            )}
          >
            {f}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState
          icon={<Dumbbell className="size-6" aria-hidden="true" />}
          title="No sessions yet"
          description="Finish a workout and it will show up here."
          action={<LinkButton to="/app/workouts">Start a workout</LinkButton>}
        />
      ) : (
        <Card padded={false} className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-faint">
              <tr>
                {['Date', 'Exercise', 'Sets', 'Reps', 'Duration'].map((h) => (
                  <th key={h} scope="col" className="px-5 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3.5 text-muted">{r.date}</td>
                  <td className="px-5 py-3.5 font-medium">{r.exercise}</td>
                  <td className="px-5 py-3.5 tabular-nums">{r.sets}</td>
                  <td className="px-5 py-3.5 tabular-nums">{r.reps}</td>
                  <td className="px-5 py-3.5 tabular-nums text-muted">{r.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  )
}
