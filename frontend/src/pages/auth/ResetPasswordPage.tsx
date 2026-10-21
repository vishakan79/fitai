import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, ErrorMessage, PasswordInput, useToast } from '@/components/ui'
import { api, getErrorMessage } from '@/lib/api'
import { resetPasswordSchema, type ResetPasswordValues } from '@/lib/validation'
import { AuthShell } from './AuthShell'

export function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const navigate = useNavigate()
  const toast = useToast()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema) })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await api.post('/auth/reset-password', { token, password: values.password })
      toast.success('Password updated. Please sign in.')
      navigate('/login')
    } catch (e) {
      setFormError(getErrorMessage(e, 'This reset link is invalid or has expired. Request a new one.'))
    }
  })

  if (!token) {
    return (
      <AuthShell title="Reset link missing">
        <p className="text-sm text-muted">This link is incomplete. Request a new password reset email.</p>
        <Link to="/forgot-password" className="mt-4 inline-block font-medium text-secondary hover:underline">
          Request a new link
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Choose a new password">
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {formError && <ErrorMessage message={formError} />}
        <PasswordInput
          label="New password"
          autoComplete="new-password"
          hint="At least 10 characters with upper case, lower case and a number."
          error={errors.password?.message}
          {...register('password')}
        />
        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Update password
        </Button>
      </form>
    </AuthShell>
  )
}
