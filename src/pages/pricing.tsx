import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import GlowingCard from '../components/advanced/GlowingCard';
import AnimatedCounter from '../components/advanced/AnimatedCounter';
import ParticleBackground from '../components/advanced/ParticleBackground';
import MorphingButton from '../components/advanced/MorphingButton';
import InsightTooltip from '../components/InsightTooltip';
import { SubscriptionService } from '../lib/subscriptionService';
import { SubscriptionPlan, BillingCycle } from '../types/subscription';
import { useAuth } from '../hooks/useAuth';
import getStripe from '../lib/stripeClient';
import { 
  ArrowLeft, 
  Check, 
  Star, 
  Zap, 
  Building2, 
  BarChart3, 
  Users, 
  Shield, 
  Sparkles,
  Crown,
  Target,
  Globe,
  Brain,
  Award,
  Rocket,
  TrendingUp,
  FileText,
  Phone,
  Mail,
  Loader2,
  CheckCircle
} from 'lucide-react';

const PricingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if we're returning from auth
  const authSuccess = searchParams.get('auth') === 'success';

  useEffect(() => {
    loadPlans();
  }, []);

  // Handle auth success and plan selection
  useEffect(() => {
    if (authSuccess && user) {
      console.log('✅ Auth successful, checking for selected plan...');
      const selectedPlanData = localStorage.getItem('selectedPlan');
      
      if (selectedPlanData) {
        try {
          const { planId, billingCycle: savedBillingCycle } = JSON.parse(selectedPlanData);
          const plan = plans.find(p => p.id === planId);
          
          if (plan) {
            console.log('🎯 Resuming plan selection for:', plan.name);
            setBillingCycle(savedBillingCycle);
            
            // Auto-trigger plan selection
            setTimeout(() => {
              handlePlanSelect(plan);
            }, 1000);
          }
          
          // Clear the stored plan
          localStorage.removeItem('selectedPlan');
        } catch (error) {
          console.error('❌ Error parsing stored plan:', error);
          localStorage.removeItem('selectedPlan');
        }
      }
    }
  }, [authSuccess, user, plans]);

  const loadPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const plansData = await SubscriptionService.getPlans();
      setPlans(plansData);
    } catch (err) {
      console.error('Error loading plans:', err);
      setError(err instanceof Error ? err.message : 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const handlePlanSelect = async (plan: SubscriptionPlan) => {
    if (!user) {
      // Save the selected plan and redirect to sign up
      localStorage.setItem('selectedPlan', JSON.stringify({ planId: plan.id, billingCycle }));
      console.log('💾 Saved plan selection, redirecting to auth');
      navigate('/auth?redirect=pricing');
      return;
    }

    setSelectedPlan(plan.id);
    
    try {
      if (plan.price_monthly === 0) {
        // Free plan - create subscription record and redirect
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/dashboard?plan=starter');
        return;
      }

      if (plan.name === 'Enterprise') {
        // Enterprise plan - open contact email
        await new Promise(resolve => setTimeout(resolve, 1000));
        window.open('mailto:sales@vcready.com?subject=Enterprise Plan Inquiry&body=Hi! I\'m interested in the Enterprise plan. Please reach out to discuss pricing and features.', '_blank');
        setSelectedPlan(null);
        return;
      }

      // Create Stripe checkout session
      const checkoutData = await SubscriptionService.createCheckoutSession(
        plan.id,
        billingCycle,
        user.id,
        `${window.location.origin}/dashboard?success=true&plan=${plan.name.toLowerCase()}`,
        `${window.location.origin}/pricing?canceled=true`
      );

      // Redirect to Stripe Checkout
      const stripe = await getStripe();
      if (stripe && checkoutData.sessionId) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: checkoutData.sessionId,
        });
        
        if (error) {
          console.error('Stripe checkout error:', error);
          throw new Error(error.message);
        }
      } else if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setSelectedPlan(null);
    }
  };

  const getPriceDisplay = (plan: SubscriptionPlan) => {
    const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const getSavingsDisplay = (plan: SubscriptionPlan) => {
    if (plan.price_monthly === 0 || billingCycle === 'monthly') return '';
    const monthlyCost = plan.price_monthly * 12;
    const yearlyCost = plan.price_yearly;
    const savings = Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
    return savings > 0 ? `Save ${savings}%` : '';
  };

  const getPlanIcon = (plan: SubscriptionPlan) => {
    if (plan.name === 'Starter') return Rocket;
    if (plan.name === 'Professional') return TrendingUp;
    if (plan.name === 'Enterprise') return Crown;
    return Building2;
  };

  const getPlanGlowColor = (plan: SubscriptionPlan) => {
    if (plan.name === 'Starter') return 'emerald';
    if (plan.name === 'Professional') return 'blue';
    if (plan.name === 'Enterprise') return 'purple';
    return 'blue';
  };

  const isPopular = (plan: SubscriptionPlan) => {
    return plan.name === 'Professional';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading pricing plans...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-4">Error loading pricing plans</div>
            <p className="text-sm text-gray-600 mb-4">{error}</p>
            <Button onClick={loadPlans}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground particleCount={30} color="#3B82F6" speed={0.3} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Choose Your Plan</span>
              <Badge variant="success" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                Free Trial Available
              </Badge>
            </div>
          </motion.div>

          {/* Auth Success Message */}
          {authSuccess && (
            <motion.div 
              variants={itemVariants}
              className="mb-6"
            >
              <div className="inline-flex items-center space-x-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-700">
                  Welcome! Complete your plan selection below.
                </span>
              </div>
            </motion.div>
          )}
          
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6"
            variants={itemVariants}
          >
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            variants={itemVariants}
          >
            Choose the perfect plan for your startup journey. From idea validation to VC matching, 
            we've got you covered at every stage.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div 
            className="flex items-center justify-center space-x-4 mb-12"
            variants={itemVariants}
          >
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                billingCycle === 'yearly' ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <Badge variant="success" className="ml-2">
                Save up to 20%
              </Badge>
            )}
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {plans.map((plan, index) => {
            const IconComponent = getPlanIcon(plan);
            const popular = isPopular(plan);
            
            return (
              <motion.div key={plan.id} variants={itemVariants}>
                <InsightTooltip
                  title={plan.name}
                  description={plan.description || ''}
                  insight={`Perfect for ${plan.name === 'Starter' ? 'early-stage validation' : plan.name === 'Professional' ? 'growing startups' : 'enterprise operations'}`}
                  actionable={`${plan.features.length} features included`}
                >
                  <GlowingCard 
                    glowColor={getPlanGlowColor(plan) as any}
                    intensity={popular ? "high" : "medium"}
                    className="cursor-help h-full"
                  >
                    <Card className={`relative h-full ${popular ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : ''}`}>
                      {popular && (
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-blue-600 text-white px-4 py-1">
                            <Star className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader className="text-center pb-8">
                        <div className="flex items-center justify-center mb-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            plan.name === 'Starter' ? 'bg-emerald-100' : 
                            plan.name === 'Professional' ? 'bg-blue-100' : 'bg-purple-100'
                          }`}>
                            <IconComponent className={`w-6 h-6 ${
                              plan.name === 'Starter' ? 'text-emerald-600' : 
                              plan.name === 'Professional' ? 'text-blue-600' : 'text-purple-600'
                            }`} />
                          </div>
                        </div>
                        
                        <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                          {plan.name}
                        </CardTitle>
                        
                        <p className="text-gray-600 mb-6">{plan.description}</p>
                        
                        <div className="mb-6">
                          <div className="flex items-baseline justify-center">
                            <span className="text-5xl font-bold text-gray-900">
                              {getPriceDisplay(plan)}
                            </span>
                            {plan.price_monthly > 0 && (
                              <span className="text-gray-600 ml-2">
                                /{billingCycle === 'monthly' ? 'month' : 'year'}
                              </span>
                            )}
                          </div>
                          {getSavingsDisplay(plan) && (
                            <Badge variant="success" className="mt-2">
                              {getSavingsDisplay(plan)}
                            </Badge>
                          )}
                          {plan.name === 'Professional' && (
                            <p className="text-sm text-blue-600 mt-2 font-medium">
                              14-day free trial
                            </p>
                          )}
                          {plan.name === 'Enterprise' && (
                            <p className="text-sm text-purple-600 mt-2 font-medium">
                              30-day free trial
                            </p>
                          )}
                        </div>

                        <MorphingButton
                          variant={popular ? "gradient" : "outline"}
                          className={`w-full py-3 ${popular ? 'hover-glow' : ''}`}
                          disabled={selectedPlan === plan.id}
                          successText={plan.price_monthly === 0 ? "Welcome!" : plan.name === 'Enterprise' ? "We'll be in touch!" : "Starting trial..."}
                          onClick={() => handlePlanSelect(plan)}
                        >
                          {selectedPlan === plan.id ? (
                            <div className="flex items-center">
                              <Loader2 className="w-4 h-4 animate-spin mr-2" />
                              Processing...
                            </div>
                          ) : (
                            plan.price_monthly === 0 ? 'Get Started Free' :
                            plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'
                          )}
                        </MorphingButton>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                              <Check className="w-4 h-4 text-emerald-600 mr-2" />
                              What's included:
                            </h4>
                            <ul className="space-y-2">
                              {plan.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                                  <Check className="w-4 h-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </GlowingCard>
                </InsightTooltip>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Feature Comparison */}
        <motion.div 
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="emerald" intensity="medium">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 text-center flex items-center justify-center">
                    <Award className="w-6 h-6 text-emerald-600 mr-2" />
                    Compare Plans
                    <Badge variant="info" className="ml-2">
                      <Brain className="w-3 h-3 mr-1" />
                      AI-Powered
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-4 px-4 font-medium text-gray-900">Features</th>
                          {plans.map(plan => (
                            <th key={plan.id} className="text-center py-4 px-4 font-medium text-gray-900">
                              {plan.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { 
                            feature: 'Startup Validations', 
                            values: plans.map(p => p.max_validations_monthly ? `${p.max_validations_monthly}/month` : 'Unlimited')
                          },
                          { 
                            feature: 'Companies', 
                            values: plans.map(p => p.max_companies ? `${p.max_companies}` : 'Unlimited')
                          },
                          { 
                            feature: 'KPI Reports', 
                            values: plans.map(p => p.max_kpi_reports ? `${p.max_kpi_reports}` : 'Unlimited')
                          },
                          { 
                            feature: 'VC Matching', 
                            values: plans.map(p => p.vc_matching_enabled ? '✅' : '❌')
                          },
                          { 
                            feature: 'API Access', 
                            values: plans.map(p => p.api_access ? '✅' : '❌')
                          },
                          { 
                            feature: 'Priority Support', 
                            values: plans.map(p => p.priority_support ? '✅' : '❌')
                          },
                          { 
                            feature: 'SSO & Teams', 
                            values: plans.map(p => p.sso_enabled ? '✅' : '❌')
                          },
                          { 
                            feature: 'Custom Integrations', 
                            values: plans.map(p => p.custom_integrations ? '✅' : '❌')
                          }
                        ].map((row, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-gray-700">{row.feature}</td>
                            {row.values.map((value, valueIndex) => (
                              <td key={valueIndex} className="py-3 px-4 text-center text-gray-600">
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </GlowingCard>
          </motion.div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="purple" intensity="high">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-xl p-12 text-white text-center relative overflow-hidden">
                <ParticleBackground particleCount={20} color="#FFFFFF" speed={0.2} />
                
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-4">Ready to Get VC Ready?</h2>
                  <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                    Join thousands of successful founders who have raised capital with our platform. 
                    Start your free trial today and see the difference AI-powered insights can make.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <MorphingButton 
                      className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 hover-glow"
                      successText="Starting trial..."
                      onClick={() => {
                        const proPlan = plans.find(p => p.name === 'Professional');
                        if (proPlan) handlePlanSelect(proPlan);
                      }}
                    >
                      <Rocket className="w-5 h-5 mr-2" />
                      Start Free Trial
                    </MorphingButton>
                    
                    <Button 
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4 hover-glow"
                      asChild
                    >
                      <a href="mailto:sales@vcready.com?subject=Enterprise Demo Request">
                        <Phone className="w-5 h-5 mr-2" />
                        Book a Demo
                      </a>
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-6 mt-8 text-blue-100">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="text-sm">No Setup Fees</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="w-4 h-4 mr-2" />
                      <span className="text-sm">Cancel Anytime</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2" />
                      <span className="text-sm">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlowingCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPage;