import type { ReactNode } from 'react'
import { useDocumentTitle } from '@/lib/useDocumentTitle'

function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  useDocumentTitle(`${title} – FitAI`)
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
      <p className="mt-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
        Draft for development. This text must be reviewed by a qualified legal professional before launch.
      </p>
      <div className="mt-8 space-y-6 leading-relaxed text-muted [&_h2]:mb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-ink">
        {children}
      </div>
    </article>
  )
}

export function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <section>
        <h2>Camera and video</h2>
        <p>
          Pose estimation runs in your browser. Raw camera video is not uploaded or stored by default. We request
          camera access only when you start a camera workout, and you can revoke it in your browser at any time.
        </p>
      </section>
      <section>
        <h2>What we collect</h2>
        <p>
          Account details (email, display name), the profile answers you choose to provide, and the workout sessions
          you save (exercise, sets, repetitions, duration and timestamps). We collect only what the features need.
        </p>
      </section>
      <section>
        <h2>AI features</h2>
        <p>
          Chat messages and the minimum profile or workout context needed to answer are sent to our AI provider to
          generate responses. We do not send passwords or payment details.
        </p>
      </section>
      <section>
        <h2>Your controls</h2>
        <p>You can export your data and delete your account from Settings once signed in.</p>
      </section>
    </LegalPage>
  )
}

export function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <section>
        <h2>General exercise guidance</h2>
        <p>
          FitAI provides general exercise information and automated feedback. It is not medical advice, cannot
          diagnose injuries and is not a substitute for a qualified fitness or healthcare professional. Stop exercising
          if you feel pain, dizziness or discomfort.
        </p>
      </section>
      <section>
        <h2>Eligibility</h2>
        <p>FitAI is intended for adults. You are responsible for exercising within your own limits.</p>
      </section>
      <section>
        <h2>No guaranteed results</h2>
        <p>We do not promise any specific fitness, weight or health outcome.</p>
      </section>
      <section>
        <h2>Plans and payments</h2>
        <p>Paid plans, prices and limits may change. Paid checkout is not yet available.</p>
      </section>
    </LegalPage>
  )
}
