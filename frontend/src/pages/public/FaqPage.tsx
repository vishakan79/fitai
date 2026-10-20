import { FaqList, Section } from '@/components/marketing/Sections'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export function FaqPage() {
  useDocumentTitle('FAQ – FitAI')
  return (
    <Section eyebrow="FAQ" title="Frequently asked questions">
      <FaqList />
    </Section>
  )
}
