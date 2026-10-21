import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { ArrowRight, Dumbbell, Flame, HeartPulse, Zap, type LucideIcon } from 'lucide-react'
import { Logo } from '@/components/layout/Logo'
import { Button, ErrorMessage } from '@/components/ui'
import { api, getErrorMessage } from '@/lib/api'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { cn } from '@/lib/cn'

const TOTAL = 5

interface Choice {
  value: string
  label: string
  note?: string
  icon?: LucideIcon
  tone?: string
}

const GOALS: Choice[] = [
  { value: 'LOSE_WEIGHT', label: 'Lose Weight', note: 'Burn fat & get lean', icon: Flame, tone: 'text-orange-400' },
  { value: 'BUILD_STRENGTH', label: 'Build Strength', note: 'Get stronger', icon: Dumbbell, tone: 'text-violet-400' },
  { value: 'IMPROVE_FITNESS', label: 'Stay Fit', note: 'Maintain health', icon: HeartPulse, tone: 'text-rose-400' },
  { value: 'IMPROVE_CONSISTENCY', label: 'Build the Habit', note: 'Stay consistent', icon: Zap, tone: 'text-yellow-300' },
]
const LEVELS: Choice[] = [
  { value: 'BEGINNER', label: 'Beginner', note: 'New or returning to exercise' },
  { value: 'INTERMEDIATE', label: 'Intermediate', note: 'Exercise regularly' },
  { value: 'ADVANCED', label: 'Advanced', note: 'Train consistently for years' },
]
const EQUIPMENT = ['None (bodyweight)', 'Dumbbells', 'Resistance bands', 'Yoga mat']
const MINUTES = ['15', '30', '45', '60']
const DAYS = ['2', '3', '4', '5', '6']

function OptionCard({ c, selected, onSelect }: { c: Choice; selected: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      className={cn(
        'flex items-center gap-3 rounded-2xl border p-4 text-left transition',
        selected ? 'border-secondary bg-primary/25 shadow-glow' : 'border-line-strong bg-navy-800 hover:border-secondary/50',
      )}
    >
      {c.icon && <c.icon className={cn('size-6 shrink-0', c.tone)} aria-hidden="true" />}
      <span>
        <span className="block text-sm font-semibold">{c.label}</span>
        {c.note && <span className="block text-xs text-muted">{c.note}</span>}
      </span>
    </button>
  )
}

