import { LinkButton } from '@/components/ui'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found – FitAI')
  return (
    <section className="mx-auto max-w-xl px-4 py-28 text-center">
      <p className="text-sm font-semibold text-secondary">404</p>
      <h1 className="mt-3 text-4xl font-bold">Page not found</h1>
      <p className="mt-4 text-muted">The page you are looking for does not exist or has moved.</p>
      <LinkButton to="/" className="mt-8">
        Back to home
      </LinkButton>
    </section>
  )
}
