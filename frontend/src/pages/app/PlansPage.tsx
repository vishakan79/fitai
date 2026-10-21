import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Sparkles } from 'lucide-react'
import { Badge, Button, Card, Dialog, ErrorMessage, useToast } from '@/components/ui'
import { PageHeader, SampleBanner } from '@/components/app/parts'
import { api, getErrorMessage } from '@/lib/api'
import { samplePlans } from '@/lib/sample'
import { cn } from '@/lib/cn'

const TABS = ['My Plans', 'AI Generated'] as const
const GOALS = ['Lose weight', 'Build strength', 'Improve fitness', 'Improve consistency']
const LEVELS = ['Beginner', 'Intermediate', 'Advanced']
const EQUIPMENT = ['None', 'Dumbbells', 'Resistance bands', 'Yoga mat']

const field =
  'h-11 w-full rounded-xl border border-line-strong bg-navy-800 px-3 text-sm text-ink focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30'

function GenerateDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast()
  const [form, setForm] = useState({ goal: GOALS[1], level: LEVELS[0], minutes: 30, days: 3, limitations: '' })
  const [equipment, setEquipment] = useState<string[]>(['None'])
  const gen = useMutation({
    mutationFn: () =>
      api.post('/workout-plans/generate', {
        goal: form.goal,
        experience: form.level,
        durationMinutes: form.minutes,
        daysPerWeek: form.days,
        equipment,
        limitations: form.limitations.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success('Your plan was generated and saved.')
      onClose()
    },
  })
  const toggle = (e: string) => setEquipment((cur) => (cur.includes(e) ? cur.filter((x) => x !== e) : [...cur, e]))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Generate a new plan"
      description="AI drafts a plan, then our server validates every exercise and value before saving."
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={gen.isPending} disabled={equipment.length === 0} onClick={() => gen.mutate()}>
            <Sparkles className="size-4" aria-hidden="true" /> Generate
          </Button>
        </>
      }
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {gen.isError && <ErrorMessage message={getErrorMessage(gen.error, 'We could not generate a plan right now.')} />}
        <label className="block text-sm font-medium">
          Goal
          <select className={cn(field, 'mt-1.5')} value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
            {GOALS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <div className="grid grid-cols-3 gap-3">
          <label className="block text-sm font-medium">
            Experience
            <select className={cn(field, 'mt-1.5')} value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
              {LEVELS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Minutes
            <input type="number" min={10} max={90} className={cn(field, 'mt-1.5')} value={form.minutes} onChange={(e) => setForm({ ...form, minutes: Math.min(90, Math.max(10, Number(e.target.value) || 10)) })} />
          </label>
          <label className="block text-sm font-medium">
            Days / week
            <input type="number" min={1} max={7} className={cn(field, 'mt-1.5')} value={form.days} onChange={(e) => setForm({ ...form, days: Math.min(7, Math.max(1, Number(e.target.value) || 1)) })} />
          </label>
        </div>
        <fieldset>
          <legend className="text-sm font-medium">Equipment</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {EQUIPMENT.map((e) => (
              <button key={e} type="button" aria-pressed={equipment.includes(e)} onClick={() => toggle(e)} className={cn('rounded-full border px-4 py-1.5 text-sm', equipment.includes(e) ? 'border-secondary bg-primary/25' : 'border-line-strong text-muted hover:text-ink')}>
                {e}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm font-medium">
          Limitations or injuries (optional)
          <textarea rows={3} maxLength={300} className={cn(field, 'mt-1.5 h-auto py-2')} value={form.limitations} onChange={(e) => setForm({ ...form, limitations: e.target.value })} placeholder="e.g. sore knees, avoid jumping" />
        </label>
        <p className="text-xs text-faint">General suggestions only. Not medical or nutrition advice.</p>
      </form>
    </Dialog>
  )
}

export function PlansPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('My Plans')
  const [open, setOpen] = useState(false)
  const [viewing, setViewing] = useState<(typeof samplePlans)[number] | null>(null)
  const plans = samplePlans.filter((p) => (tab === 'AI Generated' ? p.ai : true))

  return (
    <>
      <PageHeader
        title="Your Workout Plans"
        subtitle="Create personalised plans with AI."
        action={
          <Button onClick={() => setOpen(true)}>
            <Sparkles className="size-4" aria-hidden="true" /> Generate New Plan
          </Button>
        }
      />
      <SampleBanner what="plans" />
      <div role="tablist" aria-label="Plan filter" className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn('rounded-full px-5 py-2 text-sm font-medium transition', tab === t ? 'bg-primary text-white' : 'border border-line-strong text-muted hover:text-ink')}>
            {t}
          </button>
        ))}
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {plans.map((p) => (
          <li key={p.id}>
            <Card interactive padded={false} className="overflow-hidden">
              <div className="relative">
                <img src={p.image} alt="" loading="lazy" className="aspect-[16/10] w-full object-cover" />
                {p.ai && <Badge tone="success" className="absolute left-3 top-3 bg-navy-900/80">AI</Badge>}
              </div>
              <div className="p-5">
                <h2 className="font-semibold">{p.name}</h2>
                <p className="mt-1 text-xs text-muted">
                  {p.weeks} weeks · {p.level}
                </p>
                <p className="text-xs text-muted">{p.workouts} workouts</p>
                <Button size="sm" className="mt-4 w-full" onClick={() => setViewing(p)}>
                  View Plan
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </ul>
      <GenerateDialog open={open} onClose={() => setOpen(false)} />
      <Dialog open={viewing !== null} onClose={() => setViewing(null)} title={viewing?.name ?? ''} description="Sample plan overview">
        {viewing && (
          <p className="text-sm text-muted">
            {viewing.weeks} weeks · {viewing.level} · {viewing.workouts} workouts. Detailed day-by-day schedules appear here
            once plans are stored by the backend.
          </p>
        )}
      </Dialog>
    </>
  )
}
