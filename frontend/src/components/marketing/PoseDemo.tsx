import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, Lightbulb } from 'lucide-react'
import {
  BONES,
  SQUAT,
  STANDING,
  blendPoses,
  jointAngle,
  squatDepth,
  type JointName,
} from '@/lib/poseDemo'
import { cn } from '@/lib/cn'

const REP_SECONDS = 3.6
const DEMO_TARGET = 15
const FRAME_MS = 1000 / 30 // throttle redraws to ~30fps

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  )
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/** Animated skeleton overlay showing how rep counting and form hints look during a workout. */
export function PoseDemo({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion()
  const [cycle, setCycle] = useState(reduced ? 0.5 : 0)
  const [reps, setReps] = useState(0)
  const lastRep = useRef(0)

  useEffect(() => {
    if (reduced) {
      setCycle(0.5)
      return
    }
    let raf = 0
    let last = 0
    const start = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - last < FRAME_MS) return
      last = now
      const elapsed = (now - start) / 1000 / REP_SECONDS
      setCycle(elapsed % 1)
      const completed = Math.floor(elapsed)
      if (completed !== lastRep.current) {
        lastRep.current = completed
        setReps(completed % (DEMO_TARGET + 1))
      }
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const depth = squatDepth(cycle)
  const pose = useMemo(() => blendPoses(STANDING, SQUAT, depth), [depth])
  const kneeAngle = Math.round(jointAngle(pose.hip, pose.knee, pose.ankle))

  const atDepth = kneeAngle <= 105
  const hint = atDepth ? 'Good depth' : depth > 0.15 ? 'Keep your back straight' : 'Stand tall, brace your core'
  const shownReps = reduced ? 12 : reps

  return (
    <div
      className={cn('relative aspect-[4/4.6] w-full overflow-hidden rounded-[1.75rem] border border-line', className)}
      role="img"
      aria-label="Animated demonstration of a pose-tracking skeleton following a bodyweight squat"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-card via-navy-800 to-navy-900" />
      <svg className="absolute inset-0 size-full opacity-40" aria-hidden="true">
        <defs>
          <pattern id="demo-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M32 0H0V32" fill="none" stroke="#1e2a47" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#demo-grid)" />
      </svg>

      <svg viewBox="60 20 320 460" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <ellipse cx="220" cy="440" rx="95" ry="9" fill="#7c3aed" opacity="0.3" />
        <g filter="url(#glow)" stroke={atDepth ? '#34f5b0' : '#10b981'} strokeWidth="5" strokeLinecap="round">
          {BONES.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={pose[a].x} y1={pose[a].y} x2={pose[b].x} y2={pose[b].y} />
          ))}
        </g>
        <circle cx={pose.head.x} cy={pose.head.y} r="22" fill="none" stroke="#10b981" strokeWidth="4" />
        {(Object.keys(pose) as JointName[])
          .filter((j) => j !== 'head')
          .map((j) => (
            <circle key={j} cx={pose[j].x} cy={pose[j].y} r="6" fill="#f8fafc" stroke="#10b981" strokeWidth="3" />
          ))}
        {/* Live knee angle, computed from the drawn joints. */}
        <text
          x={pose.knee.x + 16}
          y={pose.knee.y + 6}
          fill="#a78bfa"
          fontSize="16"
          fontWeight="700"
          fontFamily="Inter Variable, sans-serif"
        >
          {kneeAngle}°
        </text>
      </svg>

      <div className="absolute left-4 top-4 rounded-2xl border border-line-strong bg-navy-900/85 px-4 py-3 backdrop-blur">
        <p className="text-sm font-semibold text-ink">Squat</p>
        <p className="mt-0.5 text-2xl font-bold tabular-nums">
          <span className="text-success-glow">{shownReps}</span>
          <span className="text-muted"> / {DEMO_TARGET} Reps</span>
        </p>
        <div className="mt-2 h-1.5 w-36 overflow-hidden rounded-full bg-line">
          <div
            className="h-full rounded-full bg-success transition-[width] duration-300"
            style={{ width: `${(shownReps / DEMO_TARGET) * 100}%` }}
          />
        </div>
      </div>

      <div
        className={cn(
          'absolute right-4 top-4 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur',
          atDepth
            ? 'border-success/60 bg-success/15 text-success-glow'
            : 'border-line-strong bg-navy-900/80 text-muted',
        )}
      >
        <Check className="size-4" aria-hidden="true" />
        {atDepth ? 'Good depth' : 'Tracking…'}
      </div>

      <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border border-secondary/40 bg-primary/20 px-4 py-3 backdrop-blur">
        <Lightbulb className="size-5 shrink-0 text-secondary" aria-hidden="true" />
        <p className="text-sm font-medium text-ink" aria-live="off">
          {hint}
        </p>
      </div>

      <p className="absolute bottom-[4.75rem] right-4 rounded-full bg-navy-900/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-faint">
        Demo animation
      </p>
    </div>
  )
}
