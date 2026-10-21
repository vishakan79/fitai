import { Check, Lightbulb } from 'lucide-react'
import { useDemoReps } from '@/lib/useDemoReps'
import { cn } from '@/lib/cn'

function RepCard({ reps, target, className, checks }: { reps: number; target: number; className?: string; checks?: string[] }) {
  return (
    <div className={cn('rounded-2xl border border-line-strong bg-navy-900/80 p-4 backdrop-blur', className)}>
      <div className="flex items-center justify-between gap-6">
        <p className="text-sm font-semibold">Squat</p>
      </div>
      <p className="mt-0.5 text-2xl font-bold tabular-nums">
        <span className="text-success-glow">{reps}</span>
        <span className="text-muted"> / {target} Reps</span>
      </p>
      <div className="mt-2 h-1.5 w-40 overflow-hidden rounded-full bg-line">
        <div
          className="h-full rounded-full bg-gradient-to-r from-success to-success-glow transition-[width] duration-500"
          style={{ width: `${(reps / target) * 100}%` }}
        />
      </div>
      {checks && (
        <ul className="mt-3 space-y-1.5 text-xs font-medium">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-2">
              <span className="grid size-4 place-items-center rounded-full bg-success text-navy-900">
                <Check className="size-3" aria-hidden="true" />
              </span>
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/** Hero artwork: the woman squat photo with floating form-feedback cards (demo only). */
export function HeroPhoto({ className }: { className?: string }) {
  const { reps, target } = useDemoReps({ start: 12 })
  return (
    <div className={cn('relative mx-auto aspect-[4/5] w-full max-w-[34rem]', className)}>
      <div className="absolute -inset-[8%] bg-[radial-gradient(closest-side,rgb(124_58_237/0.5),transparent)]" aria-hidden="true" />
      <img
        src="/images/athlete-woman.webp"
        alt="Woman doing a bodyweight squat with a glowing pose-tracking skeleton overlay"
        width={640}
        height={920}
        fetchPriority="high"
        className="animate-breathe absolute inset-x-[6%] bottom-0 top-[4%] h-[92%] w-[88%] rounded-[2rem] object-cover object-top [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
      />
      <div className="absolute left-0 top-[8%] flex items-center gap-2.5 rounded-full border border-success/70 bg-navy-900/80 px-4 py-2 text-sm font-semibold text-success-glow backdrop-blur">
        <span className="grid size-6 place-items-center rounded-full bg-success text-navy-900">
          <Check className="size-4" aria-hidden="true" />
        </span>
        Perfect Form!
      </div>
      <RepCard
        reps={reps}
        target={target}
        checks={['Back straight', 'Knees aligned', 'Full range of motion']}
        className="absolute right-0 top-[4%]"
      />
      <div className="absolute bottom-[14%] right-0 flex items-center gap-3 rounded-2xl border border-secondary/50 bg-primary/30 px-4 py-3 backdrop-blur">
        <span className="grid size-9 place-items-center rounded-full bg-primary/50 text-amber-200">
          <Lightbulb className="size-5" aria-hidden="true" />
        </span>
        <p className="text-sm font-semibold leading-tight">
          Keep your back
          <br />
          straight
        </p>
      </div>
      <p className="absolute bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-navy-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-faint">
        Demo animation
      </p>
    </div>
  )
}

/** Panel artwork: the man squat photo with a live-updating checklist card (demo only). */
export function ActionPhoto({ className }: { className?: string }) {
  const { reps, target } = useDemoReps({ start: 13, everyMs: 4200 })
  return (
    <div className={cn('relative isolate min-h-[22rem] overflow-hidden', className)}>
      <img
        src="/images/athlete-man.webp"
        alt="Man doing a bodyweight squat with a glowing pose-tracking skeleton overlay"
        width={596}
        height={544}
        loading="lazy"
        className="absolute inset-0 size-full object-cover object-[50%_22%]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-card/70 via-transparent to-transparent" />
      <div className="pointer-events-none absolute inset-3 rounded-2xl border border-success/40" />
      <RepCard
        reps={reps}
        target={target}
        checks={['Good Posture', 'Knees Aligned', 'Go Deeper']}
        className="absolute right-4 top-4"
      />
      <p className="absolute bottom-3 left-4 rounded-full bg-navy-900/70 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-faint">
        Demo animation
      </p>
    </div>
  )
}
