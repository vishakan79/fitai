import axios, { AxiosError } from 'axios'

/**
 * Shared Axios instance for the Spring Boot API.
 *
 * Token strategy (implemented in Phase 2):
 *  - short-lived access token kept in memory only (never localStorage)
 *  - refresh token in an HttpOnly, SameSite cookie, which is why `withCredentials` is on
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  withCredentials: true,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

/** Shape of the error body the backend returns (consistent API conventions). */
export interface ApiErrorBody {
  status?: number
  code?: string
  message?: string
  fieldErrors?: Record<string, string>
}

/** Turns any thrown value into a message that is safe and useful to show a person. */
export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<ApiErrorBody>
    if (err.code === 'ECONNABORTED') return 'The request took too long. Please try again.'
    if (!err.response) return 'Cannot reach the server. Check your connection and try again.'
    if (err.response.status === 429) return 'Too many requests. Please wait a moment and try again.'
    if (err.response.status >= 500 || err.response.status === 404 || err.response.status === 405) {
      return err.response.data?.message ?? "The FitAI server isn't available yet, so this action couldn't be completed. Nothing was saved."
    }
    return err.response.data?.message ?? fallback
  }
  return error instanceof Error && error.message ? error.message : fallback
}

/** Field-level validation errors from the backend, if present. */
export function getFieldErrors(error: unknown): Record<string, string> {
  if (axios.isAxiosError(error)) {
    return (error as AxiosError<ApiErrorBody>).response?.data?.fieldErrors ?? {}
  }
  return {}
}
