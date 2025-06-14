import { supabase } from './supabaseClient';
import { SubscriptionPlan, UserSubscription, FeatureLimit, BillingCycle } from '../types/subscription';

export class SubscriptionService {
  /**
   * Get all available subscription plans
   */
  static async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching subscription plans:', error);
        throw new Error(`Failed to fetch subscription plans: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('SubscriptionService.getPlans error:', error);
      throw error;
    }
  }

  /**
   * Get current user's subscription with plan details
   */
  static async getCurrentSubscription(userId: string) {
    try {
      const { data, error } = await supabase
        .rpc('get_user_subscription_with_plan', { p_user_id: userId });

      if (error) {
        console.error('Error fetching user subscription:', error);
        throw new Error(`Failed to fetch user subscription: ${error.message}`);
      }

      return data?.[0] || null;
    } catch (error) {
      console.error('SubscriptionService.getCurrentSubscription error:', error);
      throw error;
    }
  }

  /**
   * Create a Stripe checkout session
   */
  static async createCheckoutSession(
    planId: string,
    billingCycle: BillingCycle,
    userId: string,
    successUrl: string,
    cancelUrl: string
  ) {
    try {
      console.log('Creating checkout session:', { planId, billingCycle, userId });

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planId,
          billingCycle,
          userId,
          successUrl,
          cancelUrl
        }
      });

      if (error) {
        console.error('Checkout session error:', error);
        throw new Error(`Failed to create checkout session: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('SubscriptionService.createCheckoutSession error:', error);
      throw error;
    }
  }

  /**
   * Create a Stripe customer portal session
   */
  static async createPortalSession(userId: string, returnUrl: string) {
    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          userId,
          returnUrl
        }
      });

      if (error) {
        console.error('Portal session error:', error);
        throw new Error(`Failed to create portal session: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('SubscriptionService.createPortalSession error:', error);
      throw error;
    }
  }

  /**
   * Check feature limit for user
   */
  static async checkFeatureLimit(userId: string, featureName: string): Promise<FeatureLimit> {
    try {
      const { data, error } = await supabase
        .rpc('check_feature_limit', {
          p_user_id: userId,
          p_feature_name: featureName
        });

      if (error) {
        console.error('Error checking feature limit:', error);
        throw new Error(`Failed to check feature limit: ${error.message}`);
      }

      return data?.[0] || { allowed: false, current_usage: 0, limit_value: 0, unlimited: false };
    } catch (error) {
      console.error('SubscriptionService.checkFeatureLimit error:', error);
      throw error;
    }
  }

  /**
   * Track feature usage
   */
  static async trackFeatureUsage(userId: string, featureName: string, increment: number = 1): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('track_feature_usage', {
          p_user_id: userId,
          p_feature_name: featureName,
          p_increment: increment
        });

      if (error) {
        console.error('Error tracking feature usage:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('SubscriptionService.trackFeatureUsage error:', error);
      return false;
    }
  }

  /**
   * Get feature usage for current month
   */
  static async getFeatureUsage(userId: string, featureName?: string) {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7) + '-01'; // YYYY-MM-01

      let query = supabase
        .from('feature_usage')
        .select('*')
        .eq('user_id', userId)
        .eq('period_start', currentMonth);

      if (featureName) {
        query = query.eq('feature_name', featureName);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching feature usage:', error);
        throw new Error(`Failed to fetch feature usage: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('SubscriptionService.getFeatureUsage error:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  static async cancelSubscription(userId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { userId }
      });

      if (error) {
        console.error('Cancel subscription error:', error);
        throw new Error(`Failed to cancel subscription: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('SubscriptionService.cancelSubscription error:', error);
      throw error;
    }
  }

  /**
   * Resume subscription
   */
  static async resumeSubscription(userId: string) {
    try {
      const { data, error } = await supabase.functions.invoke('resume-subscription', {
        body: { userId }
      });

      if (error) {
        console.error('Resume subscription error:', error);
        throw new Error(`Failed to resume subscription: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('SubscriptionService.resumeSubscription error:', error);
      throw error;
    }
  }
}