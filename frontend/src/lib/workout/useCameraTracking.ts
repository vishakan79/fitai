import { useCallback, useEffect, useRef, useState } from 'react'
import type { PoseLandmarker } from '@mediapipe/tasks-vision'
import { measure, type ExerciseKey, type Landmark, type Measurement } from './engine'

// Pinned to the installed package version so the WASM runtime matches the JS bundle.
const WASM_URL = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.1.1/wasm'
const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
const TARGET_FPS = 24

export type CameraStatus =
  | 'idle'
  | 'requesting' // waiting for the browser permission prompt
  | 'loading-model'
  | 'running'
  | 'denied'
  | 'unsupported'
  | 'error'

export interface TrackingFrame extends Measurement {
  landmarks: Landmark[] | null
  t: number
}

export function cameraErrorMessage(e: unknown): { status: CameraStatus; message: string } {
  const name = e instanceof DOMException ? e.name : ''
  if (name === 'NotAllowedError' || name === 'SecurityError') {
    return {
      status: 'denied',
      message:
        'Camera access was blocked. Click the camera icon in your browser address bar, allow camera access for this site, then try again.',
    }
  }
  if (name === 'NotFoundError' || name === 'OverconstrainedError') {
    return { status: 'error', message: 'No camera was found on this device. You can log your workout manually instead.' }
  }
  if (name === 'NotReadableError') {
    return { status: 'error', message: 'The camera is in use by another app. Close it and try again.' }
  }
  return { status: 'error', message: e instanceof Error ? e.message : 'Could not start the camera.' }
}

/**
 * Owns the camera stream, the MediaPipe Pose Landmarker and the render loop.
 * Everything runs in the browser; no video is uploaded or stored. All resources (tracks, animation
 * frame, model) are released on stop() and on unmount.
 */
export function useCameraTracking({
  exercise,
  onFrame,
}: {
  exercise: ExerciseKey
  onFrame: (frame: TrackingFrame) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const landmarkerRef = useRef<PoseLandmarker | null>(null)
  const rafRef = useRef(0)
  const pausedRef = useRef(false)
  const exerciseRef = useRef(exercise)
  const onFrameRef = useRef(onFrame)
  const [status, setStatus] = useState<CameraStatus>('idle')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    exerciseRef.current = exercise
  }, [exercise])
  useEffect(() => {
    onFrameRef.current = onFrame
  }, [onFrame])

  const release = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    landmarkerRef.current?.close()
    landmarkerRef.current = null
    const v = videoRef.current
    if (v) v.srcObject = null
    const c = canvasRef.current
    c?.getContext('2d')?.clearRect(0, 0, c.width, c.height)
  }, [])

  const stop = useCallback(() => {
    release()
    setStatus('idle')
    setMessage(null)
  }, [release])

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus('unsupported')
      setMessage('This browser cannot access a camera. Use a current version of Chrome, Edge, Safari or Firefox over HTTPS.')
      return
    }
    setMessage(null)
    pausedRef.current = false
    setStatus('requesting')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      })
      streamRef.current = stream
      const video = videoRef.current
      if (!video) throw new Error('Video element is not ready')
      video.srcObject = stream
      await video.play()

      setStatus('loading-model')
      const { FilesetResolver, PoseLandmarker, DrawingUtils } = await import('@mediapipe/tasks-vision')
      const fileset = await FilesetResolver.forVisionTasks(WASM_URL)
      const landmarker = await PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: 'GPU' },
        runningMode: 'VIDEO',
        numPoses: 1,
      })
      // The user may have stopped while the model was loading.
      if (!streamRef.current) {
        landmarker.close()
        return
      }
      landmarkerRef.current = landmarker
      setStatus('running')

      let lastTs = -1
      let lastRun = 0
      const loop = (now: number) => {
        rafRef.current = requestAnimationFrame(loop)
        const v = videoRef.current
        const lm = landmarkerRef.current
        const canvas = canvasRef.current
        if (!v || !lm || !canvas || v.readyState < 2 || pausedRef.current) return
        if (now - lastRun < 1000 / TARGET_FPS || now === lastTs) return
        lastRun = now
        lastTs = now

        if (canvas.width !== v.videoWidth) {
          canvas.width = v.videoWidth
          canvas.height = v.videoHeight
        }
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const result = lm.detectForVideo(v, now)
        const pose = result.landmarks[0]
        const aspect = v.videoWidth / v.videoHeight || 1
        const m = measure(exerciseRef.current, (pose ?? []) as Landmark[], aspect)
        if (pose) {
          const draw = new DrawingUtils(ctx)
          draw.drawConnectors(pose, PoseLandmarker.POSE_CONNECTIONS, { color: '#34f5b0', lineWidth: 4 })
          draw.drawLandmarks(pose, { color: '#f8fafc', fillColor: '#10b981', lineWidth: 2, radius: 4 })
        }
        onFrameRef.current({ ...m, landmarks: (pose as Landmark[] | undefined) ?? null, t: now })
      }
      rafRef.current = requestAnimationFrame(loop)
    } catch (e) {
      release()
      const { status: s, message: msg } = cameraErrorMessage(e)
      setStatus(s)
      setMessage(msg)
    }
  }, [release])

  const setPaused = useCallback((p: boolean) => {
    pausedRef.current = p
  }, [])

  // Always release the camera when leaving the screen.
  useEffect(() => release, [release])

  return { videoRef, canvasRef, status, message, start, stop, setPaused }
}
