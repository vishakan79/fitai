import { describe, expect, it } from 'vitest'
import {
  ADJUST_CAMERA,
  LM,
  RepCounter,
  angle3,
  createCounter,
  measure,
  type Landmark,
} from './engine'

/** Build a 33-landmark array, all invisible unless set. */
function blank(): Landmark[] {
  return Array.from({ length: 33 }, () => ({ x: 0, y: 0, visibility: 0 }))
}

/** Side-on squat landmarks with the knee flexed to `kneeDeg` (hip/knee/ankle on the left side). */
function squatPose(kneeDeg: number): Landmark[] {
  const lm = blank()
  const ankle = { x: 0.5, y: 0.9 }
  const knee = { x: 0.5, y: 0.7 } // shin straight up
  const rad = (kneeDeg * Math.PI) / 180
  // thigh direction rotated by the interior angle from the (knee->ankle) direction
  const dx = 0
  const dy = 1 // knee -> ankle points down
  const hx = knee.x + 0.2 * (dx * Math.cos(rad) - dy * Math.sin(rad)) * -1
  const hy = knee.y + 0.2 * (dx * Math.sin(rad) + dy * Math.cos(rad))
  lm[LM.lAnkle] = { ...ankle, visibility: 0.99 }
  lm[LM.lKnee] = { ...knee, visibility: 0.99 }
  lm[LM.lHip] = { x: hx, y: hy, visibility: 0.99 }
  lm[LM.lShoulder] = { x: hx, y: hy - 0.25, visibility: 0.99 }
  return lm
}

function run(counter: RepCounter, angles: number[], stepMs = 100, start = 0) {
  let t = start
  let last = counter.update(null, t)
  for (const a of angles) {
    t += stepMs
    last = counter.update(a, t)
  }
  return { last, t }
}

const ramp = (from: number, to: number, n: number) =>
  Array.from({ length: n }, (_, i) => from + ((to - from) * (i + 1)) / n)

describe('angle3', () => {
  it('measures a right angle and a straight line', () => {
    expect(angle3({ x: 0, y: 1 }, { x: 0, y: 0 }, { x: 1, y: 0 })).toBeCloseTo(90, 5)
    expect(angle3({ x: -1, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 0 })).toBeCloseTo(180, 5)
  })
  it('returns 180 for degenerate input instead of NaN', () => {
    expect(angle3({ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 1, y: 1 })).toBe(180)
  })
})

describe('RepCounter', () => {
  const cfg = { down: 100, up: 160 }

  it('counts one rep for one full down-and-up cycle', () => {
    const c = new RepCounter(cfg)
    const cycle = [...ramp(175, 80, 10), ...ramp(80, 175, 10)]
    const { last } = run(c, cycle)
    expect(c.reps).toBe(1)
    expect(last.phase).toBe('up')
  })

  it('does not count a half rep that never reaches depth', () => {
    const c = new RepCounter(cfg)
    run(c, [...ramp(175, 120, 10), ...ramp(120, 175, 10)])
    expect(c.reps).toBe(0)
  })

  it('does not count when the person goes down but never comes back up', () => {
    const c = new RepCounter(cfg)
    run(c, ramp(175, 80, 15))
    expect(c.reps).toBe(0)
    expect(c.phase).toBe('down')
  })

  it('does not double count jitter around a threshold (hysteresis)', () => {
    const c = new RepCounter(cfg)
    const down = ramp(175, 80, 8)
    const jitter = [98, 103, 97, 104, 96, 102, 95, 101] // wobbling around the down threshold
    const up = ramp(95, 175, 8)
    run(c, [...down, ...jitter, ...up])
    expect(c.reps).toBe(1)
  })

  it('ignores single-frame glitches (debounce)', () => {
    const c = new RepCounter(cfg)
    run(c, [175, 175, 60, 175, 175, 175])
    expect(c.reps).toBe(0)
  })

  it('does not count impossibly fast reps', () => {
    const c = new RepCounter({ ...cfg, minRepMs: 600 })
    run(c, [175, 80, 80, 175, 175], 50)
    expect(c.reps).toBe(0)
  })

  it('counts several consecutive reps', () => {
    const c = new RepCounter(cfg)
    const rep = [...ramp(175, 80, 8), ...ramp(80, 175, 8)]
    run(c, [...rep, ...rep, ...rep])
    expect(c.reps).toBe(3)
  })

  it('ignores frames with missing landmarks without breaking state', () => {
    const c = new RepCounter(cfg)
    const { t } = run(c, ramp(175, 80, 8))
    for (let i = 0; i < 10; i++) c.update(null, t + i * 100)
    expect(c.phase).toBe('down')
    run(c, ramp(80, 175, 8), 100, t + 2000)
    expect(c.reps).toBe(1)
  })

  it('flags a quick (but valid) rep with a slow-down hint, and not a controlled one', () => {
    const hints = (angles: number[]) => {
      const c = new RepCounter({ ...cfg, minRepMs: 300, slowDownMs: 1200 })
      const seen: Array<string | undefined> = []
      let t = 0
      c.update(null, t)
      for (const a of angles) {
        t += 100
        const u = c.update(a, t)
        if (u.repCompleted) seen.push(u.repHint)
      }
      return { reps: c.reps, seen }
    }
    // down confirmed at 300ms, up confirmed at 800ms -> 500ms rep
    expect(hints([175, 80, 80, 80, 80, 80, 175, 175])).toEqual({ reps: 1, seen: ['Slow down your movement'] })
    // ~2s rep -> controlled, no hint
    const slow = [175, ...Array(20).fill(80), 175, 175]
    expect(hints(slow)).toEqual({ reps: 1, seen: [undefined] })
  })

  it('rejects inverted thresholds', () => {
    expect(() => new RepCounter({ down: 160, up: 100 })).toThrow()
  })
})

