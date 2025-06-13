import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { SubscriptionService } from '../lib/subscriptionService';
import { FeatureLimit } from '../types/subscription';

/**
 * Hook to check if user has access to a feature based on their plan and usage
 */
export function useFeatureGate(featureName: string) {
  const { user } = useAuth();
  const [featureLimit, setFeatureLimit] = useState<FeatureLimit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkFeatureAccess = async () => {
      if (!user) {
        setFeatureLimit({ allowed: false, current_usage: 0, limit_value: 0, unlimited: false });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const limit = await SubscriptionService.checkFeatureLimit(user.id, featureName);
        setFeatureLimit(limit);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check feature access');
        setFeatureLimit({ allowed: false, current_usage: 0, limit_value: 0, unlimited: false });
      } finally {
        setLoading(false);
      }
    };

    checkFeatureAccess();
  }, [user, featureName]);

  const refreshLimit = async () => {
    if (!user) return;
    
    try {
      const limit = await SubscriptionService.checkFeatureLimit(user.id, featureName);
      setFeatureLimit(limit);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh feature limit');
    }
  };

  return {
    allowed: featureLimit?.allowed || false,
    currentUsage: featureLimit?.current_usage || 0,
    limitValue: featureLimit?.limit_value || 0,
    unlimited: featureLimit?.unlimited || false,
    loading,
    error,
    refreshLimit
  };
}

/**
 * Hook that checks feature access and tracks usage when feature is used
 */
export function useFeatureGateWithUsage(featureName: string) {
  const { user } = useAuth();
  const featureGate = useFeatureGate(featureName);

  const useFeature = async (increment: number = 1): Promise<boolean> => {
    if (!user || !featureGate.allowed) {
      return false;
    }

    try {
      const success = await SubscriptionService.trackFeatureUsage(user.id, featureName, increment);
      if (success) {
        // Refresh the limit to get updated usage
        await featureGate.refreshLimit();
      }
      return success;
    } catch (error) {
      console.error('Error tracking feature usage:', error);
      return false;
    }
  };

  return {
    ...featureGate,
    useFeature
  };
}