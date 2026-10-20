import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Card } from '@/components/ui'

/** Illustrative values only. They are labelled as a sample and never presented as a user's real data. */
const SAMPLE = [
  { day: 'Mon', reps: 45 },
  { day: 'Tue', reps: 0 },
  { day: 'Wed', reps: 60 },
  { day: 'Thu', reps: 30 },
  { day: 'Fri', reps: 75 },
  { day: 'Sat', reps: 0 },
  { day: 'Sun', reps: 50 },
]

export function DashboardPreview() {
  return (
    <Card className="p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold">Weekly activity</h3>
        <Badge>Sample preview, not real data</Badge>
      </div>
      <div className="mt-6 h-64" role="img" aria-label="Sample bar chart of repetitions completed each day of the week">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={SAMPLE} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid stroke="#1e2a47" vertical={false} />
            <XAxis dataKey="day" stroke="#6f7ba0" tickLine={false} axisLine={false} fontSize={12} />
            <YAxis stroke="#6f7ba0" tickLine={false} axisLine={false} fontSize={12} />
            <Tooltip
              cursor={{ fill: 'rgb(124 58 237 / 0.12)' }}
              contentStyle={{ background: '#10182b', border: '1px solid #2b3a5f', borderRadius: 12, color: '#f8fafc' }}
              formatter={(v) => [`${v} reps`, 'Repetitions']}
            />
            <Bar dataKey="reps" fill="#7c3aed" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-4 text-sm text-muted">
        In the app, every chart and total is calculated from the sessions you actually save.
      </p>
    </Card>
  )
}
