/**
 * Deterministic, exercise-specific rep counting and form hints built on MediaPipe pose landmarks.
 * Pure functions + one small state machine, so everything here is unit-testable without a camera.
 *
 * The hints are GENERAL exercise guidance from a single 2D camera view. They are not an injury
 * assessment, and they are only produced when the landmarks involved are reliably visible.
 */

export interface Landmark {
  x: number
  y: number
  z?: number
  visibility?: number
}

export type ExerciseKey = 'squat' | 'pushup' | 'lunge'

export const EXERCISES: Record<ExerciseKey, { label: string; down: number; up: number; cameraHint: string }> = {
  squat: { label: 'Squat', down: 100, up: 160, cameraHint: 'Stand side-on to the camera with your full body in frame.' },
  pushup: { label: 'Push-Up', down: 90, up: 155, cameraHint: 'Place the camera side-on, low to the floor, with your whole body in frame.' },
  lunge: { label: 'Lunge', down: 100, up: 155, cameraHint: 'Stand side-on or front-on with your full body in frame.' },
}

/** MediaPipe Pose landmark indices. */
export const LM = {
  lShoulder: 11,
  rShoulder: 12,
  lElbow: 13,
  rElbow: 14,
  lWrist: 15,
  rWrist: 16,
  lHip: 23,
  rHip: 24,
  lKnee: 25,
  rKnee: 26,
  lAnkle: 27,
  rAnkle: 28,
} as const

export const MIN_VISIBILITY = 0.5

/** Interior angle (degrees) at b formed by a-b-c. `aspect` (width/height) un-squashes normalised x. */
export function angle3(a: Landmark, b: Landmark, c: Landmark, aspect = 1): number {
  const v1x = (a.x - b.x) * aspect
  const v1y = a.y - b.y
  const v2x = (c.x - b.x) * aspect
  const v2y = c.y - b.y
  const mag = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y)
  if (mag === 0) return 180
  const cos = Math.min(1, Math.max(-1, (v1x * v2x + v1y * v2y) / mag))
  return (Math.acos(cos) * 180) / Math.PI
}

/** Angle of the segment a->b away from vertical, in degrees (0 = perfectly upright). */
export function tiltFromVertical(a: Landmark, b: Landmark, aspect = 1): number {
  const dx = (b.x - a.x) * aspect
  const dy = b.y - a.y
  return (Math.atan2(Math.abs(dx), Math.abs(dy)) * 180) / Math.PI
}

const vis = (l: Landmark | undefined) => (l?.visibility ?? 0)
const ok = (...ls: Array<Landmark | undefined>) => ls.every((l) => l !== undefined && vis(l) >= MIN_VISIBILITY)

export interface Measurement {
  /** Primary joint angle driving the rep counter, or null when landmarks are not reliable. */
  angle: number | null
  reliable: boolean
  /** Which side is being measured (lunge: the working/front leg). */
  side?: 'left' | 'right'
  /** General form hints that apply right now. */
  hints: string[]
}

export const ADJUST_CAMERA = 'Adjust your camera position'

const UNRELIABLE: Measurement = { angle: null, reliable: false, hints: [ADJUST_CAMERA] }

function legAngle(lm: Landmark[], side: 'left' | 'right', aspect: number): number | null {
  const [h, k, a] = side === 'left' ? [LM.lHip, LM.lKnee, LM.lAnkle] : [LM.rHip, LM.rKnee, LM.rAnkle]
  return ok(lm[h], lm[k], lm[a]) ? angle3(lm[h], lm[k], lm[a], aspect) : null
}

function meanVis(lm: Landmark[], idx: number[]) {
  return idx.reduce((s, i) => s + vis(lm[i]), 0) / idx.length
}

export function measureSquat(lm: Landmark[], aspect = 1): Measurement {
  const left = meanVis(lm, [LM.lHip, LM.lKnee, LM.lAnkle])
  const right = meanVis(lm, [LM.rHip, LM.rKnee, LM.rAnkle])
  const side = left >= right ? 'left' : 'right'
  const angle = legAngle(lm, side, aspect)
  if (angle === null) return UNRELIABLE

  const hints: string[] = []
  const [sh, hp] = side === 'left' ? [LM.lShoulder, LM.lHip] : [LM.rShoulder, LM.rHip]
  if (ok(lm[sh], lm[hp]) && tiltFromVertical(lm[hp], lm[sh], aspect) > 55 && angle < 140) {
    hints.push('Keep your chest up and back straight')
  }
  return { angle, reliable: true, side, hints }
}

