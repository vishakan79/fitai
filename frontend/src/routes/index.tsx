import { Suspense, lazy, type ReactNode } from 'react'
import { Navigate, createBrowserRouter } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { HomePage } from '@/pages/public/HomePage'
import { FeaturesPage } from '@/pages/public/FeaturesPage'
import { HowItWorksPage } from '@/pages/public/HowItWorksPage'
import { PricingPage } from '@/pages/public/PricingPage'
import { FaqPage } from '@/pages/public/FaqPage'
import { PrivacyPage, TermsPage } from '@/pages/public/LegalPages'
import { ContactPage } from '@/pages/public/ContactPage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { RegisterPage } from '@/pages/auth/RegisterPage'
import { ForgotPasswordPage } from '@/pages/auth/ForgotPasswordPage'
import { ResetPasswordPage } from '@/pages/auth/ResetPasswordPage'
import { AppShell } from '@/components/app/AppShell'


const DashboardPage = lazy(() => import('@/pages/app/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const WorkoutsPage = lazy(() => import('@/pages/app/WorkoutsPage').then((m) => ({ default: m.WorkoutsPage })))
const LiveWorkoutPage = lazy(() => import('@/pages/app/LiveWorkoutPage').then((m) => ({ default: m.LiveWorkoutPage })))
const HistoryPage = lazy(() => import('@/pages/app/HistoryPage').then((m) => ({ default: m.HistoryPage })))
const PlansPage = lazy(() => import('@/pages/app/PlansPage').then((m) => ({ default: m.PlansPage })))
const ExerciseDetailPage = lazy(() => import('@/pages/app/ExercisesPage').then((m) => ({ default: m.ExerciseDetailPage })))
const ExercisesPage = lazy(() => import('@/pages/app/ExercisesPage').then((m) => ({ default: m.ExercisesPage })))
const ProgressPage = lazy(() => import('@/pages/app/ProgressPage').then((m) => ({ default: m.ProgressPage })))
const AssistantPage = lazy(() => import('@/pages/app/AssistantPage').then((m) => ({ default: m.AssistantPage })))
const SubscriptionPage = lazy(() => import('@/pages/app/SubscriptionPage').then((m) => ({ default: m.SubscriptionPage })))
const SettingsPage = lazy(() => import('@/pages/app/SettingsPage').then((m) => ({ default: m.SettingsPage })))
const OnboardingPage = lazy(() => import('@/pages/app/OnboardingPage').then((m) => ({ default: m.OnboardingPage })))
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminDashboardPage })))
const AdminExercisesPage = lazy(() => import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminExercisesPage })))
const AdminPaymentsPage = lazy(() => import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminPaymentsPage })))
const AdminSubscriptionsPage = lazy(() => import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminSubscriptionsPage })))
const AdminUsagePage = lazy(() => import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminUsagePage })))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminPages').then((m) => ({ default: m.AdminUsersPage })))

const wrap = (el: ReactNode) => <Suspense fallback={<div className="p-8 text-sm text-muted" role="status">Loading…</div>}>{el}</Suspense>

/**
 * Route table. /app/*, /onboarding and /admin/* are NOT yet behind a sign-in guard: that arrives
 * with the backend auth (Phase 2). Even then the real protection is server-side authorization on
 * every API call, never route guards alone.
 */
export const router = createBrowserRouter([
  { path: '/onboarding', element: wrap(<OnboardingPage />) },
  {
    path: '/app',
    element: <AppShell />,
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: 'dashboard', element: wrap(<DashboardPage />) },
      { path: 'workouts', element: wrap(<WorkoutsPage />) },
      { path: 'workouts/live', element: wrap(<LiveWorkoutPage />) },
      { path: 'workouts/history', element: wrap(<HistoryPage />) },
      { path: 'plans', element: wrap(<PlansPage />) },
      { path: 'exercises', element: wrap(<ExercisesPage />) },
      { path: 'exercises/:id', element: wrap(<ExerciseDetailPage />) },
      { path: 'progress', element: wrap(<ProgressPage />) },
      { path: 'assistant', element: wrap(<AssistantPage />) },
      { path: 'subscription', element: wrap(<SubscriptionPage />) },
      { path: 'settings', element: wrap(<SettingsPage />) },
    ],
  },
  {
    path: '/admin',
    element: <AppShell variant="admin" />,
    children: [
      { index: true, element: wrap(<AdminDashboardPage />) },
      { path: 'users', element: wrap(<AdminUsersPage />) },
      { path: 'exercises', element: wrap(<AdminExercisesPage />) },
      { path: 'subscriptions', element: wrap(<AdminSubscriptionsPage />) },
      { path: 'payments', element: wrap(<AdminPaymentsPage />) },
      { path: 'usage', element: wrap(<AdminUsagePage />) },
    ],
  },
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/features', element: <FeaturesPage /> },
      { path: '/how-it-works', element: <HowItWorksPage /> },
      { path: '/pricing', element: <PricingPage /> },
      { path: '/faq', element: <FaqPage /> },
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/reset-password', element: <ResetPasswordPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
