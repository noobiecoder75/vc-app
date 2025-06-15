/*
  # Complete Stripe Integration Setup

  1. New Tables
    - `subscription_plans` - Available subscription plans
    - `user_subscriptions` - User subscription records
    - `feature_usage` - Track feature usage per user per month
  
  2. Security
    - Enable RLS on all subscription tables
    - Add policies for user access control
  
  3. Functions
    - Helper functions for checking feature limits
    - Function to track feature usage
*/

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_monthly numeric NOT NULL DEFAULT 0,
  price_yearly numeric NOT NULL DEFAULT 0,
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  max_companies integer,
  max_validations_monthly integer,
  max_kpi_reports integer,
  vc_matching_enabled boolean NOT NULL DEFAULT false,
  sso_enabled boolean NOT NULL DEFAULT false,
  priority_support boolean NOT NULL DEFAULT false,
  api_access boolean NOT NULL DEFAULT false,
  custom_integrations boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid REFERENCES subscription_plans(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused')),
  billing_cycle text NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  canceled_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create feature_usage table
CREATE TABLE IF NOT EXISTS feature_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feature_name text NOT NULL,
  usage_count integer NOT NULL DEFAULT 0,
  period_start date NOT NULL,
  period_end date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, feature_name, period_start)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_period ON feature_usage(user_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature_name ON feature_usage(feature_name);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans
CREATE POLICY "Subscription plans are publicly viewable" ON subscription_plans
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

-- RLS Policies for user_subscriptions
CREATE POLICY "Users can view their own subscription" ON user_subscriptions
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" ON user_subscriptions
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" ON user_subscriptions
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for feature_usage
CREATE POLICY "Users can view their own feature usage" ON feature_usage
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feature usage" ON feature_usage
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feature usage" ON feature_usage
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features, max_companies, max_validations_monthly, max_kpi_reports, vc_matching_enabled, sso_enabled, priority_support, api_access, custom_integrations, sort_order)
VALUES 
  (
    'Starter',
    'Perfect for validating your startup idea',
    0,
    0,
    '["3 startup validations per month", "Basic market analysis", "Competitor research", "Email support", "Community access"]'::jsonb,
    3,
    3,
    10,
    false,
    false,
    false,
    false,
    false,
    1
  ),
  (
    'Professional',
    'For growing startups ready to scale',
    29,
    288,
    '["Unlimited startup validations", "Advanced market analysis", "Detailed competitor insights", "KPI tracking & benchmarks", "Pitch deck builder", "Priority email support", "14-day free trial"]'::jsonb,
    null,
    null,
    null,
    true,
    false,
    true,
    false,
    false,
    2
  ),
  (
    'Enterprise',
    'For VCs, accelerators, and large teams',
    99,
    948,
    '["Everything in Professional", "Advanced VC matching", "Team collaboration tools", "SSO & user management", "Custom integrations", "Dedicated account manager", "Phone & priority support", "30-day free trial"]'::jsonb,
    null,
    null,
    null,
    true,
    true,
    true,
    true,
    true,
    3
  )
ON CONFLICT (name) DO UPDATE SET
  description = EXCLUDED.description,
  price_monthly = EXCLUDED.price_monthly,
  price_yearly = EXCLUDED.price_yearly,
  features = EXCLUDED.features,
  max_companies = EXCLUDED.max_companies,
  max_validations_monthly = EXCLUDED.max_validations_monthly,
  max_kpi_reports = EXCLUDED.max_kpi_reports,
  vc_matching_enabled = EXCLUDED.vc_matching_enabled,
  sso_enabled = EXCLUDED.sso_enabled,
  priority_support = EXCLUDED.priority_support,
  api_access = EXCLUDED.api_access,
  custom_integrations = EXCLUDED.custom_integrations,
  updated_at = now();

