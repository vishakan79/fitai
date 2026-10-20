import { createBrowserRouter } from 'react-router-dom'
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

/**
 * Route table. Authenticated (/app/*, /onboarding) and admin (/admin/*) routes are added in the
 * phases that build them; they must also be enforced server-side, never by route guards alone.
 */
export const router = createBrowserRouter([
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
