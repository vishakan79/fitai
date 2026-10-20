import { lazy, Suspense } from 'react'
import { ArrowRight, Check, Lightbulb, Play, ShieldCheck, Sparkles } from 'lucide-react'
import { Badge, LinkButton } from '@/components/ui'
import { AthleteScene } from '@/components/marketing/AthleteScene'
import {
  CtaBand,
  ExerciseCards,
  FaqList,
  FeatureStrip,
  FreeForeverCard,
  GoalPicker,
  PricingCards,
  PricingNote,
  Section,
  StepList,
} from '@/components/marketing/Sections'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { cn } from '@/lib/cn'

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
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <AthleteScene
              variant="female"
              className="aspect-[4/4.9] rounded-[2rem] border border-line-strong/70 shadow-[0_30px_80px_-30px_rgb(124_58_237/0.6)]"
              overlay={(s) => (
                <>
                  <div
                    className={cn(
                      'absolute left-4 top-5 flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur transition-colors sm:left-6',
                      s.perfect
                        ? 'border-success/70 bg-success/15 text-success-glow'
                        : 'border-line-strong bg-navy-900/70 text-muted',
                    )}
                  >
                    <span
                      className={cn(
                        'grid size-6 place-items-center rounded-full',
                        s.perfect ? 'bg-success text-navy-900' : 'bg-line-strong text-muted',
                      )}
                    >
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                    {s.perfect ? 'Perfect Form!' : 'Tracking…'}
                  </div>
                  <div className="absolute right-4 top-5 rounded-2xl border border-line-strong bg-navy-900/80 px-4 py-3 backdrop-blur sm:right-6">
                    <p className="text-sm font-semibold">Squat</p>
                    <p className="mt-0.5 text-xl font-bold tabular-nums">
                      <span className="text-success-glow">{s.reps}</span>
                      <span className="text-muted"> / {s.target} Reps</span>
                    </p>
                    <div className="mt-2 h-1.5 w-32 overflow-hidden rounded-full bg-line">
                      <div
                        className="h-full rounded-full bg-success transition-[width] duration-300"
                        style={{ width: `${(s.reps / s.target) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="absolute inset-x-4 bottom-5 flex items-center gap-3 rounded-2xl border border-secondary/40 bg-primary/25 px-4 py-3 backdrop-blur sm:inset-x-6">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/40 text-amber-200">
                      <Lightbulb className="size-5" aria-hidden="true" />
                    </span>
                    <p className="text-sm font-medium">{s.hint}</p>
                  </div>
                  <p className="absolute bottom-[5.4rem] right-4 rounded-full bg-navy-900/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-faint sm:right-6">
                    Demo animation
                  </p>
                  {/* viewfinder corners */}
                  <span className="pointer-events-none absolute bottom-24 left-6 h-8 w-8 rounded-bl-lg border-b-2 border-l-2 border-secondary/70" />
                  <span className="pointer-events-none absolute bottom-24 right-6 h-8 w-8 rounded-br-lg border-b-2 border-r-2 border-secondary/70" />
                </>
              )}
            />
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
          <FeatureStrip />
        </div>
      </div>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.55fr_1fr] lg:px-8">
        <div className="surface grid overflow-hidden lg:grid-cols-[0.9fr_1.1fr]">
          <div className="flex flex-col justify-center p-8 sm:p-10">
            <Badge tone="primary" className="self-start">
              See It In Action
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Your AI Trainer in Real-Time</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Just do your exercise. FitAI follows your body landmarks, counts valid repetitions and shows short,
              general hints. If it cannot see you clearly, it will ask you to adjust the camera instead of guessing.
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-line bg-navy-800 p-4 text-sm text-muted">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
              General exercise guidance, not medical advice or an injury assessment.
            </div>
            <LinkButton to="/register" className="mt-6 self-start">
              Try Free Demo <ArrowRight className="size-4" aria-hidden="true" />
            </LinkButton>
          </div>
          <AthleteScene
            variant="male"
            offset={0.4}
            className="min-h-[22rem] border-t border-line lg:border-l lg:border-t-0"
            overlay={(s) => (
              <div className="absolute right-3 top-3 w-44 rounded-2xl border border-success/40 bg-navy-900/85 p-3 backdrop-blur sm:right-4 sm:top-4 sm:w-48">
                <p className="text-sm font-semibold">Squat</p>
                <p className="text-xl font-bold tabular-nums">
                  <span className="text-success-glow">{s.reps}</span>
                  <span className="text-muted"> / {s.target}</span>
                </p>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
                  <div
                    className="h-full rounded-full bg-success transition-[width] duration-300"
                    style={{ width: `${(s.reps / s.target) * 100}%` }}
                  />
                </div>
                <ul className="mt-3 space-y-1.5 text-xs font-medium">
                  {[
                    ['Good Posture', s.postureOk],
                    ['Knees Aligned', s.kneesOk],
                    [s.atDepth ? 'Depth Reached' : 'Go Deeper', s.atDepth],
                  ].map(([label, ok]) => (
                    <li
                      key={label as string}
                      className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-1.5"
                    >
                      {label as string}
                      <Check
                        className={cn('size-4', ok ? 'text-success-glow' : 'text-line-strong')}
                        aria-label={ok ? 'OK' : 'Not yet'}
                      />
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-faint">Demo animation</p>
              </div>
            )}
          />
        </div>
        <div className="grid content-start gap-6">
          <GoalPicker />
          <FreeForeverCard />
        </div>
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
