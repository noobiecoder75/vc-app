import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { useFeatureGate } from '../hooks/useFeatureGate';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { 
  Lock, 
  Zap, 
  TrendingUp, 
  Crown,
  ArrowRight,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

interface FeatureGateProps {
  children: React.ReactNode;
  featureName: string;
  featureDisplayName: string;
  requiredPlan?: string;
  showUsage?: boolean;
  fallback?: React.ReactNode;
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  children,
  featureName,
  featureDisplayName,
  requiredPlan = 'Professional',
  showUsage = true,
  fallback
}) => {
  const { user } = useAuth();
  const { allowed, currentUsage, limitValue, unlimited, loading } = useFeatureGate(featureName);

  // If user is not authenticated, show sign-in prompt
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-center p-8"
      >
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">
              Please sign in to access {featureDisplayName.toLowerCase()}.
            </p>
            <Button className="w-full" asChild>
              <Link to="/auth">
                Sign In to Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // If loading, show skeleton
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  // If allowed, show the feature
  if (allowed) {
    return (
      <div className="relative">
        {children}
        {showUsage && !unlimited && (
          <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>{featureDisplayName} Usage</span>
              <span>{currentUsage} / {limitValue}</span>
            </div>
            <Progress 
              value={limitValue > 0 ? (currentUsage / limitValue) * 100 : 0} 
              className="h-2"
            />
            {currentUsage / limitValue > 0.8 && (
              <div className="flex items-center mt-2 text-amber-600">
                <AlertTriangle className="w-3 h-3 mr-1" />
                <span className="text-xs">Approaching limit - consider upgrading</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // If not allowed, show upgrade prompt or fallback
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center p-8"
    >
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Crown className="w-6 h-6 text-purple-600" />
          </div>
          <CardTitle>Upgrade Required</CardTitle>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <Badge variant="outline">{requiredPlan} Plan</Badge>
            <Badge variant="success">
              <Zap className="w-3 h-3 mr-1" />
              Unlock Now
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            {unlimited ? 
              `You've reached your limit for ${featureDisplayName.toLowerCase()}. Upgrade to ${requiredPlan} for unlimited access.` :
              `You've used ${currentUsage} of ${limitValue} ${featureDisplayName.toLowerCase()} this month. Upgrade for more.`
            }
          </p>
          
          {!unlimited && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Monthly Usage</span>
                <span>{currentUsage} / {limitValue}</span>
              </div>
              <Progress value={(currentUsage / limitValue) * 100} className="h-2" />
            </div>
          )}

          <div className="space-y-2 mb-6">
            <div className="flex items-center text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Unlimited {featureDisplayName.toLowerCase()}</span>
            </div>
            <div className="flex items-center text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Advanced analytics & insights</span>
            </div>
            <div className="flex items-center text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span>Priority support</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" asChild>
              <Link to="/pricing">
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade to {requiredPlan}
              </Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/pricing">
                View All Plans
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FeatureGate;