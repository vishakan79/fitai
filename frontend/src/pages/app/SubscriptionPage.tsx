import { useMutation } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { Badge, Button, Card, ErrorMessage } from '@/components/ui'
import { PageHeader } from '@/components/app/parts'
import { api, getErrorMessage } from '@/lib/api'
import { plans, type PlanTier } from '@/lib/content'
import { cn } from '@/lib/cn'

export function SubscriptionPage() {
  const checkout = useMutation({
    mutationFn: (plan: PlanTier) => api.post<{ checkoutUrl?: string }>('/subscription/checkout', { planId: plan.id }),
    onSuccess: ({ data }) => {
      if (data.checkoutUrl) window.location.assign(data.checkoutUrl)
    },
  })
  return (
    <>
      <PageHeader title="Choose Your Plan" subtitle="Unlock more features and take your fitness to the next level." />
      <p className="mb-6 rounded-2xl border border-line bg-card/60 px-4 py-3 text-sm text-muted">
        Prices and limits are initial proposals. Paid plans activate only after the payment is verified by our server,
        never from the browser alone. Checkout is not enabled until the payment provider is configured.
      </p>
      {checkout.isError && <ErrorMessage className="mb-6" title="Checkout unavailable" message={getErrorMessage(checkout.error, 'We could not start checkout.')} />}
      <ul className="grid items-stretch gap-6 lg:grid-cols-3">
        {plans.map((p) => (
          <li key={p.id}>
            <Card className={cn('relative flex h-full flex-col p-8', p.highlighted && 'border-secondary/60 shadow-glow')}>
              {p.highlighted && (
                <Badge tone="primary" className="absolute -top-3 left-8 bg-navy-900">
                  Most popular
                </Badge>
              )}
              <h2 className="text-xl font-bold">{p.name}</h2>
              <p className="mt-1 text-sm text-muted">{p.tagline}</p>
              <p className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-bold tabular-nums">₹{p.priceInr}</span>
                <span className="text-sm text-muted">/month</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3 text-sm text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
              {p.id === 'free' ? (
                <Button variant="secondary" disabled className="mt-8 w-full">
                  Default plan
                </Button>
              ) : (
                <Button variant={p.highlighted ? 'primary' : 'secondary'} className="mt-8 w-full" loading={checkout.isPending && checkout.variables?.id === p.id} onClick={() => checkout.mutate(p)}>
                  Choose {p.name}
                </Button>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </>
  )
}
