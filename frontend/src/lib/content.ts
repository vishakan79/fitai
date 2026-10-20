import {
  Camera,
  ClipboardList,
  Dumbbell,
  Flame,
  HeartPulse,
  LineChart,
  MessageSquareText,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export interface Feature {
  icon: LucideIcon
  title: string
  short: string
  long: string
}

export const features: Feature[] = [
  {
    icon: Camera,
    title: 'Real-Time Form Guidance',
    short: 'Get instant feedback on your posture.',
    long: 'Your camera feed is analysed on your device with a pose model. Exercise-specific rules compare joint angles to comfortable ranges and show general guidance, only when the landmarks are reliable enough to trust.',
  },
  {
    icon: ClipboardList,
    title: 'Personalised Workout Plans',
    short: 'Plans tailored to your goals and level.',
    long: 'Tell us your goal, experience, equipment, schedule and limitations. AI drafts a structured weekly plan, and the server validates every exercise, set and rep range before it is saved.',
  },
  {
    icon: MessageSquareText,
    title: 'AI Fitness Assistant',
    short: 'Ask anything about workouts and recovery.',
    long: 'Chat about technique, beginner routines, modifications and rest days. The assistant only sees your own saved data, and it is not a doctor or a substitute for a qualified professional.',
  },
  {
    icon: Trophy,
    title: 'Track Your Progress',
    short: 'See improvement with detailed history.',
    long: 'Every saved session feeds a calendar, weekly and monthly summaries, exercise-level history and consistency trends. Numbers come from your real records, nothing is estimated or invented.',
  },
  {
    icon: Zap,
    title: 'Anytime, Anywhere',
    short: 'Train at home, in the gym or on the go.',
    long: 'Works in a modern browser on a phone or laptop. No camera? Use manual mode to log sets and reps yourself.',
  },
]

export const supportedExercises = [
  {
    name: 'Bodyweight Squat',
    blurb: 'Tracks depth from hip and knee angles and counts a rep on a full down-and-up cycle.',
    tracked: true,
  },
  {
    name: 'Push-Up',
    blurb: 'Follows elbow bend and body alignment from a side-on camera view.',
    tracked: true,
  },
  {
    name: 'Lunge',
    blurb: 'Counts alternating legs and shows which side you are on.',
    tracked: true,
  },
]

export const steps = [
  {
    icon: Camera,
    title: 'Allow the camera',
    body: 'Camera access is requested only when you start a camera workout. Video stays on your device. It is never uploaded or stored.',
  },
  {
    icon: Dumbbell,
    title: 'Pick an exercise',
    body: 'Choose squats, push-ups or lunges, then set your target reps and number of sets.',
  },
  {
    icon: HeartPulse,
    title: 'Get tracked',
    body: 'Step back until your full body is in frame. A skeleton overlay follows you and counts each valid repetition.',
  },
  {
    icon: Flame,
    title: 'Follow the feedback',
    body: 'Short, general hints appear as you move. If tracking is unreliable you will be asked to adjust the camera instead.',
  },
  {
    icon: LineChart,
    title: 'Save your progress',
    body: 'Finish the workout to save the session and see it in your history and charts.',
  },
]

export const goals = [
  { id: 'lose-weight', label: 'Lose Weight', icon: Flame },
  { id: 'build-strength', label: 'Build Strength', icon: Dumbbell },
  { id: 'improve-fitness', label: 'Stay Fit', icon: HeartPulse },
] as const

export type GoalId = (typeof goals)[number]['id']

export interface PlanTier {
  id: 'free' | 'pro' | 'premium'
  name: string
  priceInr: number
  tagline: string
  highlighted?: boolean
  features: string[]
}

/**
 * Initial proposed launch plans. These are display defaults only: the backend owns plans,
 * prices and entitlements (Phase 6) and will replace this data.
 */
export const plans: PlanTier[] = [
  {
    id: 'free',
    name: 'Free',
    priceInr: 0,
    tagline: 'Everything you need to start.',
    features: [
      'Camera tracking: squats, push-ups, lunges',
      'Rep counting and general form hints',
      'Workout history and basic progress',
      'Limited AI plans and assistant messages',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    priceInr: 499,
    tagline: 'For people training consistently.',
    highlighted: true,
    features: [
      'Everything in Free',
      'Higher AI plan and assistant limits',
      'Full progress history and exercise trends',
      'Data export',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    priceInr: 999,
    tagline: 'The most room to explore.',
    features: ['Everything in Pro', 'Highest AI usage limits', 'Priority access to new exercises', 'Priority support'],
  },
]

export const faqs = [
  {
    q: 'Do you store or upload my camera video?',
    a: 'No. Pose estimation runs in your browser and raw video is not uploaded or stored. Only the workout results you save (exercise, sets, reps, duration) are sent to our servers.',
  },
  {
    q: 'Can FitAI tell me if I am doing an exercise safely?',
    a: 'FitAI gives general exercise guidance based on body landmarks from a single camera. That is useful for rep counting and basic posture cues, but it cannot diagnose injuries, assess every joint, or replace a qualified coach or clinician. Stop if you feel pain.',
  },
  {
    q: 'What equipment and device do I need?',
    a: 'A modern browser on a phone or laptop with a camera, some floor space, and decent lighting. Place the camera so your full body is visible. If you have no camera, manual mode lets you log workouts yourself.',
  },
  {
    q: 'Which exercises are tracked by camera?',
    a: 'Bodyweight squats, push-ups and lunges to start. The exercise library also holds instruction-only exercises that are clearly marked as not camera-tracked.',
  },
  {
    q: 'How are workout plans generated?',
    a: 'A language model drafts a plan from your goal, level, equipment and limitations. Our server then validates the structure and values before saving it. Plans are general suggestions, not medical or nutritional advice.',
  },
  {
    q: 'Is it really free?',
    a: 'There is a free plan with camera tracking and progress history. Paid plans raise AI usage limits. The prices shown are initial proposals and may change before launch.',
  },
  {
    q: 'Will I lose weight or get fitter?',
    a: 'We cannot promise results. Consistent, appropriate exercise helps most people, and FitAI is designed to make that consistency easier to track.',
  },
]
