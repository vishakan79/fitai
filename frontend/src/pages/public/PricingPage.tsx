import { FaqList, PricingCards, PricingNote, Section } from '@/components/marketing/Sections'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export function PricingPage() {
  useDocumentTitle('Pricing – FitAI')
  return (
    <>
      <Section
        eyebrow="Pricing"
        title="Simple plans, free to start"
        intro="Camera tracking and progress history are free. Paid plans raise AI usage limits."
      >
        <PricingCards />
        <PricingNote />
      </Section>
      <Section title="Common questions">
        <FaqList limit={4} />
      </Section>
    </>
  )
}
