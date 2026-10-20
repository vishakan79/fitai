import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, ErrorMessage, Input } from '@/components/ui'
import { api, getErrorMessage } from '@/lib/api'
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/lib/validation'
import { AuthShell } from './AuthShell'

export function ForgotPasswordPage() {
  const [formError, setFormError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema) })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await api.post('/auth/forgot-password', values)
      setDone(true)
    } catch (e) {
      setFormError(getErrorMessage(e))
    }
  })

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we will send a reset link if an account exists."
      footer={
        <Link to="/login" className="font-medium text-secondary hover:underline">
          Back to sign in
        </Link>
      }
    >
      {done ? (
        <p role="status" className="text-sm text-muted">
          If an account exists for that email, a reset link is on its way. The link expires shortly and can be used
          once.
        </p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          {formError && <ErrorMessage message={formError} />}
          <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
          <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthShell>
  )
}
