import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, Minus, Plus, Check } from 'lucide-react'
import { Badge, Button, Card } from '@/components/ui'
import { PageHeader } from '@/components/app/parts'
import { exerciseCatalog } from '@/lib/content'
import { cn } from '@/lib/cn'

function Stepper({ label, value, onChange, min, max, step = 1 }: { label: string; value: number; onChange: (n: number) => void; min: number; max: number; step?: number }) {
  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-2 inline-flex items-center gap-4 rounded-full border border-line-strong bg-navy-800 p-1.5">
        <button type="button" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - step))} className="grid size-9 place-items-center rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-40">
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-8 text-center text-lg font-bold tabular-nums">{value}</output>
        <button type="button" aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + step))} className="grid size-9 place-items-center rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-40">
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export function WorkoutsPage() {
  const navigate = useNavigate()
  const tracked = exerciseCatalog.filter((e) => e.tracked)
  const [exercise, setExercise] = useState(tracked[0].id)
  const [reps, setReps] = useState(12)
  const [sets, setSets] = useState(3)

  return (
    <>
      <PageHeader
        title="Workouts"
        subtitle="Pick an exercise, set your target and start. Camera tracking runs on your device."
        action={
          <Link to="/app/workouts/history" className="text-sm font-medium text-secondary hover:underline">
            View history
          </Link>
        }
      />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="text-lg font-semibold">Choose an exercise</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3" role="radiogroup" aria-label="Exercise">
            {tracked.map((e) => {
              const selected = e.id === exercise
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setExercise(e.id)}
                    className={cn(
                      'group relative w-full overflow-hidden rounded-2xl border text-left transition',
                      selected ? 'border-secondary shadow-glow' : 'border-line hover:border-secondary/50',
                    )}
                  >
                    <img src={e.image} alt="" className="aspect-[16/11] w-full object-cover" />
                    {selected && (
                      <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-primary text-white">
                        <Check className="size-4" aria-hidden="true" />
                      </span>
                    )}
                    <div className="p-3">
                      <p className="font-semibold">{e.name}</p>
                      <p className="text-xs text-muted">{e.area}</p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        </Card>
        <Card className="flex flex-col">
          <h2 className="text-lg font-semibold">Your target</h2>
          <div className="mt-5 flex flex-wrap gap-8">
            <Stepper label="Reps per set" value={reps} onChange={setReps} min={3} max={50} />
            <Stepper label="Sets" value={sets} onChange={setSets} min={1} max={10} />
          </div>
          <Badge tone="neutral" className="mt-6 self-start">
            {reps * sets} reps in total
          </Badge>
          <p className="mt-4 text-sm text-muted">
            Tip: place your device 2–3 metres away so your full body is visible, in good light.
          </p>
          <Button
            size="lg"
            className="mt-auto w-full pt-0"
            onClick={() => navigate(`/app/workouts/live?exercise=${exercise}&reps=${reps}&sets=${sets}`)}
          >
            Continue <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </Card>
      </div>
    </>
  )
}