-- Function to check feature limits
CREATE OR REPLACE FUNCTION check_feature_limit(
  p_user_id uuid,
  p_feature_name text
)
RETURNS TABLE(
  allowed boolean,
  current_usage integer,
  limit_value integer,
  unlimited boolean
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan_limits record;
  v_current_usage integer := 0;
  v_period_start date := date_trunc('month', CURRENT_DATE);
BEGIN
  -- Get user's plan limits
  SELECT 
    CASE 
      WHEN p_feature_name = 'validations' THEN sp.max_validations_monthly
      WHEN p_feature_name = 'companies' THEN sp.max_companies
      WHEN p_feature_name = 'kpi_reports' THEN sp.max_kpi_reports
      ELSE null
    END as feature_limit,
    CASE 
      WHEN p_feature_name = 'vc_matching' THEN sp.vc_matching_enabled
      WHEN p_feature_name = 'sso' THEN sp.sso_enabled
      WHEN p_feature_name = 'api_access' THEN sp.api_access
      WHEN p_feature_name = 'custom_integrations' THEN sp.custom_integrations
      ELSE true
    END as feature_enabled
  INTO v_plan_limits
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id 
    AND us.status IN ('active', 'trialing')
  ORDER BY us.created_at DESC
  LIMIT 1;

  -- If no subscription found, use free plan limits
  IF NOT FOUND THEN
    SELECT 
      CASE 
        WHEN p_feature_name = 'validations' THEN sp.max_validations_monthly
        WHEN p_feature_name = 'companies' THEN sp.max_companies
        WHEN p_feature_name = 'kpi_reports' THEN sp.max_kpi_reports
        ELSE null
      END as feature_limit,
      CASE 
        WHEN p_feature_name = 'vc_matching' THEN sp.vc_matching_enabled
        WHEN p_feature_name = 'sso' THEN sp.sso_enabled
        WHEN p_feature_name = 'api_access' THEN sp.api_access
        WHEN p_feature_name = 'custom_integrations' THEN sp.custom_integrations
        ELSE true
      END as feature_enabled
    INTO v_plan_limits
    FROM subscription_plans sp
    WHERE sp.name = 'Starter' AND sp.is_active = true;
  END IF;

  -- Get current usage for monthly features
  IF p_feature_name IN ('validations', 'kpi_reports') THEN
    SELECT COALESCE(fu.usage_count, 0)
    INTO v_current_usage
    FROM feature_usage fu
    WHERE fu.user_id = p_user_id 
      AND fu.feature_name = p_feature_name
      AND fu.period_start = v_period_start;
  ELSIF p_feature_name = 'companies' THEN
    SELECT COUNT(*)::integer
    INTO v_current_usage
    FROM companies c
    WHERE c.user_id = p_user_id;
  END IF;

  -- Return results
  RETURN QUERY SELECT 
    CASE 
      WHEN v_plan_limits.feature_limit IS NULL THEN true  -- Unlimited
      WHEN p_feature_name IN ('vc_matching', 'sso', 'api_access', 'custom_integrations') THEN v_plan_limits.feature_enabled
      ELSE v_current_usage < v_plan_limits.feature_limit
    END as allowed,
    v_current_usage,
    COALESCE(v_plan_limits.feature_limit, 0) as limit_value,
    v_plan_limits.feature_limit IS NULL as unlimited;
END;
$$;

-- Function to track feature usage
CREATE OR REPLACE FUNCTION track_feature_usage(
  p_user_id uuid,
  p_feature_name text,
  p_increment integer DEFAULT 1
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_period_start date := date_trunc('month', CURRENT_DATE);
  v_period_end date := (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::date;
BEGIN
  INSERT INTO feature_usage (user_id, feature_name, usage_count, period_start, period_end)
  VALUES (p_user_id, p_feature_name, p_increment, v_period_start, v_period_end)
  ON CONFLICT (user_id, feature_name, period_start)
  DO UPDATE SET 
    usage_count = feature_usage.usage_count + p_increment,
    updated_at = now();
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;

-- Function to get user subscription with plan details
CREATE OR REPLACE FUNCTION get_user_subscription_with_plan(p_user_id uuid)
RETURNS TABLE(
  subscription_id uuid,
  user_id uuid,
  plan_id uuid,
  plan_name text,
  plan_description text,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  billing_cycle text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  price_monthly numeric,
  price_yearly numeric,
  features jsonb
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id as subscription_id,
    us.user_id,
    us.plan_id,
    sp.name as plan_name,
    sp.description as plan_description,
    us.stripe_customer_id,
    us.stripe_subscription_id,
    us.status,
    us.billing_cycle,
    us.current_period_start,
    us.current_period_end,
    us.trial_start,
    us.trial_end,
    sp.price_monthly,
    sp.price_yearly,
    sp.features
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id
    AND us.status IN ('active', 'trialing', 'past_due')
  ORDER BY us.created_at DESC
  LIMIT 1;
END;
$$;