export function measurePushup(lm: Landmark[], aspect = 1): Measurement {
  const left = meanVis(lm, [LM.lShoulder, LM.lElbow, LM.lWrist])
  const right = meanVis(lm, [LM.rShoulder, LM.rElbow, LM.rWrist])
  const side = left >= right ? 'left' : 'right'
  const [s, e, w, h, a] =
    side === 'left'
      ? [LM.lShoulder, LM.lElbow, LM.lWrist, LM.lHip, LM.lAnkle]
      : [LM.rShoulder, LM.rElbow, LM.rWrist, LM.rHip, LM.rAnkle]
  if (!ok(lm[s], lm[e], lm[w])) return UNRELIABLE
  const angle = angle3(lm[s], lm[e], lm[w], aspect)

  const hints: string[] = []
  if (ok(lm[s], lm[h], lm[a]) && angle3(lm[s], lm[h], lm[a], aspect) < 150) {
    hints.push('Keep your body in a straight line')
  }
  return { angle, reliable: true, side, hints }
}

export function measureLunge(lm: Landmark[], aspect = 1): Measurement {
  const l = legAngle(lm, 'left', aspect)
  const r = legAngle(lm, 'right', aspect)
  if (l === null && r === null) return UNRELIABLE
  // The front (working) knee is the more bent one. If only one leg is visible, use it.
  const useLeft = r === null || (l !== null && l <= r)
  const angle = (useLeft ? l : r) as number
  return { angle, reliable: true, side: useLeft ? 'left' : 'right', hints: [] }
}

export function measure(exercise: ExerciseKey, lm: Landmark[], aspect = 1): Measurement {
  if (!lm || lm.length < 29) return UNRELIABLE
  if (exercise === 'squat') return measureSquat(lm, aspect)
  if (exercise === 'pushup') return measurePushup(lm, aspect)
  return measureLunge(lm, aspect)
}

// ---------------------------------------------------------------------------------------------
// Rep counter
// ---------------------------------------------------------------------------------------------

export type Phase = 'up' | 'down'

export interface RepCounterConfig {
  /** Angle at or below which the body counts as "down". */
  down: number
  /** Angle at or above which the body counts as back "up". */
  up: number
  /** Consecutive reliable frames required to confirm a phase change (debounce). */
  confirmFrames?: number
  /** Reps faster than this are not counted (prevents double counting from jitter). */
  minRepMs?: number
  /** Reps faster than this get a "slow down" hint. */
  slowDownMs?: number
}

export interface RepUpdate {
  reps: number
  phase: Phase
  /** True only on the frame a repetition was just completed. */
  repCompleted: boolean
  /** Hint about the repetition that just finished, if any. */
  repHint?: string
}

/**
 * Hysteresis state machine: a rep is counted only after a confirmed move down (angle <= down)
 * followed by a confirmed move back up (angle >= up). Angles between the two thresholds never
 * change phase, so noise around a single threshold cannot produce extra counts.
 */
export class RepCounter {
  reps = 0
  phase: Phase = 'up'
  private cfg: Required<RepCounterConfig>
  private pendingDown = 0
  private pendingUp = 0
  private downSince = 0
  private minAngle = 180
  private lastCountAt = -Infinity

  constructor(cfg: RepCounterConfig) {
    this.cfg = { confirmFrames: 2, minRepMs: 600, slowDownMs: 1200, ...cfg }
    if (this.cfg.down >= this.cfg.up) throw new Error('down threshold must be below up threshold')
  }

  reset() {
    this.reps = 0
    this.phase = 'up'
    this.pendingDown = 0
    this.pendingUp = 0
    this.minAngle = 180
    this.lastCountAt = -Infinity
  }

  /** Feed one frame. Pass `null` when landmarks are unreliable: the frame is ignored. */
  update(angle: number | null, tMs: number): RepUpdate {
    const result: RepUpdate = { reps: this.reps, phase: this.phase, repCompleted: false }
    if (angle === null) {
      this.pendingDown = 0
      this.pendingUp = 0
      return result
    }

    if (this.phase === 'up') {
      this.pendingDown = angle <= this.cfg.down ? this.pendingDown + 1 : 0
      if (this.pendingDown >= this.cfg.confirmFrames) {
        this.phase = 'down'
        this.downSince = tMs
        this.minAngle = angle
        this.pendingDown = 0
      }
    } else {
      this.minAngle = Math.min(this.minAngle, angle)
      this.pendingUp = angle >= this.cfg.up ? this.pendingUp + 1 : 0
      if (this.pendingUp >= this.cfg.confirmFrames) {
        this.phase = 'up'
        this.pendingUp = 0
        const duration = tMs - this.downSince
        if (duration >= this.cfg.minRepMs && tMs - this.lastCountAt >= this.cfg.minRepMs) {
          this.reps += 1
          this.lastCountAt = tMs
          result.repCompleted = true
          if (duration < this.cfg.slowDownMs) result.repHint = 'Slow down your movement'
        }
      }
    }
    result.reps = this.reps
    result.phase = this.phase
    return result
  }
}

export function createCounter(exercise: ExerciseKey): RepCounter {
  const { down, up } = EXERCISES[exercise]
  return new RepCounter({ down, up })
}
