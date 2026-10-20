import { CtaBand, FeatureGrid, Section } from '@/components/marketing/Sections'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export function FeaturesPage() {
  useDocumentTitle('Features – FitAI')
  return (
    <>
      <Section
        eyebrow="Features"
        title="Everything you need to train at home"
        intro="Camera-based posture analysis, workout planning, repetition counting, progress tracking and an AI assistant, in one place."
      >
        <FeatureGrid />
      </Section>
      <CtaBand />
    </>
  )
}
