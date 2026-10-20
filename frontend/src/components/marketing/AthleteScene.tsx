import { useId, useMemo, type ReactNode } from 'react'
import { BONES, jointAngle, poseAtDepth, squatDepth, type JointName } from '@/lib/poseDemo'
import { useSquatCycle } from '@/lib/useSquatCycle'
import { cn } from '@/lib/cn'
import { AthleteFigure, type AthleteVariant } from './AthleteFigure'

export interface SceneState {
  reps: number
  target: number
  kneeAngle: number
  atDepth: boolean
  postureOk: boolean
  kneesOk: boolean
  perfect: boolean
  hint: string
}

/**
 * Landing-page demo: an illustrated athlete squatting in a room with a live skeleton overlay.
 * The animation is hand-authored (NOT real pose-estimation output), but the numbers shown are
 * computed from the drawn joints with the same angle maths the live workout engine will use.
 */
export function AthleteScene({
  variant,
  offset = 0,
  className,
  overlay,
}: {
  variant: AthleteVariant
  offset?: number
  className?: string
  overlay?: (s: SceneState) => ReactNode
}) {
  const uid = useId().replace(/:/g, '')
  const { cycle, reps, reduced, target } = useSquatCycle({ offset })
  const depth = squatDepth(cycle)
  const pose = useMemo(() => poseAtDepth(depth), [depth])

  const kneeAngle = Math.round(jointAngle(pose.hip, pose.knee, pose.ankle))
  const torsoLean = Math.abs(
    (Math.atan2(pose.shoulder.x - pose.hip.x, pose.hip.y - pose.shoulder.y) * 180) / Math.PI,
  )
  const atDepth = kneeAngle <= 100
  const postureOk = torsoLean <= 40
  const kneesOk = pose.knee.x - pose.ankle.x <= 66
  const perfect = atDepth && postureOk && kneesOk
  const hint = !postureOk
    ? 'Keep your back straight'
    : atDepth
      ? 'Great depth, drive up through your heels'
      : depth > 0.15
        ? 'Keep your back straight'
        : 'Stand tall, brace your core'

  const state: SceneState = {
    reps: reduced ? 12 : reps,
    target,
    kneeAngle,
    atDepth,
    postureOk,
    kneesOk,
    perfect,
    hint,
  }
  const sway = Math.sin(cycle * Math.PI * 4) * 5 - depth * 6
  const stroke = atDepth ? '#34f5b0' : '#10b981'

  return (
    <div
      className={cn('relative isolate overflow-hidden', className)}
      role="img"
      aria-label={`Animated demonstration of a ${variant === 'female' ? 'woman' : 'man'} doing bodyweight squats with a pose-tracking skeleton overlay`}
    >
      <svg viewBox="55 -5 330 470" preserveAspectRatio="xMidYMax meet" className="absolute inset-0 size-full" aria-hidden="true">
        <defs>
          <linearGradient id={`wall-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#252f63" />
            <stop offset="0.7" stopColor="#121a3a" />
            <stop offset="1" stopColor="#0a0f20" />
          </linearGradient>
          <linearGradient id={`beam-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a78bfa" stopOpacity="0.28" />
            <stop offset="1" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
          <radialGradient id={`floor-${uid}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#7c3aed" stopOpacity="0.55" />
            <stop offset="1" stopColor="#7c3aed" stopOpacity="0" />
          </radialGradient>
          <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* room */}
        <rect x="-400" y="-200" width="1200" height="800" fill={`url(#wall-${uid})`} />
        <polygon points="-40,-20 150,-20 330,470 90,470" fill={`url(#beam-${uid})`} />
        <rect x="-400" y="436" width="1200" height="200" fill="#0b1126" />
        <rect x="-400" y="436" width="1200" height="2" fill="#2b3a5f" opacity="0.6" />
        <ellipse cx="225" cy="440" rx="190" ry="26" fill={`url(#floor-${uid})`} />

        {/* plant */}
        <g opacity="0.75">
          <rect x="342" y="396" width="34" height="40" rx="5" fill="#222b4c" />
          {[-38, -18, 0, 20, 40].map((r, i) => (
            <ellipse
              key={r}
              cx="359"
              cy="380"
              rx="9"
              ry={34 - (i % 2) * 8}
              fill={i % 2 ? '#134a3d' : '#0f3a31'}
              transform={`rotate(${r} 359 396)`}
            />
          ))}
        </g>
        {/* dumbbells */}
        <g opacity="0.8" fill="#2a3358">
          <rect x="68" y="418" width="46" height="6" rx="3" />
          <rect x="62" y="408" width="10" height="26" rx="3" />
          <rect x="110" y="408" width="10" height="26" rx="3" />
        </g>
        {/* mat */}
        <rect x="110" y="434" width="230" height="8" rx="4" fill="#3b2a78" opacity="0.8" />

        {/* athlete */}
        <g style={{ filter: 'drop-shadow(0 0 2.5px rgb(196 181 253 / 0.85))' }}>
          <AthleteFigure pose={pose} variant={variant} sway={sway} />
        </g>

        {/* skeleton overlay */}
        <g filter={`url(#glow-${uid})`} stroke={stroke} strokeWidth="3" strokeLinecap="round" opacity="0.95">
          {BONES.map(([a, b]) => (
            <line key={`${a}-${b}`} x1={pose[a].x} y1={pose[a].y} x2={pose[b].x} y2={pose[b].y} />
          ))}
        </g>
        {(Object.keys(pose) as JointName[])
          .filter((j) => j !== 'head')
          .map((j) => (
            <circle key={j} cx={pose[j].x} cy={pose[j].y} r="5" fill="#f8fafc" stroke={stroke} strokeWidth="2.5" />
          ))}
        <circle cx={pose.head.x} cy={pose.head.y} r="4" fill="#f8fafc" stroke={stroke} strokeWidth="2.5" />
        <text
          x={pose.knee.x + 20}
          y={pose.knee.y + 6}
          fill="#c4b5fd"
          fontSize="15"
          fontWeight="700"
          fontFamily="Inter Variable, sans-serif"
          style={{ paintOrder: 'stroke' }}
          stroke="#0b1126"
          strokeWidth="4"
        >
          {kneeAngle}°
        </text>
      </svg>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />
      {overlay?.(state)}
    </div>
  )
}
