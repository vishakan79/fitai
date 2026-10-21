/**
 * SAMPLE DATA for the preview build. None of this is a real user's data: every page that shows it
 * also shows <SampleBanner/>. Once the backend exists these are replaced by API queries.
 */
export const sampleUser = { name: 'Vishakan', email: 'you@example.com' }

export const sampleStats = {
  totalWorkouts: 12,
  totalReps: 1248,
  totalTime: '8h 24m',
  streakDays: 7,
}

export const sampleTodayPlan = {
  name: 'Full Body',
  day: 'Day 3',
  exercises: [
    { name: 'Squats', sets: 3, reps: 15, exerciseId: 'squat' },
    { name: 'Push-Ups', sets: 3, reps: 12, exerciseId: 'pushup' },
    { name: 'Lunges', sets: 3, reps: 12, exerciseId: 'lunge' },
  ],
}

export const sampleWeek = [
  { day: 'Mon', reps: 120 },
  { day: 'Tue', reps: 60 },
  { day: 'Wed', reps: 180 },
  { day: 'Thu', reps: 90 },
  { day: 'Fri', reps: 240 },
  { day: 'Sat', reps: 150 },
  { day: 'Sun', reps: 0 },
]

export const sampleMonthly = [
  { m: 'Jan', reps: 22 },
  { m: 'Feb', reps: 30 },
  { m: 'Mar', reps: 26 },
  { m: 'Apr', reps: 34 },
  { m: 'May', reps: 31 },
  { m: 'Jun', reps: 40 },
]

export const sampleBreakdown = [
  { name: 'Squats', value: 35, color: '#7c3aed' },
  { name: 'Push-Ups', value: 25, color: '#a78bfa' },
  { name: 'Lunges', value: 20, color: '#10b981' },
  { name: 'Plank', value: 15, color: '#f59e0b' },
  { name: 'Others', value: 5, color: '#6f7ba0' },
]

export const sampleProgressStats = [
  { label: 'Total Workouts', value: '48' },
  { label: 'Total Reps', value: '5,642' },
  { label: 'Total Time', value: '38h 20m' },
  { label: 'Current Streak', value: '12 days' },
]

export const samplePlans = [
  { id: 'p1', name: 'Full Body Strength', weeks: 4, level: 'Beginner', workouts: 12, image: '/images/ex-squat.webp', ai: false },
  { id: 'p2', name: 'Weight Loss Program', weeks: 6, level: 'Intermediate', workouts: 18, image: '/images/ex-pushup.webp', ai: true },
  { id: 'p3', name: 'Home Workout Plan', weeks: 4, level: 'Beginner', workouts: 12, image: '/images/ex-lunge.webp', ai: true },
]

export const sampleHistory = [
  { id: 's1', date: 'Mon, 19 Oct', exercise: 'Squats', sets: 3, reps: 45, duration: '12 min' },
  { id: 's2', date: 'Sat, 17 Oct', exercise: 'Push-Ups', sets: 3, reps: 36, duration: '9 min' },
  { id: 's3', date: 'Thu, 15 Oct', exercise: 'Lunges', sets: 3, reps: 36, duration: '11 min' },
  { id: 's4', date: 'Tue, 13 Oct', exercise: 'Squats', sets: 4, reps: 60, duration: '15 min' },
]

export const sampleAdmin = {
  stats: [
    { label: 'Total Users', value: '1,248' },
    { label: 'Active Subscribers', value: '342' },
    { label: 'Total Workouts', value: '5,862' },
    { label: 'New Users (7d)', value: '48' },
  ],
  growth: [
    { m: 'Jan', users: 40 },
    { m: 'Feb', users: 55 },
    { m: 'Mar', users: 80 },
    { m: 'Apr', users: 110 },
    { m: 'May', users: 100 },
    { m: 'Jun', users: 150 },
  ],
  recent: [
    { name: 'Sample User A', email: 'user.a@example.com', joined: 'Oct 15, 2026' },
    { name: 'Sample User B', email: 'user.b@example.com', joined: 'Oct 14, 2026' },
    { name: 'Sample User C', email: 'user.c@example.com', joined: 'Oct 13, 2026' },
    { name: 'Sample User D', email: 'user.d@example.com', joined: 'Oct 12, 2026' },
  ],
}
