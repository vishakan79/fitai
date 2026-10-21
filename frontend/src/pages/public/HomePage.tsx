import { lazy, Suspense } from 'react'
import { ArrowRight, Check, Play, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge, LinkButton } from '@/components/ui'
import { ActionPhoto, HeroPhoto } from '@/components/marketing/PhotoScenes'
import {
  CtaBand,
  ExerciseCards,
  FaqList,
  FeatureStrip,
  FreeForeverCard,
  GoalPicker,
  PricingCards,
  PricingNote,
  StepList,
} from '@/components/marketing/Sections'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

// Recharts is heavy, so it loads only when the home page renders.
const DashboardPreview = lazy(() =>
  import('@/components/marketing/DashboardPreview').then((m) => ({ default: m.DashboardPreview })),
)

function Heading({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-success">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">{title}</h2>
      </div>
      {aside && <p className="text-sm text-muted">{aside}</p>}
    </div>
  )
}

export function HomePage() {
  useDocumentTitle('FitAI – Your Personal Fitness Coach, Powered by AI')
  return (
    <>
      <div className="bg-hero-glow">
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-14 lg:pt-14">
          <div>
            <Badge tone="primary" className="px-4 py-2 text-sm">
              <Sparkles className="size-4" aria-hidden="true" /> AI Personal Trainer
            </Badge>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
              Your Personal Fitness Coach, <span className="text-gradient">Powered by AI</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Use your phone or laptop camera to get real-time form guidance, personalised workout plans and expert
              answers, anytime, anywhere.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <LinkButton to="/register" size="lg">
                Start Free Workout <ArrowRight className="size-5" aria-hidden="true" />
              </LinkButton>
              <a
                href="#demo"
                className="inline-flex h-14 items-center gap-3 rounded-full border border-line-strong bg-card/60 px-7 font-semibold transition hover:border-secondary/60 hover:bg-card-hover"
              >
                <span className="grid size-7 place-items-center rounded-full bg-white/10">
                  <Play className="size-3.5 fill-current" aria-hidden="true" />
                </span>
                Watch Demo
              </a>
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
          <HeroPhoto />
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
          <FeatureStrip />
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:px-8">
        <div>
          <Heading eyebrow="How it works" title="Get started in 4 simple steps" />
          <StepList />
        </div>
        <Suspense fallback={<div className="surface h-96" aria-hidden="true" />}>
          <DashboardPreview />
        </Suspense>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <Heading eyebrow="Supported exercises" title="Track your favourite exercises" aside="More exercises coming soon…" />
        <ExerciseCards />
      </section>

      <section id="demo" className="mx-auto grid max-w-7xl scroll-mt-24 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.55fr_1fr] lg:px-8">
        <div className="surface grid overflow-hidden lg:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <Badge tone="primary" className="self-start">
              See It In Action
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Your AI Trainer in Real-Time</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Just do your exercise. FitAI follows your body landmarks, counts valid repetitions and shows short
              general hints. If it cannot see you clearly, it asks you to adjust the camera instead of guessing.
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-line bg-navy-800 p-4 text-sm text-muted">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
              General exercise guidance, not medical advice or an injury assessment.
            </div>
            <LinkButton to="/app/workouts/live" className="mt-6 self-start">
              Try Free Demo <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
          </div>
          <ActionPhoto />
        </div>
        <div className="grid content-start gap-6">
          <GoalPicker />
          <FreeForeverCard />
        </div>
      </section>

      <section id="pricing" className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.5fr_1fr] lg:px-8">
        <div>
          <Heading eyebrow="Pricing" title="Simple and transparent pricing" />
          <PricingCards compact />
          <PricingNote />
        </div>
        <div>
          <Heading eyebrow="FAQ" title="Frequently asked questions" />
          <FaqList limit={5} />
        </div>
      </section>

      <CtaBand />
    </>
  )
}
