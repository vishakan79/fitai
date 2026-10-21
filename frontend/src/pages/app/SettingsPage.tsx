import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'
import { Download, Shield, Trash2 } from 'lucide-react'
import { Button, Card, Dialog, ErrorMessage, Input, useToast } from '@/components/ui'
import { PageHeader } from '@/components/app/parts'
import { api, getErrorMessage } from '@/lib/api'
import { cn } from '@/lib/cn'

const TABS = ['Profile', 'Preferences', 'Privacy & Data', 'Security'] as const

const profileSchema = z.object({
  displayName: z.string().trim().min(2, 'Enter at least 2 characters').max(60),
  age: z.coerce.number().int().min(18, 'FitAI is for adults (18+)').max(100, 'Enter a valid age'),
  heightCm: z.union([z.literal(''), z.coerce.number().min(100, 'Enter 100–250').max(250, 'Enter 100–250')]),
  weightKg: z.union([z.literal(''), z.coerce.number().min(30, 'Enter 30–300').max(300, 'Enter 30–300')]),
  goal: z.enum(['LOSE_WEIGHT', 'BUILD_STRENGTH', 'IMPROVE_FITNESS', 'IMPROVE_CONSISTENCY']),
})
type ProfileInput = z.input<typeof profileSchema>
type ProfileOutput = z.output<typeof profileSchema>

const select =
  'h-12 w-full rounded-xl border border-line-strong bg-navy-800 px-4 text-sm text-ink focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30'

function ProfileTab() {
  const toast = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInput, unknown, ProfileOutput>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: '', age: '' as unknown as number, heightCm: '', weightKg: '', goal: 'BUILD_STRENGTH' },
  })
  const save = useMutation({
    mutationFn: (v: ProfileOutput) => api.patch('/users/me', v),
    onSuccess: () => toast.success('Profile updated.'),
  })
  return (
    <Card className="max-w-2xl">
      <h2 className="text-lg font-semibold">Profile Information</h2>
      <p className="mt-1 text-sm text-muted">Optional details help tailor your plans. Height and weight are never required.</p>
      <form onSubmit={handleSubmit((v) => save.mutate(v))} noValidate className="mt-5 space-y-4">
        {save.isError && <ErrorMessage message={getErrorMessage(save.error, 'Could not save your profile.')} />}
        <Input label="Full name" error={errors.displayName?.message} {...register('displayName')} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="Age" type="number" inputMode="numeric" error={errors.age?.message} {...register('age')} />
          <Input label="Height (cm)" type="number" inputMode="numeric" error={errors.heightCm?.message} {...register('heightCm')} />
          <Input label="Weight (kg)" type="number" inputMode="numeric" error={errors.weightKg?.message} {...register('weightKg')} />
        </div>
        <label className="block text-sm font-medium">
          Fitness goal
          <select className={cn(select, 'mt-1.5')} {...register('goal')}>
            <option value="LOSE_WEIGHT">Lose weight</option>
            <option value="BUILD_STRENGTH">Build strength</option>
            <option value="IMPROVE_FITNESS">Improve fitness</option>
            <option value="IMPROVE_CONSISTENCY">Improve consistency</option>
          </select>
        </label>
        <Button type="submit" size="lg" loading={save.isPending}>
          Update Profile
        </Button>
      </form>
    </Card>
  )
}

