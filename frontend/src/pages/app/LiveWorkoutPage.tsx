import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { AlertTriangle, ArrowLeft, Camera, Check, Minus, Pause, Play, Plus, Square, SkipForward, Video } from 'lucide-react'
import { Badge, Button, Card, ErrorMessage, Spinner } from '@/components/ui'
import { useDocumentTitle } from '@/lib/useDocumentTitle'
import { api, getErrorMessage } from '@/lib/api'
import { cn } from '@/lib/cn'
import { EXERCISES, createCounter, type ExerciseKey } from '@/lib/workout/engine'
import { useCameraTracking, type TrackingFrame } from '@/lib/workout/useCameraTracking'

type Stage = 'setup' | 'active' | 'paused' | 'rest' | 'done'
const REST_SECONDS = 45
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function LiveWorkoutPage() {
  useDocumentTitle('Live Workout – FitAI')
  const [params] = useSearchParams()
  const raw = params.get('exercise')
  const exercise: ExerciseKey = raw === 'pushup' || raw === 'lunge' ? raw : 'squat'
  const targetReps = clamp(Number(params.get('reps')) || 12, 1, 100)
  const totalSets = clamp(Number(params.get('sets')) || 3, 1, 10)
  const label = EXERCISES[exercise].label

  const [stage, setStage] = useState<Stage>('setup')
  const [mode, setMode] = useState<'camera' | 'manual'>('camera')
  const [reps, setReps] = useState(0)
  const [completedSets, setCompletedSets] = useState<number[]>([])
  const [elapsed, setElapsed] = useState(0)
  const [restLeft, setRestLeft] = useState(REST_SECONDS)
  const [live, setLive] = useState<{ reliable: boolean; hints: string[] }>({ reliable: false, hints: [] })
  const [repHint, setRepHint] = useState<string | null>(null)

  const stageRef = useRef<Stage>('setup')
  const counterRef = useRef(createCounter(exercise))
  const startedAtRef = useRef<string>('')
  const liveKey = useRef('')
  const setStageBoth = useCallback((s: Stage) => {
    stageRef.current = s
    setStage(s)
  }, [])

  const onFrame = useCallback((f: TrackingFrame) => {
    if (stageRef.current !== 'active') return
    const key = `${f.reliable}|${f.hints.join('|')}`
    if (key !== liveKey.current) {
      liveKey.current = key
      setLive({ reliable: f.reliable, hints: f.hints })
    }
    const u = counterRef.current.update(f.reliable ? f.angle : null, f.t)
    if (u.repHint) setRepHint(u.repHint)
    if (u.repCompleted) {
      setRepHint((h) => (u.repHint ? h : null))
      setReps((r) => r + 1)
    }
  }, [])

  const cam = useCameraTracking({ exercise, onFrame })

  // Move from "setup" to "active" once the camera and model are running.
  useEffect(() => {
    if (mode === 'camera' && stage === 'setup' && cam.status === 'running') {
      startedAtRef.current = new Date().toISOString()
      setStageBoth('active')
    }
  }, [cam.status, mode, stage, setStageBoth])

  // Workout clock: counts only while a set is active.
  useEffect(() => {
    if (stage !== 'active') return
    const id = window.setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => window.clearInterval(id)
  }, [stage])

  const finishWorkout = useCallback(
    (sets: number[]) => {
      setCompletedSets(sets)
      cam.stop()
      setStageBoth('done')
    },
    [cam, setStageBoth],
  )

  const finishSet = useCallback(() => {
    const sets = [...completedSets, reps]
    counterRef.current.reset()
    setReps(0)
    setRepHint(null)
    if (sets.length >= totalSets) {
      finishWorkout(sets)
    } else {
      setCompletedSets(sets)
      setRestLeft(REST_SECONDS)
      cam.setPaused(true)
      setStageBoth('rest')
    }
  }, [completedSets, reps, totalSets, finishWorkout, cam, setStageBoth])

  // Auto-complete the set when the target is reached.
  useEffect(() => {
    if (stage === 'active' && reps >= targetReps) finishSet()
  }, [reps, targetReps, stage, finishSet])

  // Rest countdown.
  useEffect(() => {
    if (stage !== 'rest') return
    const id = window.setInterval(() => setRestLeft((s) => s - 1), 1000)
    return () => window.clearInterval(id)
  }, [stage])
  const resumeFromRest = useCallback(() => {
    cam.setPaused(false)
    setStageBoth('active')
  }, [cam, setStageBoth])
  useEffect(() => {
    if (stage === 'rest' && restLeft <= 0) resumeFromRest()
  }, [stage, restLeft, resumeFromRest])

  function startCamera() {
    setMode('camera')
    void cam.start()
  }
  function startManual() {
    setMode('manual')
    startedAtRef.current = new Date().toISOString()
    setStageBoth('active')
  }
  function pause() {
    cam.setPaused(true)
    setStageBoth('paused')
  }
  function resume() {
    cam.setPaused(false)
    setStageBoth('active')
  }
  function stopWorkout() {
    finishWorkout(reps > 0 ? [...completedSets, reps] : completedSets)
  }

  const save = useMutation({
    mutationFn: () =>
      api.post('/workout-sessions', {
        exercise,
        mode,
        startedAt: startedAtRef.current,
        durationSeconds: elapsed,
        targetRepsPerSet: targetReps,
        sets: completedSets.map((r, i) => ({ setNumber: i + 1, reps: r })),
      }),
  })
  const savedOnce = useRef(false)
  useEffect(() => {
    if (stage === 'done' && completedSets.length > 0 && !savedOnce.current) {
      savedOnce.current = true
      save.mutate()
    }
  }, [stage, completedSets.length, save])

  const camBusy = cam.status === 'requesting' || cam.status === 'loading-model'
  const currentSet = Math.min(completedSets.length + 1, totalSets)
  const totalReps = completedSets.reduce((a, b) => a + b, 0)

  if (stage === 'done') {
    return (
      <div className="mx-auto max-w-xl">
        <Card className="p-8 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-success/20 text-success-glow">
            <Check className="size-7" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-2xl font-bold">{completedSets.length ? 'Workout complete' : 'Workout ended'}</h1>
          <p className="mt-1 text-sm text-muted">{label}</p>
          <dl className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              ['Sets', String(completedSets.length)],
              ['Reps', String(totalReps)],
              ['Time', fmt(elapsed)],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-line bg-navy-800 p-4">
                <dt className="text-xs text-muted">{k}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6" aria-live="polite">
            {completedSets.length === 0 && <p className="text-sm text-muted">No reps were recorded, so nothing was saved.</p>}
            {save.isPending && (
              <p className="flex items-center justify-center gap-2 text-sm text-muted">
                <Spinner /> Saving your session…
              </p>
            )}
            {save.isSuccess && <p className="text-sm text-success-glow">Session saved to your history.</p>}
            {save.isError && (
              <div className="text-left">
                <ErrorMessage
                  title="Session not saved"
                  message={getErrorMessage(save.error, 'We could not save this session.')}
                  onRetry={() => save.mutate()}
                />
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/app/workouts" className="rounded-full bg-gradient-to-r from-primary to-[#8b5cf6] px-6 py-3 text-sm font-semibold shadow-glow">
              New workout
            </Link>
            <Link to="/app/workouts/history" className="rounded-full border border-line-strong px-6 py-3 text-sm font-semibold hover:bg-white/5">
              View history
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  const healthy = live.reliable && live.hints.length === 0
  return (
    <>
      <div className="mb-5 flex items-center gap-4">
        <Link to="/app/workouts" className="flex items-center gap-1 text-sm text-muted hover:text-ink">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back
        </Link>
        <h1 className="text-xl font-bold">{label}</h1>
        <Badge tone={mode === 'camera' && cam.status === 'running' ? 'success' : 'neutral'} className="ml-auto">
          <Video className="size-3.5" aria-hidden="true" />
          {mode === 'manual' && stage !== 'setup' ? 'Manual mode' : cam.status === 'running' ? 'Camera on' : 'Camera off'}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative aspect-video overflow-hidden rounded-3xl border border-line-strong bg-navy-950">
          {/* The video is mirrored (selfie view); the canvas overlay is mirrored identically. */}
          <video ref={cam.videoRef} playsInline muted className={cn('absolute inset-0 size-full -scale-x-100 object-cover', mode === 'manual' && 'hidden')} />
          <canvas ref={cam.canvasRef} className={cn('absolute inset-0 size-full -scale-x-100 object-cover', mode === 'manual' && 'hidden')} />

          {stage === 'setup' && !camBusy && (
            <div className="absolute inset-0 grid place-items-center bg-navy-950/85 p-6 text-center">
              <div className="max-w-md">
                <Camera className="mx-auto size-10 text-secondary" aria-hidden="true" />
                <h2 className="mt-3 text-lg font-semibold">Get set up</h2>
                <ul className="mt-3 space-y-1.5 text-left text-sm text-muted">
                  <li>• {EXERCISES[exercise].cameraHint}</li>
                  <li>• Use good lighting and keep about 2–3 metres from the camera.</li>
                  <li>• Video is processed on your device. It is never uploaded or stored.</li>
                </ul>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <Button onClick={startCamera}>
                    <Camera className="size-4" aria-hidden="true" /> Start with camera
                  </Button>
                  <Button variant="secondary" onClick={startManual}>
                    Log manually
                  </Button>
                </div>
              </div>
            </div>
          )}
          {camBusy && (
            <div className="absolute inset-0 grid place-items-center bg-navy-950/85 text-center" role="status">
              <div>
                <Spinner className="mx-auto size-8" label="Loading" />
                <p className="mt-3 text-sm text-muted">
                  {cam.status === 'requesting' ? 'Waiting for camera permission…' : 'Loading the pose model…'}
                </p>
              </div>
            </div>
          )}
          {mode === 'manual' && stage !== 'setup' && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center text-muted">
              <p className="max-w-xs text-sm">Manual mode: count your reps and tap + after each one.</p>
            </div>
          )}
          {stage === 'paused' && (
            <div className="absolute inset-0 grid place-items-center bg-navy-950/70 text-lg font-semibold">Paused</div>
          )}
          {stage === 'rest' && (
            <div className="absolute inset-0 grid place-items-center bg-navy-950/85 text-center">
              <div>
                <p className="text-sm text-muted">Rest before set {completedSets.length + 1}</p>
                <p className="mt-1 text-6xl font-extrabold tabular-nums text-secondary">{fmt(Math.max(0, restLeft))}</p>
                <Button variant="secondary" className="mt-4" onClick={resumeFromRest}>
                  Skip rest
                </Button>
              </div>
            </div>
          )}
          {stage === 'active' && mode === 'camera' && !live.reliable && (
            <p className="absolute inset-x-4 bottom-4 rounded-xl bg-warning/20 px-4 py-2 text-center text-sm font-medium text-warning backdrop-blur">
              Adjust your camera position so your full body is visible.
            </p>
          )}
        </div>

        <Card className="flex flex-col">
          <p className="text-sm text-muted">
            Set {currentSet} / {totalSets}
          </p>
          <p className="mt-1 text-5xl font-extrabold tabular-nums" aria-live="polite">
            <span className="text-success-glow">{reps}</span>
            <span className="text-2xl font-bold text-muted"> / {targetReps} Reps</span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-gradient-to-r from-success to-success-glow transition-[width] duration-300" style={{ width: `${(reps / targetReps) * 100}%` }} />
          </div>
          <p className="mt-2 text-xs tabular-nums text-muted">Time {fmt(elapsed)}</p>

          {cam.message && <ErrorMessage className="mt-4" title="Camera problem" message={cam.message} />}

          <ul className="mt-5 space-y-2 text-sm" aria-label="Form feedback">
            {mode === 'camera' && stage === 'active' && healthy && (
              <li className="flex items-center gap-2.5">
                <Check className="size-5 rounded-full bg-success p-1 text-navy-900" aria-hidden="true" /> Form looks good
              </li>
            )}
            {live.hints.map((h) => (
              <li key={h} className="flex items-center gap-2.5 text-warning">
                <AlertTriangle className="size-5" aria-hidden="true" /> {h}
              </li>
            ))}
            {repHint && (
              <li className="flex items-center gap-2.5 text-warning">
                <AlertTriangle className="size-5" aria-hidden="true" /> {repHint}
              </li>
            )}
          </ul>
          <p className="mt-3 text-xs text-faint">General exercise guidance only, not medical advice. Stop if you feel pain.</p>

          {(mode === 'manual' || cam.status === 'denied' || cam.status === 'error' || cam.status === 'unsupported') && stage === 'active' && (
            <div className="mt-4 flex items-center gap-3">
              <Button variant="secondary" size="sm" aria-label="Remove a rep" disabled={reps === 0} onClick={() => setReps((r) => Math.max(0, r - 1))}>
                <Minus className="size-4" aria-hidden="true" />
              </Button>
              <Button size="sm" aria-label="Add a rep" onClick={() => setReps((r) => r + 1)}>
                <Plus className="size-4" aria-hidden="true" /> Rep
              </Button>
            </div>
          )}

          <div className="mt-auto grid grid-cols-3 gap-3 pt-6">
            {stage === 'paused' ? (
              <Button onClick={resume}>
                <Play className="size-4" aria-hidden="true" /> Resume
              </Button>
            ) : (
              <Button onClick={pause} disabled={stage !== 'active'}>
                <Pause className="size-4" aria-hidden="true" /> Pause
              </Button>
            )}
            <Button variant="danger" onClick={stopWorkout} disabled={stage === 'setup'}>
              <Square className="size-4" aria-hidden="true" /> Stop
            </Button>
            <Button variant="secondary" onClick={finishSet} disabled={stage !== 'active' || reps === 0}>
              <SkipForward className="size-4" aria-hidden="true" /> Next Set
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
