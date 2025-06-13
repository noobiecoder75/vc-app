export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  stripe_price_id_monthly?: string;
  stripe_price_id_yearly?: string;
  features: string[];
  max_companies?: number;
  max_validations_monthly?: number;
  max_kpi_reports?: number;
  vc_matching_enabled: boolean;
  sso_enabled: boolean;
  priority_support: boolean;
  api_access: boolean;
  custom_integrations: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  stripe_price_id?: string;
  status: 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid' | 'incomplete' | 'incomplete_expired' | 'paused';
  billing_cycle: 'monthly' | 'yearly';
  current_period_start?: string;
  current_period_end?: string;
  trial_start?: string;
  trial_end?: string;
  canceled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureUsage {
  id: string;
  user_id: string;
  feature_name: string;
  usage_count: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureLimit {
  allowed: boolean;
  current_usage: number;
  limit_value: number;
  unlimited: boolean;
}

export interface UserSubscriptionWithPlan extends UserSubscription {
  plan: SubscriptionPlan;
}

export type BillingCycle = 'monthly' | 'yearly';
export type SubscriptionStatus = UserSubscription['status'];