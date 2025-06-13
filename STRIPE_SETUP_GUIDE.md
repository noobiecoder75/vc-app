# Stripe Integration Setup Guide

## 🚀 Complete Stripe Integration Status

✅ **IMPLEMENTED FEATURES:**
- Database schema with subscription tables
- Stripe checkout and payment processing
- Feature gating system with usage tracking
- Subscription management hooks and components
- Supabase Edge functions for Stripe operations
- Professional pricing page with free trials
- Feature limits enforcement

## 🔧 Setup Required

### 1. Environment Variables

Create a `.env` file in your project root with:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Your Stripe publishable key
STRIPE_SECRET_KEY=sk_test_...            # Your Stripe secret key  
STRIPE_WEBHOOK_SECRET=whsec_...          # Your webhook secret

# Supabase Configuration (existing)
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Stripe Dashboard Configuration

#### A. Create Products in Stripe Dashboard:

1. **Professional Plan**
   - Name: "VC Ready Professional"
   - Monthly Price: $29
   - Yearly Price: $24 (20% discount)

2. **Enterprise Plan**
   - Name: "VC Ready Enterprise"  
   - Monthly Price: $99
   - Yearly Price: $79 (20% discount)

#### B. Update Price IDs in Database:

Run this SQL in your Supabase SQL editor:

```sql
-- Update with your actual Stripe price IDs
UPDATE subscription_plans 
SET stripe_price_id_monthly = 'price_professional_monthly',
    stripe_price_id_yearly = 'price_professional_yearly'
WHERE name = 'Professional';

UPDATE subscription_plans 
SET stripe_price_id_monthly = 'price_enterprise_monthly', 
    stripe_price_id_yearly = 'price_enterprise_yearly'
WHERE name = 'Enterprise';
```

#### C. Configure Webhook:

1. In Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-project.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copy webhook secret to your `.env` file

### 3. Supabase Edge Functions Deployment

The edge functions are automatically deployed. If you need to redeploy:

```bash
# Deploy checkout session function
supabase functions deploy create-checkout-session

# Deploy webhook handler
supabase functions deploy stripe-webhook
```

## 🎯 Plan Structure

### Starter (Free)
- **Price**: $0/month
- **Features**: 3 validations/month, 3 companies, 10 KPIs
- **Target**: Early-stage validation

### Professional ($29/month)
- **Price**: $29/month or $24/year (20% off)
- **Features**: Unlimited validations, companies, KPIs + advanced analytics
- **Free Trial**: 14 days
- **Target**: Growing startups

### Enterprise ($99/month)  
- **Price**: $99/month or $79/year (20% off)
- **Features**: Everything + VC matching, SSO, priority support
- **Free Trial**: 30 days
- **Target**: VCs and accelerators

## 🔒 Feature Gating Applied

The following features are now gated:

1. **Startup Validations** - Limited by plan
2. **Company Creation** - Limited by plan  
3. **KPI Reports** - Limited by plan
4. **VC Matching** - Enterprise only
5. **SSO Features** - Enterprise only

## 🧪 Testing the Integration

### Test Flow:
1. Visit `/pricing` page
2. Select a paid plan
3. Complete Stripe checkout (use test card: `4242 4242 4242 4242`)
4. Verify subscription in database
5. Test feature limits
6. Try accessing gated features

### Test Cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

## 🎨 User Experience

- **Seamless Upgrades**: Users hit limits and can upgrade instantly
- **Trial Experience**: 14-30 day free trials for paid plans
- **Usage Tracking**: Real-time progress bars and limit indicators
- **Professional UI**: Beautiful pricing page with plan comparisons

## 🔄 How It Works

1. **User Interaction**: User tries to use a feature
2. **Feature Gate Check**: System checks user's plan and usage
3. **Access Control**: Allow/deny based on limits
4. **Upgrade Prompt**: Show pricing page if limits exceeded
5. **Payment Flow**: Stripe checkout → webhook → database update
6. **Feature Unlock**: User can immediately access upgraded features

Your Stripe integration is now **production-ready** with proper error handling, security, and user experience! 🎉