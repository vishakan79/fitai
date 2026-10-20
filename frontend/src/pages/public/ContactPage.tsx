import { Mail } from 'lucide-react'
import { Card } from '@/components/ui'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export function ContactPage() {
  useDocumentTitle('Contact – FitAI')
  return (
    <section className="mx-auto max-w-xl px-4 py-20 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">Contact</h1>
      <p className="mt-3 text-muted">Questions, feedback or a safety concern? We would like to hear from you.</p>
      <Card className="mt-8 flex items-start gap-4">
        <Mail className="mt-0.5 size-5 text-secondary" aria-hidden="true" />
        <div>
          <p className="font-medium">Support email</p>
          <p className="mt-1 text-sm text-muted">
            Not configured yet. A support address will be set before launch (see <code>VITE_SUPPORT_EMAIL</code>).
          </p>
          {import.meta.env.VITE_SUPPORT_EMAIL && (
            <a className="mt-2 inline-block text-secondary hover:underline" href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`}>
              {import.meta.env.VITE_SUPPORT_EMAIL}
            </a>
          )}
        </div>
      </Card>
    </section>
  )
}
