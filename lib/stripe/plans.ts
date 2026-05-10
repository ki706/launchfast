export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: {
      aiTokensPerMonth: 10000,
      teamMembers: 1,
      projects: 3,
      apiCallsPerMinute: 10,
      customDomain: false,
      prioritySupport: false,
    }
  },
  pro: {
    name: 'Pro',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    price: 49,
    features: {
      aiTokensPerMonth: 100000,
      teamMembers: 5,
      projects: -1, // unlimited
      apiCallsPerMinute: 60,
      customDomain: true,
      prioritySupport: false,
    }
  },
  business: {
    name: 'Business',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID,
    price: 149,
    features: {
      aiTokensPerMonth: -1, // unlimited
      teamMembers: -1,
      projects: -1,
      apiCallsPerMinute: 300,
      customDomain: true,
      prioritySupport: true,
    }
  }
} as const

export type PlanType = keyof typeof PLANS
export type PlanFeatures = typeof PLANS[PlanType]['features']

export function getPlanFeatures(plan: string): PlanFeatures {
  return (PLANS[plan as PlanType] || PLANS.free).features
}
