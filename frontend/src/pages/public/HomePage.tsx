import { lazy, Suspense } from 'react'
import { ArrowRight, Check, Play, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge, LinkButton } from '@/components/ui'
import { PoseDemo } from '@/components/marketing/PoseDemo'
import {
  CtaBand,
  ExerciseCards,
  FaqList,
  FeatureStrip,
  GoalPicker,
  PricingCards,
  PricingNote,
  Section,
  StepList,
} from '@/components/marketing/Sections'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

// Recharts is heavy, so it loads only when the home page renders.
const DashboardPreview = lazy(() =>
  import('@/components/marketing/DashboardPreview').then((m) => ({ default: m.DashboardPreview })),
)

export function HomePage() {
  useDocumentTitle('FitAI – Your Personal Fitness Coach, Powered by AI')
  return (
    <>
      <div className="bg-hero-glow">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:px-8 lg:pb-16 lg:pt-20">
          <div>
            <Badge tone="primary" className="px-4 py-2 text-sm">
              <Sparkles className="size-4" aria-hidden="true" /> AI Personal Trainer
            </Badge>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Your Personal Fitness Coach, <span className="text-gradient">Powered by AI</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Use your phone or laptop camera to count reps and get real-time posture guidance, plus personalised
              workout plans and an AI assistant, anytime, anywhere.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <LinkButton to="/register" size="lg">
                Start Free Workout <ArrowRight className="size-5" aria-hidden="true" />
              </LinkButton>
              <LinkButton to="/features" variant="secondary" size="lg">
                <Play className="size-4" aria-hidden="true" /> Explore Features
              </LinkButton>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {['Free to start', 'No credit card', 'Video never leaves your device'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="size-4 text-success" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="mx-auto w-full max-w-md lg:max-w-none">
            <PoseDemo className="animate-float" />
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <FeatureStrip />
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
        <div className="surface flex flex-col justify-center p-8 sm:p-10">
          <Badge tone="primary" className="self-start">
            See It In Action
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Your AI Trainer in Real-Time</h2>
          <p className="mt-4 max-w-lg leading-relaxed text-muted">
            Just do your exercise. FitAI follows your body landmarks, counts valid repetitions and shows short,
            general hints. If it cannot see you clearly, it will ask you to adjust the camera instead of guessing.
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-line bg-navy-800 p-4 text-sm text-muted">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
            Feedback is general exercise guidance, not medical advice or an injury assessment.
          </div>
          <LinkButton to="/how-it-works" className="mt-6 self-start">
            See how it works <ArrowRight className="size-4" aria-hidden="true" />
          </LinkButton>
        </div>
        <GoalPicker />
      </section>

      <Section
        eyebrow="How it works"
        title="From camera to progress in five steps"
        intro="No wearables or special equipment, just a device with a camera."
      >
        <StepList />
      </Section>

      <Section
        eyebrow="Supported exercises"
        title="Camera tracking for the fundamentals"
        intro="We start with three exercises and test each one before adding more."
      >
        <ExerciseCards />
      </Section>

      <Section
        eyebrow="Progress"
        title="See your consistency build"
        intro="Sessions, sets, reps and time, all from your own saved workouts."
      >
        <div className="mx-auto max-w-4xl">
          <Suspense fallback={<div className="surface h-96" aria-hidden="true" />}>
            <DashboardPreview />
          </Suspense>
        </div>
      </Section>

      <Section id="pricing" eyebrow="Pricing" title="Start free, upgrade when you need more">
        <PricingCards />
        <PricingNote />
      </Section>

      <Section eyebrow="FAQ" title="Questions, answered">
        <FaqList limit={4} />
      </Section>

      <CtaBand />
    </>
  )
}
