# 🚀 Stripe Integration Setup Instructions

## 📋 Prerequisites
- Stripe account (test mode for development)
- Supabase project set up
- Access to your Supabase dashboard

## 🔧 Step 1: Environment Variables

Create a `.env` file in your project root with these variables:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...  # Get from Stripe Dashboard
STRIPE_SECRET_KEY=sk_test_51...            # Get from Stripe Dashboard  
STRIPE_WEBHOOK_SECRET=whsec_...            # Create webhook first (Step 3)

# Supabase Configuration (you should already have these)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI (optional - for AI features)
VITE_OPENAI_API_KEY=sk-...
```

## 🛍️ Step 2: Create Products in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Products
2. Create these products:

### Professional Plan
- **Name**: "VC Ready Professional"
- **Monthly Price**: $29.00
- **Yearly Price**: $24.00 (save the price IDs)

### Enterprise Plan  
- **Name**: "VC Ready Enterprise"
- **Monthly Price**: $99.00
- **Yearly Price**: $79.00 (save the price IDs)

## 🔗 Step 3: Update Database with Stripe Price IDs

Run this SQL in your Supabase SQL Editor (replace with your actual price IDs):

```sql
-- Update Professional plan with your Stripe price IDs
UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_YOUR_PROFESSIONAL_MONTHLY_PRICE_ID',
  stripe_price_id_yearly = 'price_YOUR_PROFESSIONAL_YEARLY_PRICE_ID'
WHERE name = 'Professional';

-- Update Enterprise plan with your Stripe price IDs  
UPDATE subscription_plans 
SET 
  stripe_price_id_monthly = 'price_YOUR_ENTERPRISE_MONTHLY_PRICE_ID',
  stripe_price_id_yearly = 'price_YOUR_ENTERPRISE_YEARLY_PRICE_ID'
WHERE name = 'Enterprise';
```

## 🪝 Step 4: Set Up Stripe Webhook

1. In Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. **Endpoint URL**: `https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/stripe-webhook`
4. **Events to send**:
   - `customer.subscription.created`
   - `customer.subscription.updated` 
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook secret and add it to your `.env` file

## 🧪 Step 5: Test the Integration

### Test Cards (use these in Stripe test mode):
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

### Test Flow:
1. Visit `/pricing` page
2. Click "Start Free Trial" on Professional plan
3. Complete Stripe checkout with test card
4. Verify subscription appears in Supabase `user_subscriptions` table
5. Test feature limits in the app

## 🔍 Verification Checklist

✅ Environment variables are set  
✅ Stripe products created with correct prices  
✅ Database updated with Stripe price IDs  
✅ Webhook endpoint configured  
✅ Test payment completed successfully  
✅ Subscription record created in database  
✅ Feature gating works correctly  

## 🎯 What's Included

### ✨ Features Now Available:
- **Real Stripe Integration**: Full payment processing with Stripe Checkout
- **Subscription Management**: Automatic subscription lifecycle handling
- **Feature Gating**: Users hit limits and can upgrade instantly
- **Free Trials**: 14 days for Professional, 30 days for Enterprise
- **Webhook Handling**: Automatic subscription status updates
- **Error Handling**: Graceful error handling throughout the flow

### 🔒 Security Features:
- **Row Level Security**: Database access controlled by user authentication
- **Webhook Verification**: Stripe webhook signatures verified
- **Environment Variables**: Sensitive keys stored securely
- **User Isolation**: Each user can only access their own data

## 🚨 Important Notes

- **Test Mode**: Make sure you're using Stripe test keys during development
- **Webhook URL**: Must be publicly accessible (Supabase functions are perfect)
- **Price IDs**: Must match exactly between Stripe and your database
- **Environment Variables**: Never commit `.env` file to version control

## 🎉 You're All Set!

Your Stripe integration is now fully functional! Users can:
- Start free trials
- Upgrade/downgrade plans  
- Experience feature limits
- Complete payments securely
- Manage subscriptions

The app will automatically handle all subscription states and feature access based on the user's current plan.