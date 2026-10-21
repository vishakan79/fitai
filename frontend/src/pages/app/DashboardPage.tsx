import { Link } from 'react-router-dom'
import { ArrowRight, Check, Flame } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card, LinkButton } from '@/components/ui'
import { SampleBanner, StatCard, chartTooltip } from '@/components/app/parts'
import { sampleStats, sampleTodayPlan, sampleUser, sampleWeek } from '@/lib/sample'

function greeting() {
  const h = new Date().getHours()
  return h < 12 ? 'Good Morning' : h < 18 ? 'Good Afternoon' : 'Good Evening'
}

export function DashboardPage() {
  return (
    <>
      <SampleBanner />
      <div className="mb-8 grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-center">
        <div>
          <p className="text-sm text-muted">{greeting()},</p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight">{sampleUser.name}! <span aria-hidden="true">👋</span></h1>
          <p className="mt-2 text-muted">Let&apos;s make today a great workout day.</p>
        </div>
        <Card className="flex items-center gap-4 p-4">
          <img src="/images/athlete-man.webp" alt="" className="size-20 rounded-xl object-cover object-top" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted">Today&apos;s Plan</p>
            <p className="font-semibold">
              {sampleTodayPlan.name} – {sampleTodayPlan.day}
            </p>
            <LinkButton to="/app/workouts/live" size="sm" className="mt-2">
              Start Workout <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
          </div>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Workouts" value={String(sampleStats.totalWorkouts)} />
        <StatCard label="Total Reps" value={sampleStats.totalReps.toLocaleString()} />
        <StatCard label="Total Time" value={sampleStats.totalTime} />
        <Card className="flex items-center justify-between p-5">
          <div>
            <p className="text-xs font-medium text-muted">Current Streak</p>
            <p className="mt-2 text-3xl font-bold tracking-tight">{sampleStats.streakDays} days</p>
          </div>
          <span className="grid size-12 place-items-center rounded-full bg-primary/25 text-orange-400">
            <Flame className="size-6" aria-hidden="true" />
          </span>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_1.3fr]">
        <Card>
          <h2 className="text-lg font-semibold">Today&apos;s Workout</h2>
          <p className="text-sm text-muted">{sampleTodayPlan.name} ({sampleTodayPlan.day})</p>
          <ul className="mt-5 space-y-3">
            {sampleTodayPlan.exercises.map((e) => (
              <li key={e.name} className="flex items-center justify-between rounded-xl border border-line bg-navy-800 px-4 py-3">
                <span className="flex items-center gap-3 font-medium">
                  <span className="grid size-6 place-items-center rounded-full bg-success/20 text-success-glow">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  {e.name}
                </span>
                <span className="text-sm tabular-nums text-muted">
                  {e.sets} × {e.reps}
                </span>
              </li>
            ))}
          </ul>
          <LinkButton to="/app/workouts/live" size="lg" className="mt-6 w-full">
            Start Workout <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Weekly Progress</h2>
            <Link to="/app/progress" className="text-sm font-medium text-secondary hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-4 h-64" role="img" aria-label="Sample bar chart of repetitions per day this week">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sampleWeek} margin={{ top: 8, right: 4, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#34f5b0" />
                    <stop offset="1" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2a47" vertical={false} />
                <XAxis dataKey="day" stroke="#6f7ba0" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#6f7ba0" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip {...chartTooltip} formatter={(v) => [`${v} reps`, 'Repetitions']} />
                <Bar dataKey="reps" fill="url(#barGrad)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </>
  )
}
