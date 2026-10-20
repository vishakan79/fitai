import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from './validation'

const valid = {
  displayName: 'Asha',
  email: 'asha@example.com',
  password: 'Str0ngPassword',
  confirmPassword: 'Str0ngPassword',
  adultConfirmed: true,
  termsAccepted: true,
}

describe('validation', () => {
  it('accepts a valid registration', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true)
  })
  it('rejects weak or mismatched passwords', () => {
    expect(registerSchema.safeParse({ ...valid, password: 'short', confirmPassword: 'short' }).success).toBe(false)
    expect(registerSchema.safeParse({ ...valid, confirmPassword: 'Different1234' }).success).toBe(false)
  })
  it('requires adult confirmation and terms', () => {
    expect(registerSchema.safeParse({ ...valid, adultConfirmed: false }).success).toBe(false)
    expect(registerSchema.safeParse({ ...valid, termsAccepted: false }).success).toBe(false)
  })
  it('rejects an invalid login email', () => {
    expect(loginSchema.safeParse({ email: 'nope', password: 'x' }).success).toBe(false)
  })
})
