import type { Pose, Point } from '@/lib/poseDemo'

export type AthleteVariant = 'female' | 'male'

interface Look {
  skin: string
  skinShade: string
  hair: string
  top: string
  topLight: string
  bottom: string
  bottomLight: string
  torsoW: number
  thighW: number
  shinW: number
  armW: number
  headR: number
  sleeves: boolean
  shorts: boolean
}

const LOOKS: Record<AthleteVariant, Look> = {
  female: {
    skin: '#e9b995',
    skinShade: '#cf9a76',
    hair: '#1e1424',
    top: '#6d4fe0',
    topLight: '#9b82f5',
    bottom: '#26365f',
    bottomLight: '#34f5b0',
    torsoW: 36,
    thighW: 31,
    shinW: 22,
    armW: 12,
    headR: 20,
    sleeves: false,
    shorts: false,
  },
  male: {
    skin: '#c58b62',
    skinShade: '#a86f4b',
    hair: '#14111a',
    top: '#3b4f85',
    topLight: '#5a72b3',
    bottom: '#2f3a63',
    bottomLight: '#4a5a92',
    torsoW: 46,
    thighW: 35,
    shinW: 25,
    armW: 15,
    headR: 21,
    sleeves: true,
    shorts: true,
  },
}

const mix = (a: Point, b: Point, t: number): Point => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })

function Limb({ a, b, w, color }: { a: Point; b: Point; w: number; color: string }) {
  return <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={color} strokeWidth={w} strokeLinecap="round" />
}

function Leg({ pose, look, far = false }: { pose: Pose; look: Look; far?: boolean }) {
  const { hip, knee, ankle } = pose
  const legColor = look.shorts ? look.skin : look.bottom
  const shade = far ? { filter: 'brightness(0.55)' } : undefined
  return (
    <g style={shade}>
      <Limb a={hip} b={knee} w={look.thighW} color={legColor} />
      <Limb a={knee} b={ankle} w={look.shinW} color={look.shorts ? look.skin : look.bottom} />
      <circle cx={knee.x} cy={knee.y} r={look.shinW / 2 + 2} fill={look.shorts ? look.skin : look.bottom} />
      {look.shorts && <Limb a={hip} b={mix(hip, knee, 0.55)} w={look.thighW + 5} color={look.bottom} />}
      {!look.shorts && <Limb a={mix(hip, knee, 0.1)} b={mix(hip, knee, 0.85)} w={3} color={look.bottomLight} />}
      {/* shoe */}
      <path
        d={`M${ankle.x - 11} ${ankle.y - 6} L${ankle.x + 8} ${ankle.y - 8} Q${ankle.x + 34} ${ankle.y - 5} ${ankle.x + 34} ${ankle.y + 7} L${ankle.x - 11} ${ankle.y + 7} Z`}
        fill="#f1f4fb"
      />
      <path
        d={`M${ankle.x - 11} ${ankle.y + 7} L${ankle.x + 34} ${ankle.y + 7}`}
        stroke="#7c3aed"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </g>
  )
}

/**
 * A stylised, illustrated athlete drawn from the same joint positions as the skeleton overlay.
 * Faces right (side view). This is artwork for the marketing page, not a rendering of a real user.
 */
export function AthleteFigure({ pose, variant, sway }: { pose: Pose; variant: AthleteVariant; sway: number }) {
  const look = LOOKS[variant]
  const { head, shoulder, elbow, wrist, hip } = pose
  const r = look.headR
  const upperArmColor = look.sleeves ? look.top : look.skin

  return (
    <g>
      {/* far leg sits behind the body for depth */}
      <g transform="translate(11 0)">
        <Leg pose={pose} look={look} far />
      </g>

      {/* neck */}
      <Limb a={{ x: head.x + 1, y: head.y + r - 6 }} b={{ x: shoulder.x + 2, y: shoulder.y - 6 }} w={13} color={look.skinShade} />

      {/* torso */}
      <Limb a={shoulder} b={hip} w={look.torsoW} color={look.top} />
      <Limb a={mix(shoulder, hip, 0.12)} b={mix(shoulder, hip, 0.9)} w={4} color={look.topLight} />
      {/* hips / waistband */}
      <circle cx={hip.x} cy={hip.y} r={look.thighW / 2 + 1} fill={look.bottom} />

      {/* near leg */}
      <Leg pose={pose} look={look} />

      {/* arms, hands clasped in front */}
      <Limb a={shoulder} b={elbow} w={look.armW + (look.sleeves ? 5 : 0)} color={upperArmColor} />
      <Limb a={elbow} b={wrist} w={look.armW} color={look.skin} />
      <circle cx={shoulder.x} cy={shoulder.y} r={look.armW / 2 + 3} fill={look.top} />
      <circle cx={wrist.x + 3} cy={wrist.y} r={look.armW / 2 + 2} fill={look.skin} />

      {/* hair behind the head */}
      {variant === 'female' ? (
        <path
          d={`M${head.x - 16} ${head.y - 8} C${head.x - 40 + sway} ${head.y - 16} ${head.x - 54 + sway * 1.6} ${head.y + 10} ${head.x - 46 + sway * 2.2} ${head.y + 38}`}
          stroke={look.hair}
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
      <ellipse cx={head.x - 3} cy={head.y - 2} rx={r + 1} ry={r + 2} fill={look.hair} />

      {/* face */}
      <circle cx={head.x + 3} cy={head.y + 2} r={r - 2} fill={look.skin} />
      <circle cx={head.x - 2} cy={head.y + 4} r="3.2" fill={look.skinShade} />
      <circle cx={head.x + 12} cy={head.y} r="1.8" fill="#2a1a16" />
      <path d={`M${head.x + 18} ${head.y + 4} l3 3 l-4 1`} fill="none" stroke={look.skinShade} strokeWidth="1.6" strokeLinecap="round" />
      {variant === 'male' && (
        <path
          d={`M${head.x - 2} ${head.y + 9} Q${head.x + 8} ${head.y + 26} ${head.x + 18} ${head.y + 10} Q${head.x + 9} ${head.y + 15} ${head.x - 2} ${head.y + 9} Z`}
          fill={look.hair}
          opacity="0.9"
        />
      )}
      {/* front hairline */}
      <path
        d={`M${head.x - 19} ${head.y + 2} C${head.x - 18} ${head.y - 22} ${head.x + 12} ${head.y - 24} ${head.x + 20} ${head.y - 6} C${head.x + 10} ${head.y - 12} ${head.x - 4} ${head.y - 9} ${head.x - 12} ${head.y + 3} Z`}
        fill={look.hair}
      />
    </g>
  )
}
