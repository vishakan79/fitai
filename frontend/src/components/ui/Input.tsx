import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/cn'

const fieldBase =
  'w-full rounded-xl border bg-navy-800 px-4 text-sm text-ink placeholder:text-faint transition ' +
  'focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30 disabled:opacity-60'

interface FieldShellProps {
  id: string
  label: string
  hint?: ReactNode
  error?: string
  children: ReactNode
}

/** Label + control + hint/error wiring so every field is announced correctly by screen readers. */
function FieldShell({ id, label, hint, error, children }: FieldShellProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: ReactNode
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, id, className, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error}>
      <input
        ref={ref}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(fieldBase, 'h-12', error ? 'border-danger' : 'border-line-strong', className)}
        {...rest}
      />
    </FieldShell>
  )
})

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hint?: ReactNode
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, error, id, className, rows = 4, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error}>
      <textarea
        ref={ref}
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
        className={cn(fieldBase, 'py-3', error ? 'border-danger' : 'border-line-strong', className)}
        {...rest}
      />
    </FieldShell>
  )
})

/** Password field with a show/hide toggle (keyboard accessible, announced to screen readers). */
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>(function PasswordInput(
  { label, hint, error, id, className, ...rest },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const [shown, setShown] = useState(false)
  return (
    <FieldShell id={fieldId} label={label} hint={hint} error={error}>
      <div className="relative">
        <input
          ref={ref}
          id={fieldId}
          type={shown ? 'text' : 'password'}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={cn(fieldBase, 'h-12 pr-12', error ? 'border-danger' : 'border-line-strong', className)}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShown((v) => !v)}
          aria-label={shown ? 'Hide password' : 'Show password'}
          aria-pressed={shown}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted hover:text-ink"
        >
          {shown ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
        </button>
      </div>
    </FieldShell>
  )
})
