import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Camera, Search } from 'lucide-react'
import { Badge, Card, EmptyState, LinkButton } from '@/components/ui'
import { PageHeader } from '@/components/app/parts'
import { bodyAreas, exerciseCatalog } from '@/lib/content'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { cn } from '@/lib/cn'

export function ExercisesPage() {
  const [q, setQ] = useState('')
  const [area, setArea] = useState<(typeof bodyAreas)[number]>('All')
  const rows = useMemo(
    () =>
      exerciseCatalog.filter(
        (e) => (area === 'All' || e.area === area) && e.name.toLowerCase().includes(q.trim().toLowerCase()),
      ),
    [q, area],
  )
  return (
    <>
      <PageHeader title="Exercise Library" subtitle="Explore exercises with detailed instructions." />
      <div className="relative mb-4 max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
        <input
          type="search"
          aria-label="Search exercises"
          placeholder="Search exercises…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="h-12 w-full rounded-full border border-line-strong bg-navy-800 pl-11 pr-4 text-sm placeholder:text-faint focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30"
        />
      </div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by body area">
        {bodyAreas.map((a) => (
          <button key={a} type="button" aria-pressed={area === a} onClick={() => setArea(a)} className={cn('rounded-full px-5 py-2 text-sm font-medium transition', area === a ? 'bg-primary text-white' : 'border border-line-strong text-muted hover:text-ink')}>
            {a}
          </button>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState title="No exercises found" description="Try a different search or filter." />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map((e) => (
            <li key={e.id}>
              <Link to={`/app/exercises/${e.id}`} className="block">
                <Card interactive padded={false} className="overflow-hidden">
                  <img src={e.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
                  <div className="flex items-start justify-between gap-3 p-4">
                    <div>
                      <h2 className="font-semibold">{e.name}</h2>
                      <p className="text-xs text-muted">{e.area}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge tone={e.level === 'Beginner' ? 'success' : 'warning'}>{e.level}</Badge>
                      {e.tracked && (
                        <Badge tone="primary">
                          <Camera className="size-3" aria-hidden="true" /> Tracked
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export function ExerciseDetailPage() {
  const { id } = useParams()
  const ex = exerciseCatalog.find((e) => e.id === id)
  useDocumentTitle(`${ex?.name ?? 'Exercise'} – FitAI`)
  if (!ex) return <EmptyState title="Exercise not found" action={<LinkButton to="/app/exercises">Back to library</LinkButton>} />
  return (
    <>
      <Link to="/app/exercises" className="mb-4 inline-flex items-center gap-1 text-sm text-muted hover:text-ink">
        <ArrowLeft className="size-4" aria-hidden="true" /> Exercise library
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <img src={ex.image} alt={`${ex.name} demonstration`} className="w-full rounded-3xl border border-line object-cover" />
        <div>
          <div className="flex flex-wrap gap-2">
            <Badge>{ex.area}</Badge>
            <Badge tone={ex.level === 'Beginner' ? 'success' : 'warning'}>{ex.level}</Badge>
            <Badge>Equipment: {ex.equipment}</Badge>
            {ex.tracked ? <Badge tone="primary">Camera tracked</Badge> : <Badge>Instructions only</Badge>}
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{ex.name}</h1>
          <p className="mt-2 text-muted">{ex.description}</p>
          <p className="mt-4 text-sm">
            <span className="font-medium">Targets:</span> <span className="text-muted">{ex.muscles.join(', ')}</span>
          </p>
          <h2 className="mt-6 font-semibold">How to do it</h2>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm text-muted">
            {ex.instructions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <h2 className="mt-6 font-semibold">Common mistakes</h2>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted">
            {ex.mistakes.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm">
            <span className="font-medium">Camera setup:</span> <span className="text-muted">{ex.camera}</span>
          </p>
          {ex.tracked && (
            <LinkButton to={`/app/workouts/live?exercise=${ex.id}`} size="lg" className="mt-6">
              <Camera className="size-4" aria-hidden="true" /> Start tracked workout
            </LinkButton>
          )}
        </div>
      </div>
    </>
  )
}
