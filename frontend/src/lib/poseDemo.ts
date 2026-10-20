/**
 * Geometry for the landing-page squat demo (side view, SVG coordinates).
 * This is a hand-authored animation, NOT real pose-estimation output, but the
 * joint angle shown beside it is computed from the drawn joints with the same
 * three-point angle maths the live workout engine uses.
 */

export interface Point {
  x: number
  y: number
}

export type JointName =
  | 'head'
  | 'shoulder'
  | 'elbow'
  | 'wrist'
  | 'hip'
  | 'knee'
  | 'ankle'

export type Pose = Record<JointName, Point>

export const STANDING: Pose = {
  head: { x: 214, y: 62 },
  shoulder: { x: 212, y: 112 },
  elbow: { x: 236, y: 170 },
  wrist: { x: 258, y: 200 },
  hip: { x: 215, y: 238 },
  knee: { x: 222, y: 336 },
  ankle: { x: 220, y: 430 },
}

export const SQUAT: Pose = {
  head: { x: 232, y: 176 },
  shoulder: { x: 218, y: 222 },
  elbow: { x: 262, y: 262 },
  wrist: { x: 290, y: 238 },
  hip: { x: 168, y: 330 },
  knee: { x: 276, y: 346 },
  ankle: { x: 220, y: 430 },
}

export const BONES: ReadonlyArray<readonly [JointName, JointName]> = [
  ['head', 'shoulder'],
  ['shoulder', 'elbow'],
  ['elbow', 'wrist'],
  ['shoulder', 'hip'],
  ['hip', 'knee'],
  ['knee', 'ankle'],
]

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Smooth start/stop so the movement does not look mechanical. */
export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

export function blendPoses(from: Pose, to: Pose, t: number): Pose {
  const out = {} as Pose
  for (const key of Object.keys(from) as JointName[]) {
    out[key] = { x: lerp(from[key].x, to[key].x, t), y: lerp(from[key].y, to[key].y, t) }
  }
  return out
}

/**
 * Interior angle (degrees, 0-180) at joint `b` formed by points a-b-c.
 * 180 means the limb is straight; smaller means more bent.
 */
export function jointAngle(a: Point, b: Point, c: Point): number {
  const v1 = { x: a.x - b.x, y: a.y - b.y }
  const v2 = { x: c.x - b.x, y: c.y - b.y }
  const mag = Math.hypot(v1.x, v1.y) * Math.hypot(v2.x, v2.y)
  if (mag === 0) return 180
  const cos = Math.min(1, Math.max(-1, (v1.x * v2.x + v1.y * v2.y) / mag))
  return (Math.acos(cos) * 180) / Math.PI
}

/**
 * Position within one rep cycle -> 0 (standing) .. 1 (bottom) .. 0.
 * `cycle` is in [0, 1): first half descends, second half ascends.
 */
export function squatDepth(cycle: number): number {
  const c = ((cycle % 1) + 1) % 1
  return easeInOut(c < 0.5 ? c * 2 : (1 - c) * 2)
}
