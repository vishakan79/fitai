import { useEffect, useRef, useState } from 'react'

const FRAME_MS = 1000 / 30 // throttle redraws to ~30fps

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
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

/**
 * Drives the landing-page demo animation. `cycle` is 0..1 through one repetition and `reps`
 * counts completed cycles (wrapping at `target`). `offset` shifts the phase so two figures
 * on the page do not move in lockstep.
 */
export function useSquatCycle({
  repSeconds = 3.6,
  target = 15,
  offset = 0,
  paused = false,
}: { repSeconds?: number; target?: number; offset?: number; paused?: boolean } = {}) {
  const reduced = usePrefersReducedMotion()
  const [state, setState] = useState({ cycle: reduced ? 0.5 : offset % 1, reps: 0 })
  const lastRep = useRef(0)

  useEffect(() => {
    if (reduced || paused) return
    let raf = 0
    let last = 0
    const start = performance.now()
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (now - last < FRAME_MS) return
      last = now
      const elapsed = (now - start) / 1000 / repSeconds + offset
      const completed = Math.floor(elapsed - offset)
      if (completed !== lastRep.current) lastRep.current = completed
      setState({ cycle: elapsed % 1, reps: lastRep.current % (target + 1) })
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [reduced, paused, repSeconds, target, offset])

  return { ...state, reduced, target }
}
