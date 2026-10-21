import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Card } from '@/components/ui'
import { PageHeader, SampleBanner, StatCard, chartTooltip } from '@/components/app/parts'
import { sampleBreakdown, sampleMonthly, sampleProgressStats, sampleWeek } from '@/lib/sample'
import { cn } from '@/lib/cn'

const RANGES = ['This Week', 'This Month', 'This Year'] as const

export function ProgressPage() {
  const [range, setRange] = useState<(typeof RANGES)[number]>('This Year')
  const data = range === 'This Week' ? sampleWeek.map((d) => ({ x: d.day, reps: d.reps })) : sampleMonthly.map((d) => ({ x: d.m, reps: d.reps }))
  return (
    <>
      <PageHeader title="Your Progress" subtitle="Track your fitness journey over time." />
      <SampleBanner />
      <div role="tablist" aria-label="Date range" className="mb-5 flex flex-wrap gap-2">
        {RANGES.map((r) => (
          <button key={r} role="tab" aria-selected={range === r} onClick={() => setRange(r)} className={cn('rounded-full px-5 py-2 text-sm font-medium transition', range === r ? 'bg-primary text-white' : 'border border-line-strong text-muted hover:text-ink')}>
            {r}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sampleProgressStats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <h2 className="text-lg font-semibold">Workout Activity</h2>
          <div className="mt-4 h-72" role="img" aria-label={`Sample area chart of repetitions, ${range.toLowerCase()}`}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#34f5b0" stopOpacity={0.5} />
                    <stop offset="1" stopColor="#34f5b0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e2a47" vertical={false} />
                <XAxis dataKey="x" stroke="#6f7ba0" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#6f7ba0" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip {...chartTooltip} formatter={(v) => [`${v} reps`, 'Repetitions']} />
                <Area type="monotone" dataKey="reps" stroke="#34f5b0" strokeWidth={2.5} fill="url(#areaGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Exercise Breakdown</h2>
          <div className="mt-2 flex flex-wrap items-center gap-6">
            <div className="h-44 w-44" role="img" aria-label="Sample donut chart of exercise share">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={sampleBreakdown} dataKey="value" innerRadius={52} outerRadius={78} paddingAngle={3} stroke="none">
                    {sampleBreakdown.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 text-sm">
              {sampleBreakdown.map((s) => (
                <li key={s.name} className="flex items-center gap-2.5">
                  <span className="size-2.5 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                  <span className="w-20 text-muted">{s.name}</span>
                  <span className="tabular-nums">{s.value}%</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </>
  )
}
