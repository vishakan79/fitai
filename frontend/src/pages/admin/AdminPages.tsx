import type { ReactNode } from 'react'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Badge, Card, EmptyState } from '@/components/ui'
import { PageHeader, SampleBanner, StatCard, chartTooltip } from '@/components/app/parts'
import { sampleAdmin } from '@/lib/sample'
import { exerciseCatalog, plans } from '@/lib/content'

/**
 * Admin screens. Access is enforced by the backend (role-based); these views never hold credentials
 * or sensitive user data. Numbers shown here are sample data until the admin APIs are connected.
 */

function Table({ head, children, caption }: { head: string[]; children: ReactNode; caption: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-line">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-navy-800 text-xs uppercase tracking-wider text-muted">
          <tr>
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line bg-card/50">{children}</tbody>
      </table>
    </div>
  )
}
const td = 'px-4 py-3'

export function AdminDashboardPage() {
  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Manage users, exercises, and subscriptions." />
      <SampleBanner what="platform figures" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {sampleAdmin.stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <h2 className="text-lg font-semibold">User Growth</h2>
          <div className="mt-4 h-64" role="img" aria-label="Sample line chart of new users per month">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sampleAdmin.growth} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
                <CartesianGrid stroke="#1e2a47" vertical={false} />
                <XAxis dataKey="m" stroke="#6f7ba0" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis stroke="#6f7ba0" tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip {...chartTooltip} />
                <Line type="monotone" dataKey="users" stroke="#a78bfa" strokeWidth={2.5} dot={{ r: 3, fill: '#a78bfa' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h2 className="text-lg font-semibold">Recent Users</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {sampleAdmin.recent.map((u) => (
              <li key={u.email} className="flex items-center justify-between gap-3">
                <span>
                  <span className="block font-medium">{u.name}</span>
                  <span className="text-xs text-muted">{u.email}</span>
                </span>
                <span className="text-xs text-muted">{u.joined}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}

export function AdminUsersPage() {
  return (
    <>
      <PageHeader title="Users" subtitle="Account status management. Credentials and tokens are never shown." />
      <SampleBanner what="users" />
      <Table caption="Users" head={['Name', 'Email', 'Joined', 'Status']}>
        {sampleAdmin.recent.map((u) => (
          <tr key={u.email}>
            <td className={td}>{u.name}</td>
            <td className={td}>{u.email}</td>
            <td className={td}>{u.joined}</td>
            <td className={td}><Badge tone="success">Active</Badge></td>
          </tr>
        ))}
      </Table>
    </>
  )
}

export function AdminExercisesPage() {
  return (
    <>
      <PageHeader title="Exercise Catalogue" subtitle="Curated exercises. Editing is enabled once the admin API is connected." />
      <Table caption="Exercises" head={['Exercise', 'Area', 'Level', 'Camera tracking']}>
        {exerciseCatalog.map((e) => (
          <tr key={e.id}>
            <td className={td}>{e.name}</td>
            <td className={td}>{e.area}</td>
            <td className={td}>{e.level}</td>
            <td className={td}>{e.tracked ? <Badge tone="success">Tracked</Badge> : <Badge>Instructions only</Badge>}</td>
          </tr>
        ))}
      </Table>
    </>
  )
}

export function AdminSubscriptionsPage() {
  return (
    <>
      <PageHeader title="Subscription Plans" subtitle="Plans and entitlements are stored and enforced by the backend." />
      <Table caption="Subscription plans" head={['Plan', 'Price / month', 'Features']}>
        {plans.map((p) => (
          <tr key={p.id}>
            <td className={td}>{p.name}</td>
            <td className={`${td} tabular-nums`}>₹{p.priceInr}</td>
            <td className={`${td} text-muted`}>{p.features.length} listed</td>
          </tr>
        ))}
      </Table>
    </>
  )
}

export function AdminPaymentsPage() {
  return (
    <>
      <PageHeader title="Payments" subtitle="Payment summaries and history." />
      <EmptyState title="No payments yet" description="Payments appear here after the payment provider is configured and a verified payment is recorded." />
    </>
  )
}

export function AdminUsagePage() {
  const data = [
    { d: 'Mon', calls: 20 }, { d: 'Tue', calls: 34 }, { d: 'Wed', calls: 28 }, { d: 'Thu', calls: 45 }, { d: 'Fri', calls: 38 },
  ]
  return (
    <>
      <PageHeader title="AI Usage" subtitle="Assistant and plan-generation requests, and errors." />
      <SampleBanner what="usage figures" />
      <Card>
        <div className="h-72" role="img" aria-label="Sample bar chart of AI requests per day">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid stroke="#1e2a47" vertical={false} />
              <XAxis dataKey="d" stroke="#6f7ba0" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis stroke="#6f7ba0" tickLine={false} axisLine={false} fontSize={12} />
              <Tooltip {...chartTooltip} />
              <Bar dataKey="calls" fill="#7c3aed" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  )
}
