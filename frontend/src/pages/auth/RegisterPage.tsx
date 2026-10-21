import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck } from 'lucide-react'
import { Button, ErrorMessage, Input, PasswordInput } from '@/components/ui'
import { api, getErrorMessage, getFieldErrors } from '@/lib/api'
import { registerSchema, type RegisterValues } from '@/lib/validation'
import { AuthShell } from './AuthShell'

function Checkbox({
  label,
  error,
  ...rest
}: { label: React.ReactNode; error?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          aria-invalid={error ? true : undefined}
          className="mt-0.5 size-4 shrink-0 rounded border-line-strong bg-navy-800 accent-primary"
          {...rest}
        />
        <span>{label}</span>
      </label>
      {error && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export function RegisterPage() {
  const [params] = useSearchParams()
  const goal = params.get('goal') ?? undefined
  const [formError, setFormError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { adultConfirmed: false, termsAccepted: false },
  })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await api.post('/auth/register', {
        displayName: values.displayName,
        email: values.email,
        password: values.password,
        goal,
      })
      setSentTo(values.email)
    } catch (e) {
      for (const [field, message] of Object.entries(getFieldErrors(e))) {
        if (field in values) setError(field as keyof RegisterValues, { message })
      }
      setFormError(getErrorMessage(e, 'We could not create your account. Please try again.'))
    }
  })

  if (sentTo) {
    return (
      <AuthShell title="Check your email">
        <div className="flex items-start gap-3 text-sm text-muted">
          <MailCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
          <p>
            If <strong className="text-ink">{sentTo}</strong> can be registered, we have sent a verification link.
            Open it to activate your account, then sign in.
          </p>
        </div>
        <Link to="/login" className="mt-6 inline-block font-medium text-secondary hover:underline">
          Go to sign in
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Start your fitness journey today."
      photo="man"
      side={
        <>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Train smarter with <span className="text-gradient">FitAI</span>
          </h2>
          <p className="mt-3 text-muted">Real-time rep counting, personalised plans and progress tracking, free to start.</p>
        </>
      }
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-secondary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {formError && <ErrorMessage message={formError} />}
        <Input
          label="Full name"
          autoComplete="nickname"
          error={errors.displayName?.message}
          {...register('displayName')}
        />
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <PasswordInput
          label="Password"
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
        <Checkbox label="I am 18 years or older." error={errors.adultConfirmed?.message} {...register('adultConfirmed')} />
        <Checkbox
          label={
            <>
              I accept the{' '}
              <Link to="/terms" className="text-secondary hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-secondary hover:underline">
                Privacy Policy
              </Link>
              .
            </>
          }
          error={errors.termsAccepted?.message}
          {...register('termsAccepted')}
        />
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthShell>
  )
}