function PreferencesTab() {
  const toast = useToast()
  const [duration, setDuration] = useState('30')
  const [days, setDays] = useState('3')
  const save = useMutation({
    mutationFn: () => api.patch('/users/me', { preferredMinutes: Number(duration), weeklyWorkouts: Number(days) }),
    onSuccess: () => toast.success('Preferences saved.'),
  })
  return (
    <Card className="max-w-2xl">
      <h2 className="text-lg font-semibold">Workout preferences</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">
          Preferred duration
          <select className={cn(select, 'mt-1.5')} value={duration} onChange={(e) => setDuration(e.target.value)}>
            {['15', '30', '45', '60'].map((m) => (
              <option key={m} value={m}>{m} minutes</option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Workouts per week
          <select className={cn(select, 'mt-1.5')} value={days} onChange={(e) => setDays(e.target.value)}>
            {['1', '2', '3', '4', '5', '6', '7'].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </label>
      </div>
      {save.isError && <ErrorMessage className="mt-4" message={getErrorMessage(save.error)} />}
      <Button className="mt-6" size="lg" loading={save.isPending} onClick={() => save.mutate()}>
        Save preferences
      </Button>
    </Card>
  )
}

function PrivacyTab() {
  const navigate = useNavigate()
  const toast = useToast()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [typed, setTyped] = useState('')
  const exportData = useMutation({
    mutationFn: async () => {
      const { data } = await api.get('/users/me/export')
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'fitai-data-export.json'
      a.click()
      URL.revokeObjectURL(url)
    },
    onSuccess: () => toast.success('Your data export was downloaded.'),
  })
  const del = useMutation({
    mutationFn: () => api.delete('/users/me'),
    onSuccess: () => {
      toast.info('Your account was deleted.')
      navigate('/')
    },
  })
  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Shield className="size-5 text-success" aria-hidden="true" /> Camera privacy
        </h2>
        <p className="mt-2 text-sm text-muted">
          Pose tracking runs in your browser. Camera video is not uploaded or stored. Only the workout results you save
          are sent to our servers. You can revoke camera access in your browser settings at any time.
        </p>
        <p className="mt-3 text-sm">
          <Link to="/privacy" className="text-secondary hover:underline">Read the Privacy Policy</Link>
        </p>
      </Card>
      <Card>
        <h2 className="text-lg font-semibold">Export your data</h2>
        <p className="mt-1 text-sm text-muted">Download your profile and saved workouts as a JSON file.</p>
        {exportData.isError && <ErrorMessage className="mt-3" message={getErrorMessage(exportData.error)} />}
        <Button variant="secondary" className="mt-4" loading={exportData.isPending} onClick={() => exportData.mutate()}>
          <Download className="size-4" aria-hidden="true" /> Export data
        </Button>
      </Card>
      <Card className="border-danger/40">
        <h2 className="text-lg font-semibold text-danger">Delete account</h2>
        <p className="mt-1 text-sm text-muted">Permanently deletes your account and workout history. This cannot be undone.</p>
        <Button variant="danger" className="mt-4" onClick={() => setConfirmOpen(true)}>
          <Trash2 className="size-4" aria-hidden="true" /> Delete account
        </Button>
      </Card>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete your account?"
        description="Type DELETE to confirm. All of your data will be removed."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button variant="danger" disabled={typed !== 'DELETE'} loading={del.isPending} onClick={() => del.mutate()}>
              Delete permanently
            </Button>
          </>
        }
      >
        <input aria-label="Type DELETE to confirm" value={typed} onChange={(e) => setTyped(e.target.value)} className={select} />
        {del.isError && <ErrorMessage className="mt-3" message={getErrorMessage(del.error)} />}
      </Dialog>
    </div>
  )
}

function SecurityTab() {
  return (
    <Card className="max-w-2xl">
      <h2 className="text-lg font-semibold">Password</h2>
      <p className="mt-1 text-sm text-muted">To change your password, request a reset link. It is short-lived and single-use.</p>
      <Link to="/forgot-password" className="mt-4 inline-block font-medium text-secondary hover:underline">
        Send a password reset link
      </Link>
    </Card>
  )
}

export function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Profile')
  return (
    <>
      <PageHeader title="Settings" subtitle="Manage your account and preferences." />
      <div role="tablist" aria-label="Settings sections" className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={cn('rounded-full px-5 py-2 text-sm font-medium transition', tab === t ? 'bg-primary text-white' : 'border border-line-strong text-muted hover:text-ink')}>
            {t}
          </button>
        ))}
      </div>
      {tab === 'Profile' && <ProfileTab />}
      {tab === 'Preferences' && <PreferencesTab />}
      {tab === 'Privacy & Data' && <PrivacyTab />}
      {tab === 'Security' && <SecurityTab />}
    </>
  )
}