export function OnboardingPage() {
  useDocumentTitle('Welcome – FitAI')
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [goal, setGoal] = useState('LOSE_WEIGHT')
  const [level, setLevel] = useState('BEGINNER')
  const [equipment, setEquipment] = useState<string[]>(['None (bodyweight)'])
  const [minutes, setMinutes] = useState('30')
  const [days, setDays] = useState('3')
  const [limits, setLimits] = useState('')

  const save = useMutation({
    mutationFn: () =>
      api.patch('/users/me', {
        goal,
        experience: level,
        equipment,
        preferredMinutes: Number(minutes),
        weeklyWorkouts: Number(days),
        limitations: limits.trim() || undefined,
        onboardingCompleted: true,
      }),
    onSuccess: () => navigate('/app/dashboard'),
  })

  const toggleEquipment = (e: string) => setEquipment((cur) => (cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e]))
  const next = () => (step < TOTAL ? setStep(step + 1) : save.mutate())

  return (
    <div className="min-h-screen bg-hero-glow">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex w-full max-w-xs items-center gap-3 text-xs text-muted" aria-label={`Step ${step} of ${TOTAL}`}>
          <span className="whitespace-nowrap">Step {step} of {TOTAL}</span>
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={(step / TOTAL) * 100}>
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${(step / TOTAL) * 100}%` }} />
          </div>
          <span className="tabular-nums">{(step / TOTAL) * 100}%</span>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Let&apos;s Personalize Your Experience</h1>
          <p className="mt-2 text-muted">Tell us a bit about yourself. You can change any of this later in Settings.</p>

          <div className="mt-8" role="radiogroup" aria-label="Question">
            {step === 1 && (
              <>
                <h2 className="mb-4 font-semibold">What is your primary goal?</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {GOALS.map((g) => <OptionCard key={g.value} c={g} selected={goal === g.value} onSelect={() => setGoal(g.value)} />)}
                </div>
              </>
            )}
            {step === 2 && (
              <>
                <h2 className="mb-4 font-semibold">What is your fitness experience?</h2>
                <div className="grid gap-3">
                  {LEVELS.map((g) => <OptionCard key={g.value} c={g} selected={level === g.value} onSelect={() => setLevel(g.value)} />)}
                </div>
              </>
            )}
            {step === 3 && (
              <>
                <h2 className="mb-1 font-semibold">What equipment do you have?</h2>
                <p className="mb-4 text-sm text-muted">Select all that apply.</p>
                <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Equipment">
                  {EQUIPMENT.map((e) => (
                    <button key={e} type="button" aria-pressed={equipment.includes(e)} onClick={() => toggleEquipment(e)} className={cn('rounded-2xl border p-4 text-left text-sm font-semibold transition', equipment.includes(e) ? 'border-secondary bg-primary/25' : 'border-line-strong bg-navy-800 hover:border-secondary/50')}>
                      {e}
                    </button>
                  ))}
                </div>
              </>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="mb-3 font-semibold">How long per workout?</h2>
                  <div className="flex flex-wrap gap-3">
                    {MINUTES.map((m) => <OptionCard key={m} c={{ value: m, label: `${m} min` }} selected={minutes === m} onSelect={() => setMinutes(m)} />)}
                  </div>
                </div>
                <div>
                  <h2 className="mb-3 font-semibold">How many days per week?</h2>
                  <div className="flex flex-wrap gap-3">
                    {DAYS.map((d) => <OptionCard key={d} c={{ value: d, label: `${d} days` }} selected={days === d} onSelect={() => setDays(d)} />)}
                  </div>
                </div>
              </div>
            )}
            {step === 5 && (
              <div role="presentation">
                <h2 className="mb-1 font-semibold">Anything we should know? (optional)</h2>
                <p className="mb-3 text-sm text-muted">Injuries, limitations or accessibility needs help us avoid unsuitable suggestions. We only use this to tailor your plans.</p>
                <textarea aria-label="Limitations or accessibility needs" rows={4} maxLength={300} value={limits} onChange={(e) => setLimits(e.target.value)} className="w-full rounded-2xl border border-line-strong bg-navy-800 p-4 text-sm placeholder:text-faint focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30" placeholder="e.g. sore knees, prefer low-impact moves" />
                <p className="mt-2 text-xs text-faint">FitAI gives general exercise guidance, not medical advice. Check with a professional if you have a health condition.</p>
              </div>
            )}
          </div>

          {save.isError && <ErrorMessage className="mt-6" message={getErrorMessage(save.error, 'We could not save your answers.')} />}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
            <Button size="lg" className="min-w-48 flex-1 sm:flex-none" loading={save.isPending} onClick={next}>
              {step === TOTAL ? 'Finish' : 'Next'} <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
            <Link to="/app/dashboard" className="text-sm font-medium text-secondary hover:underline">Skip for now</Link>
          </div>
        </div>
        <div className="relative mx-auto hidden w-full max-w-md lg:block">
          <div className="absolute -inset-[8%] bg-[radial-gradient(closest-side,rgb(124_58_237/0.4),transparent)]" aria-hidden="true" />
          <img src="/images/athlete-woman.webp" alt="" className="relative w-full rounded-[2rem] border border-line-strong object-cover [mask-image:linear-gradient(to_bottom,black_82%,transparent)]" />
          <p className="absolute bottom-8 left-1/2 w-4/5 -translate-x-1/2 rounded-2xl border border-line-strong bg-navy-900/80 px-4 py-3 text-center text-sm font-medium backdrop-blur">
            A healthier, stronger you starts here.
          </p>
        </div>
      </div>
    </div>
  )
}