describe('measure', () => {
  it('asks to adjust the camera when landmarks are missing', () => {
    const m = measure('squat', blank())
    expect(m.reliable).toBe(false)
    expect(m.angle).toBeNull()
    expect(m.hints).toContain(ADJUST_CAMERA)
  })

  it('asks to adjust the camera for an empty landmark list', () => {
    expect(measure('squat', []).reliable).toBe(false)
  })

  it('measures standing and deep squat knee angles', () => {
    const standing = measure('squat', squatPose(178))
    const deep = measure('squat', squatPose(70))
    expect(standing.reliable).toBe(true)
    expect(standing.angle!).toBeGreaterThan(165)
    expect(deep.angle!).toBeLessThan(80)
  })

  it('drives a full squat through the counter', () => {
    const c = createCounter('squat')
    const angles = [...ramp(178, 70, 10), ...ramp(70, 178, 10)]
    let t = 0
    for (const a of angles) {
      t += 100
      c.update(measure('squat', squatPose(a)).angle, t)
    }
    expect(c.reps).toBe(1)
  })

  it('picks the more visible leg for squats', () => {
    const lm = squatPose(120)
    const right = measure('squat', lm)
    expect(right.side).toBe('left')
  })

  it('lunge uses the more bent (front) knee and reports its side', () => {
    const lm = blank()
    const set = (h: number, k: number, a: number, hp: [number, number], kn: [number, number], an: [number, number]) => {
      lm[h] = { x: hp[0], y: hp[1], visibility: 1 }
      lm[k] = { x: kn[0], y: kn[1], visibility: 1 }
      lm[a] = { x: an[0], y: an[1], visibility: 1 }
    }
    // left leg straight, right leg bent at 90 degrees
    set(LM.lHip, LM.lKnee, LM.lAnkle, [0.5, 0.4], [0.5, 0.6], [0.5, 0.8])
    set(LM.rHip, LM.rKnee, LM.rAnkle, [0.5, 0.4], [0.7, 0.4], [0.7, 0.6])
    const m = measure('lunge', lm)
    expect(m.side).toBe('right')
    expect(m.angle!).toBeCloseTo(90, 0)
  })

  it('push-up warns when the body line sags', () => {
    const lm = blank()
    const p = (i: number, x: number, y: number) => (lm[i] = { x, y, visibility: 1 })
    p(LM.lShoulder, 0.2, 0.5)
    p(LM.lElbow, 0.2, 0.7)
    p(LM.lWrist, 0.2, 0.9)
    p(LM.lHip, 0.5, 0.75) // sagging below the shoulder-ankle line
    p(LM.lAnkle, 0.8, 0.5)
    const m = measure('pushup', lm)
    expect(m.reliable).toBe(true)
    expect(m.hints).toContain('Keep your body in a straight line')
  })
})
