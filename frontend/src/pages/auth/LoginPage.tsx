import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, ErrorMessage, Input } from '@/components/ui'
import { api, getErrorMessage } from '@/lib/api'
import { loginSchema, type LoginValues } from '@/lib/validation'
import { AuthShell } from './AuthShell'

export function LoginPage() {
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null)
    try {
      await api.post('/auth/login', values)
      // Session handling (in-memory access token + refresh cookie) arrives with the Phase 2 backend.
      navigate('/app/dashboard')
    } catch (e) {
      setFormError(getErrorMessage(e, 'Sign in failed. Check your email and password.'))
    }
  })

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue your training."
      footer={
        <>
          New to FitAI?{' '}
          <Link to="/register" className="font-medium text-secondary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} noValidate className="space-y-4">
        {formError && <ErrorMessage message={formError} />}
        <Input label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="text-right text-sm">
          <Link to="/forgot-password" className="text-secondary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthShell>
  )
}
