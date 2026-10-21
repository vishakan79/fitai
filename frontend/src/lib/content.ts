import {
  BarChart3,
  Camera,
  Crown,
  Dumbbell,
  Flame,
  HeartPulse,
  LineChart,
  Trophy,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export interface Feature {
  icon: LucideIcon
  /** Tailwind classes for the icon tile (background + colour). */
  tone: string
  title: string
  short: string
  long: string
}

export const features: Feature[] = [
  {
    icon: Camera,
    tone: 'bg-sky-500/15 text-sky-400',
    title: 'Real-Time Form Guidance',
    short: 'Get instant feedback on your posture.',
    long: 'Your camera feed is analysed on your device with a pose model. Exercise-specific rules compare joint angles to comfortable ranges and show general guidance, only when the landmarks are reliable enough to trust.',
  },
  {
    icon: BarChart3,
    tone: 'bg-emerald-500/15 text-emerald-400',
    title: 'Personalised Workout Plans',
    short: 'Plans tailored to your goals and level.',
    long: 'Tell us your goal, experience, equipment, schedule and limitations. AI drafts a structured weekly plan, and the server validates every exercise, set and rep range before it is saved.',
  },
  {
    icon: Crown,
    tone: 'bg-amber-400/15 text-amber-300',
    title: 'AI Fitness Assistant',
    short: 'Ask anything about workouts and recovery.',
    long: 'Chat about technique, beginner routines, modifications and rest days. The assistant only sees your own saved data, and it is not a doctor or a substitute for a qualified professional.',
  },
  {
    icon: Trophy,
    tone: 'bg-amber-400/15 text-amber-300',
    title: 'Track Your Progress',
    short: 'See improvement with detailed history.',
    long: 'Every saved session feeds a calendar, weekly and monthly summaries, exercise-level history and consistency trends. Numbers come from your real records, nothing is estimated or invented.',
  },
  {
    icon: Zap,
    tone: 'bg-yellow-400/15 text-yellow-300',
    title: 'Anytime, Anywhere',
    short: 'Train at home, in the gym or on the go.',
    long: 'Works in a modern browser on a phone or laptop. No camera? Use manual mode to log sets and reps yourself.',
  },
]

export const steps = [
  {
    icon: Camera,
    title: 'Open the app',
    body: 'Allow camera access when you start a workout and set your goals. Video stays on your device.',
  },
  {
    icon: Dumbbell,
    title: 'Choose a workout',
    body: 'Pick an exercise or a plan, then set your target reps and sets.',
  },
  {
    icon: HeartPulse,
    title: 'Follow real-time guidance',
    body: 'Step back until your full body is in frame. Rep counting and general form hints follow you.',
  },
  {
    icon: LineChart,
    title: 'Track your progress',
    body: 'Finish to save the session and watch your history and consistency build over time.',
  },
]

export const goals = [
  { id: 'lose-weight', label: 'Lose Weight', icon: Flame, tone: 'text-orange-400' },
  { id: 'build-strength', label: 'Build Strength', icon: Dumbbell, tone: 'text-violet-400' },
  { id: 'improve-fitness', label: 'Stay Fit', icon: HeartPulse, tone: 'text-rose-400' },
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

export type BodyArea = 'Full Body' | 'Upper Body' | 'Lower Body' | 'Core'
export const bodyAreas: Array<'All' | BodyArea> = ['All', 'Full Body', 'Upper Body', 'Lower Body', 'Core']

export interface CatalogExercise {
  id: string
  name: string
  area: BodyArea
  level: 'Beginner' | 'Intermediate'
  equipment: string
  image: string
  /** Real-time camera tracking is implemented for this exercise. */
  tracked: boolean
  muscles: string[]
  description: string
  instructions: string[]
  mistakes: string[]
  camera: string
}

/**
 * Starter exercise library shown in the UI. The backend exercise catalogue (Phase 4) will seed
 * and serve this same shape; these entries are real instructional content, not user data.
 */
export const exerciseCatalog: CatalogExercise[] = [
  {
    id: 'squat',
    name: 'Squats',
    area: 'Full Body',
    level: 'Beginner',
    equipment: 'None',
    image: '/images/ex-squat.webp',
    tracked: true,
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings', 'Core'],
    description: 'A foundational lower-body movement that also trains your core and balance.',
    instructions: [
      'Stand with feet about shoulder-width apart, toes slightly turned out.',
      'Brace your core and send your hips back and down as if sitting into a chair.',
      'Lower until your thighs are about parallel to the floor, or as far as is comfortable.',
      'Press through your whole foot to stand back up.',
    ],
    mistakes: ['Knees collapsing inward', 'Heels lifting off the floor', 'Rounding the lower back'],
    camera: 'Side-on view, full body in frame, about 2–3 metres away.',
  },
  {
    id: 'pushup',
    name: 'Push-Ups',
    area: 'Upper Body',
    level: 'Beginner',
    equipment: 'None',
    image: '/images/ex-pushup.webp',
    tracked: true,
    muscles: ['Chest', 'Shoulders', 'Triceps', 'Core'],
    description: 'A classic bodyweight press. Start on your knees or against a wall if a full push-up is too hard.',
    instructions: [
      'Place your hands slightly wider than your shoulders, body in one straight line.',
      'Lower your chest towards the floor with elbows at roughly 45 degrees from your body.',
      'Pause briefly just above the floor.',
      'Press back up until your arms are straight.',
    ],
    mistakes: ['Hips sagging or piking up', 'Flaring elbows straight out', 'Not lowering through a full range'],
    camera: 'Side-on view, camera low to the floor, whole body in frame.',
  },
  {
    id: 'lunge',
    name: 'Lunges',
    area: 'Lower Body',
    level: 'Beginner',
    equipment: 'None',
    image: '/images/ex-lunge.webp',
    tracked: true,
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    description: 'A single-leg movement that builds strength and balance, one side at a time.',
    instructions: [
      'Stand tall, then step one foot forward into a long stride.',
      'Lower your back knee towards the floor while keeping your torso upright.',
      'Keep your front knee roughly above your ankle.',
      'Push through the front foot to return, then switch legs.',
    ],
    mistakes: ['Stride too short', 'Leaning the torso far forward', 'Front knee drifting inward'],
    camera: 'Side-on or front-on, full body in frame.',
  },
  {
    id: 'plank',
    name: 'Plank',
    area: 'Core',
    level: 'Beginner',
    equipment: 'None',
    image: '/images/ex-plank.webp',
    tracked: false,
    muscles: ['Abdominals', 'Shoulders', 'Glutes'],
    description: 'An isometric hold that trains trunk stability. Instruction only: not camera tracked yet.',
    instructions: [
      'Rest on your forearms with elbows under your shoulders.',
      'Extend your legs and tuck your toes, forming one line from head to heels.',
      'Brace your abs and squeeze your glutes. Keep breathing.',
      'Hold for the planned time, then lower with control.',
    ],
    mistakes: ['Hips sagging', 'Hips raised too high', 'Holding your breath'],
    camera: 'Not camera tracked yet.',
  },
  {
    id: 'press',
    name: 'Shoulder Press',
    area: 'Upper Body',
    level: 'Intermediate',
    equipment: 'Dumbbells',
    image: '/images/ex-press.webp',
    tracked: false,
    muscles: ['Shoulders', 'Triceps', 'Upper chest'],
    description: 'An overhead press with dumbbells. Instruction only: not camera tracked yet.',
    instructions: [
      'Hold a dumbbell in each hand at shoulder height, palms facing forward.',
      'Brace your core and press the weights overhead until your arms are straight.',
      'Lower back to shoulder height with control.',
    ],
    mistakes: ['Arching the lower back', 'Using momentum from the legs', 'Choosing a weight that is too heavy'],
    camera: 'Not camera tracked yet.',
  },
  {
    id: 'curl',
    name: 'Bicep Curl',
    area: 'Upper Body',
    level: 'Beginner',
    equipment: 'Dumbbells',
    image: '/images/ex-curl.webp',
    tracked: false,
    muscles: ['Biceps', 'Forearms'],
    description: 'An arm exercise with dumbbells. Instruction only: not camera tracked yet.',
    instructions: [
      'Stand tall holding a dumbbell in each hand, palms forward.',
      'Keeping your elbows by your sides, curl the weights towards your shoulders.',
      'Lower slowly to the start.',
    ],
    mistakes: ['Swinging the body', 'Elbows drifting forward', 'Dropping the weights quickly'],
    camera: 'Not camera tracked yet.',
  },
]
