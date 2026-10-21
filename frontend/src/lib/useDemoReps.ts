import { useEffect, useState } from 'react'

/**
 * Ticks a demo rep counter on the marketing page. This is decorative (the photo is static) and is
 * always labelled as a demo; real counting lives in lib/workout/engine.ts.
 */
export function useDemoReps({ target = 15, everyMs = 3600, start = 0 }: { target?: number; everyMs?: number; start?: number } = {}) {
  const [reps, setReps] = useState(start)
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => setReps((r) => (r >= target ? 0 : r + 1)), everyMs)
    return () => window.clearInterval(id)
  }, [target, everyMs])
  return { reps, target }
}
