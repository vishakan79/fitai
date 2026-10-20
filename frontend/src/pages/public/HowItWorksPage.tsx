import { CtaBand, ExerciseCards, Section, StepList } from '@/components/marketing/Sections'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

export function HowItWorksPage() {
  useDocumentTitle('How It Works – FitAI')
  return (
    <>
      <Section
        eyebrow="How it works"
        title="Camera permission to saved progress"
        intro="Pose estimation runs in your browser. Only the results you save are sent to our servers."
      >
        <StepList />
      </Section>
      <Section title="Tips for reliable tracking">
        <ul className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-3">
          {[
            ['Full body in frame', 'Place your device 2–3 metres away so head to feet is visible.'],
            ['Good lighting', 'Face a light source. Avoid strong backlight behind you.'],
            ['Fitted clothing', 'Clothing that shows your joints helps the model follow you.'],
          ].map(([t, b]) => (
            <li key={t} className="surface p-6">
              <h3 className="font-semibold">{t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{b}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section title="Supported exercises">
        <ExerciseCards />
      </Section>
      <CtaBand />
    </>
  )
}
