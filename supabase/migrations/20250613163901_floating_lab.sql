/*
  # Subscription and Feature Gating System

  1. New Tables
    - `subscription_plans` - Available subscription plans with pricing and features
    - `user_subscriptions` - User subscription records with Stripe integration
    - `feature_usage` - Monthly feature usage tracking per user
    
  2. Security
    - Enable RLS on all subscription tables
    - Policies for users to manage their own subscriptions
    - Admin policies for plan management
    
  3. Features
    - Stripe integration fields for payment processing
    - Feature usage tracking and limits
    - Plan comparison and upgrade flows
*/

-- subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price_monthly numeric NOT NULL DEFAULT 0,
  price_yearly numeric NOT NULL DEFAULT 0,
  stripe_price_id_monthly text,
  stripe_price_id_yearly text,
  features jsonb NOT NULL DEFAULT '{}',
  max_companies integer DEFAULT NULL, -- NULL means unlimited
  max_validations_monthly integer DEFAULT NULL, -- NULL means unlimited
  max_kpi_reports integer DEFAULT NULL, -- NULL means unlimited
  vc_matching_enabled boolean DEFAULT false,
  sso_enabled boolean DEFAULT false,
  priority_support boolean DEFAULT false,
  api_access boolean DEFAULT false,
  custom_integrations boolean DEFAULT false,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_id uuid REFERENCES subscription_plans(id),
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_price_id text,
  status text CHECK (status IN ('active', 'trialing', 'past_due', 'canceled', 'unpaid', 'incomplete', 'incomplete_expired', 'paused')) DEFAULT 'active',
  billing_cycle text CHECK (billing_cycle IN ('monthly', 'yearly')) DEFAULT 'monthly',
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  trial_start timestamp with time zone,
  trial_end timestamp with time zone,
  canceled_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- feature_usage table
CREATE TABLE IF NOT EXISTS feature_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  feature_name text NOT NULL,
  usage_count integer DEFAULT 0,
  period_start date NOT NULL,
  period_end date NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, feature_name, period_start)
);

-- Enable RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscription_plans (public read)
CREATE POLICY "Subscription plans are publicly viewable" 
  ON subscription_plans FOR SELECT 
  TO authenticated, anon 
  USING (is_active = true);

-- RLS Policies for user_subscriptions (users can manage their own)
CREATE POLICY "Users can view their own subscription" 
  ON user_subscriptions FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
  ON user_subscriptions FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscription" 
  ON user_subscriptions FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- RLS Policies for feature_usage (users can manage their own)
