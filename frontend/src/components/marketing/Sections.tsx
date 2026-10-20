import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronDown } from 'lucide-react'
import { Badge, Card, LinkButton } from '@/components/ui'
import { cn } from '@/lib/cn'
import { faqs, features, goals, plans, steps, supportedExercises, type GoalId } from '@/lib/content'

export function Section({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id?: string
  eyebrow?: string
  title: string
  intro?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={cn('mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8', className)}>
      <div className="mx-auto max-w-2xl text-center">
        {eyebrow && <Badge tone="primary">{eyebrow}</Badge>}
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {intro && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{intro}</p>}
      </div>
      <div className="mt-12">{children}</div>
    </section>
  )
}

/** Compact five-up strip used on the home page. */
export function FeatureStrip() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {features.map((f) => (
        <li key={f.title}>
          <Card interactive className="flex h-full items-start gap-4 p-5">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-secondary">
              <f.icon className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-sm font-semibold leading-snug">{f.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{f.short}</p>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  )
}

export function FeatureGrid() {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {features.map((f) => (
        <li key={f.title}>
          <Card interactive className="h-full">
            <span className="grid size-12 place-items-center rounded-xl bg-primary/15 text-secondary">
              <f.icon className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.long}</p>
          </Card>
        </li>
      ))}
    </ul>
  )
}

export function StepList() {
  return (
    <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {steps.map((s, i) => (
        <li key={s.title}>
          <Card className="h-full">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                {i + 1}
              </span>
              <s.icon className="size-5 text-secondary" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </Card>
        </li>
      ))}
    </ol>
  )
}

export function ExerciseCards() {
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {supportedExercises.map((e) => (
        <li key={e.name}>
          <Card interactive className="h-full">
            <Badge tone="success">
              <Check className="size-3" aria-hidden="true" /> Camera tracked
            </Badge>
            <h3 className="mt-4 text-lg font-semibold">{e.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{e.blurb}</p>
          </Card>
        </li>
      ))}
    </ul>
  )
}

/** Goal picker: selecting a goal carries it into registration as a query parameter. */
export function GoalPicker() {
  const [goal, setGoal] = useState<GoalId>('lose-weight')
  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-2xl font-bold">Choose Your Goal</h3>
      <div role="radiogroup" aria-label="Fitness goal" className="mt-5 grid gap-3 sm:grid-cols-2">
        {goals.map((g) => {
          const selected = g.id === goal
          return (
            <button
              key={g.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setGoal(g.id)}
              className={cn(
                'flex h-14 items-center gap-3 rounded-2xl border px-5 text-sm font-semibold transition',
                selected
                  ? 'border-secondary bg-primary/25 text-ink shadow-glow'
                  : 'border-line-strong bg-navy-800 text-muted hover:border-secondary/50 hover:text-ink',
              )}
            >
              <g.icon className={cn('size-5', selected ? 'text-secondary' : 'text-faint')} aria-hidden="true" />
              {g.label}
            </button>
          )
        })}
      </div>
      <LinkButton to={`/register?goal=${goal}`} className="mt-6">
        Start with this goal <ArrowRight className="size-4" aria-hidden="true" />
      </LinkButton>
    </Card>
  )
}

export function PricingCards() {
  return (
    <ul className="grid items-stretch gap-6 lg:grid-cols-3">
      {plans.map((p) => (
        <li key={p.id}>
          <Card
            className={cn(
              'relative flex h-full flex-col p-8',
              p.highlighted && 'border-secondary/60 shadow-glow',
            )}
          >
            {p.highlighted && (
              <Badge tone="primary" className="absolute -top-3 left-8 bg-navy-900">
                Most popular
              </Badge>
            )}
            <h3 className="text-xl font-bold">{p.name}</h3>
            <p className="mt-1 text-sm text-muted">{p.tagline}</p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold tabular-nums">₹{p.priceInr}</span>
              <span className="text-sm text-muted">{p.priceInr === 0 ? 'forever' : '/month'}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-sm text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <LinkButton
              to="/register"
              variant={p.highlighted ? 'primary' : 'secondary'}
              className="mt-8 w-full"
            >
              {p.priceInr === 0 ? 'Start free' : `Choose ${p.name}`}
            </LinkButton>
          </Card>
        </li>
      ))}
    </ul>
  )
}

export function PricingNote() {
  return (
    <p className="mt-8 text-center text-xs leading-relaxed text-faint">
      Prices and limits shown are initial proposals and may change before launch. Paid checkout is not yet enabled.
    </p>
  )
}

export function FaqList({ limit }: { limit?: number }) {
  const [open, setOpen] = useState<number | null>(0)
  const items = limit ? faqs.slice(0, limit) : faqs
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q} className="surface overflow-hidden">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold"
              >
                {item.q}
                <ChevronDown
                  className={cn('size-5 shrink-0 text-secondary transition-transform', isOpen && 'rotate-180')}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div id={`faq-${i}`} role="region" hidden={!isOpen} className="px-6 pb-5 text-sm leading-relaxed text-muted">
              {item.a}
            </div>
          </div>
        )
      })}
      {limit && (
        <p className="pt-2 text-center text-sm">
          <Link to="/faq" className="font-medium text-secondary hover:underline">
            See all questions
          </Link>
        </p>
      )}
    </div>
  )
}

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-[2rem] border border-secondary/30 bg-gradient-to-br from-primary/30 via-card to-navy-900 px-6 py-14 text-center sm:px-12">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready for your first workout?</h2>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Create a free account, set up your camera and start your first tracked set in a couple of minutes.
        </p>
        <LinkButton to="/register" size="lg" className="mt-8">
          Start Free Workout <ArrowRight className="size-5" aria-hidden="true" />
        </LinkButton>
      </div>
    </section>
  )
}