CREATE POLICY "Users can view their own feature usage" 
  ON feature_usage FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feature usage" 
  ON feature_usage FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own feature usage" 
  ON feature_usage FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (
  name, 
  description, 
  price_monthly, 
  price_yearly,
  features,
  max_companies,
  max_validations_monthly,
  max_kpi_reports,
  vc_matching_enabled,
  sso_enabled,
  priority_support,
  api_access,
  custom_integrations,
  sort_order
) VALUES 
(
  'Starter',
  'Perfect for exploring your startup idea',
  0,
  0,
  '["3 startup validations per month", "Basic market analysis", "Competitor research", "10 KPI tracking metrics", "Standard email support", "Basic insights dashboard", "PDF export of reports"]',
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
  'For serious entrepreneurs ready to scale',
  29,
  24,
  '["Unlimited startup validations", "Advanced market size analysis", "Comprehensive competitor tracking", "Unlimited KPI metrics", "Priority email & chat support", "Advanced analytics dashboard", "Custom pitch deck builder", "Industry benchmarking", "API access for integrations", "White-label reports"]',
  NULL,
  NULL,
  NULL,
  false,
  false,
  true,
  true,
  false,
  2
),
(
  'Enterprise',
  'For VCs and accelerators managing portfolios',
  99,
  79,
  '["Everything in Professional", "VC matching & warm introductions", "Advanced fundraising tools", "Portfolio management dashboard", "SSO & team collaboration", "Dedicated account manager", "Custom integrations", "Advanced security & compliance", "API rate limits removed", "Custom branding options", "Priority phone support", "Quarterly business reviews"]',
  NULL,
  NULL,
  NULL,
  true,
  true,
  true,
  true,
  true,
  3
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_feature_usage_user_period ON feature_usage(user_id, period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_feature_usage_feature_name ON feature_usage(feature_name);

-- Function to get current user subscription with plan details
CREATE OR REPLACE FUNCTION get_user_subscription_with_plan(p_user_id uuid)
RETURNS TABLE (
  subscription_id uuid,
  plan_name text,
  plan_description text,
  status text,
  billing_cycle text,
  current_period_end timestamp with time zone,
  trial_end timestamp with time zone,
  max_companies integer,
  max_validations_monthly integer,
  max_kpi_reports integer,
  vc_matching_enabled boolean,
  sso_enabled boolean,
  priority_support boolean,
  api_access boolean,
  custom_integrations boolean
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id,
    sp.name,
    sp.description,
    us.status,
    us.billing_cycle,
    us.current_period_end,
    us.trial_end,
    sp.max_companies,
    sp.max_validations_monthly,
    sp.max_kpi_reports,
    sp.vc_matching_enabled,
    sp.sso_enabled,
    sp.priority_support,
    sp.api_access,
    sp.custom_integrations
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track feature usage
CREATE OR REPLACE FUNCTION track_feature_usage(
  p_user_id uuid,
  p_feature_name text,
  p_increment integer DEFAULT 1
) RETURNS boolean AS $$
DECLARE
  current_period_start date := date_trunc('month', CURRENT_DATE);
  current_period_end date := (date_trunc('month', CURRENT_DATE) + interval '1 month - 1 day')::date;
BEGIN
  INSERT INTO feature_usage (user_id, feature_name, usage_count, period_start, period_end)
  VALUES (p_user_id, p_feature_name, p_increment, current_period_start, current_period_end)
  ON CONFLICT (user_id, feature_name, period_start)
  DO UPDATE SET 
    usage_count = feature_usage.usage_count + p_increment,
    updated_at = now();
    
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check feature limits
CREATE OR REPLACE FUNCTION check_feature_limit(
  p_user_id uuid,
  p_feature_name text
) RETURNS TABLE (
  allowed boolean,
  current_usage integer,
  limit_value integer,
  unlimited boolean
) AS $$
DECLARE
  current_period_start date := date_trunc('month', CURRENT_DATE);
  user_limit integer;
  current_usage_count integer := 0;
  is_unlimited boolean := false;
BEGIN
  -- Get current usage
  SELECT COALESCE(usage_count, 0) INTO current_usage_count
  FROM feature_usage 
  WHERE user_id = p_user_id 
    AND feature_name = p_feature_name 
    AND period_start = current_period_start;

  -- Get user's limit based on their subscription
  SELECT 
    CASE 
      WHEN p_feature_name = 'validations' THEN sp.max_validations_monthly
      WHEN p_feature_name = 'companies' THEN sp.max_companies
      WHEN p_feature_name = 'kpi_reports' THEN sp.max_kpi_reports
      ELSE NULL
    END INTO user_limit
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id AND us.status IN ('active', 'trialing');

  -- Check if unlimited (NULL limit)
  is_unlimited := (user_limit IS NULL);
  
  -- If no subscription found, use free tier limits
  IF user_limit IS NULL AND NOT is_unlimited THEN
    CASE p_feature_name
      WHEN 'validations' THEN user_limit := 3;
      WHEN 'companies' THEN user_limit := 3;
      WHEN 'kpi_reports' THEN user_limit := 10;
      ELSE user_limit := 0;
    END CASE;
    is_unlimited := false;
  END IF;

  RETURN QUERY SELECT 
    (is_unlimited OR current_usage_count < user_limit) as allowed,
    current_usage_count as current_usage,
    COALESCE(user_limit, 0) as limit_value,
    is_unlimited as unlimited;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;