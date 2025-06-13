import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import GlowingCard from '../components/advanced/GlowingCard';
import AnimatedCounter from '../components/advanced/AnimatedCounter';
import ParticleBackground from '../components/advanced/ParticleBackground';
import MorphingButton from '../components/advanced/MorphingButton';
import InsightTooltip from '../components/InsightTooltip';
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
  Mail
} from 'lucide-react';

const PricingPage = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      description: 'Perfect for exploring your startup idea',
      monthlyPrice: 0,
      yearlyPrice: 0,
      popular: false,
      badge: 'Free Forever',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      glowColor: 'emerald',
      features: [
        '3 startup validations per month',
        'Basic market analysis',
        'Competitor research',
        '10 KPI tracking metrics',
        'Standard email support',
        'Basic insights dashboard',
        'PDF export of reports'
      ],
      limitations: [
        'No VC matching',
        'No advanced analytics',
        'No priority support'
      ],
      cta: 'Get Started Free',
      highlight: false
    },
    {
      id: 'pro',
      name: 'Professional',
      description: 'For serious entrepreneurs ready to scale',
      monthlyPrice: 29,
      yearlyPrice: 24,
      popular: true,
      badge: 'Most Popular',
      badgeColor: 'bg-blue-100 text-blue-800',
      glowColor: 'blue',
      features: [
        'Unlimited startup validations',
        'Advanced market size analysis',
        'Comprehensive competitor tracking',
        'Unlimited KPI metrics',
        'Priority email & chat support',
        'Advanced analytics dashboard',
        'Custom pitch deck builder',
        'Industry benchmarking',
        'API access for integrations',
        'White-label reports'
      ],
      limitations: [
        'No VC matching',
        'No fundraising tools'
      ],
      cta: 'Start Pro Trial',
      highlight: true,
      trial: '14-day free trial'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For VCs and accelerators managing portfolios',
      monthlyPrice: 99,
      yearlyPrice: 79,
      popular: false,
      badge: 'Full Platform',
      badgeColor: 'bg-purple-100 text-purple-800',
      glowColor: 'purple',
      features: [
        'Everything in Professional',
        'VC matching & warm introductions',
        'Advanced fundraising tools',
        'Portfolio management dashboard',
        'SSO & team collaboration',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security & compliance',
        'API rate limits removed',
        'Custom branding options',
        'Priority phone support',
        'Quarterly business reviews'
      ],
      limitations: [],
      cta: 'Contact Sales',
      highlight: false,
      trial: '30-day free trial'
    }
  ];

  const handlePlanSelect = async (planId: string) => {
    setSelectedPlan(planId);
    
    if (planId === 'free') {
      // Handle free plan signup
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = '/upload';
    } else if (planId === 'enterprise') {
      // Handle enterprise contact
      await new Promise(resolve => setTimeout(resolve, 1000));
      window.location.href = 'mailto:sales@vcready.com?subject=Enterprise Plan Inquiry';
    } else {
      // Handle Stripe checkout for Pro plan
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Redirecting to Stripe checkout for ${planId} plan`);
      // In real implementation, this would redirect to Stripe
    }
  };

  const getPriceDisplay = (plan: typeof plans[0]) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    if (price === 0) return 'Free';
    return `$${price}`;
  };

  const getSavingsDisplay = (plan: typeof plans[0]) => {
    if (plan.monthlyPrice === 0 || billingCycle === 'monthly') return '';
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice * 12;
    const savings = Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
    return `Save ${savings}%`;
  };

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
                14-Day Free Trial
              </Badge>
            </div>
          </motion.div>
          
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
          {plans.map((plan, index) => (
            <motion.div key={plan.id} variants={itemVariants}>
              <InsightTooltip
                title={plan.name}
                description={plan.description}
                insight={`Perfect for ${plan.id === 'free' ? 'early-stage validation' : plan.id === 'pro' ? 'growing startups' : 'enterprise operations'}`}
                actionable={`${plan.features.length} features included`}
              >
                <GlowingCard 
                  glowColor={plan.glowColor as any}
                  intensity={plan.highlight ? "high" : "medium"}
                  className="cursor-help h-full"
                >
                  <Card className={`relative h-full ${plan.highlight ? 'ring-2 ring-blue-500 shadow-2xl scale-105' : ''}`}>
                    {plan.popular && (
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
                          plan.id === 'free' ? 'bg-emerald-100' : 
                          plan.id === 'pro' ? 'bg-blue-100' : 'bg-purple-100'
                        }`}>
                          {plan.id === 'free' ? (
                            <Rocket className={`w-6 h-6 text-emerald-600`} />
                          ) : plan.id === 'pro' ? (
                            <TrendingUp className={`w-6 h-6 text-blue-600`} />
                          ) : (
                            <Crown className={`w-6 h-6 text-purple-600`} />
                          )}
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
                          {plan.monthlyPrice > 0 && (
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
                        {plan.trial && (
                          <p className="text-sm text-blue-600 mt-2 font-medium">
                            {plan.trial}
                          </p>
                        )}
                      </div>

                      <MorphingButton
                        variant={plan.highlight ? "gradient" : "outline"}
                        className={`w-full py-3 ${plan.highlight ? 'hover-glow' : ''}`}
                        successText={plan.id === 'free' ? "Welcome!" : plan.id === 'enterprise' ? "We'll be in touch!" : "Trial Started!"}
                        onClick={() => handlePlanSelect(plan.id)}
                        disabled={selectedPlan === plan.id}
                      >
                        {selectedPlan === plan.id ? (
                          <div className="flex items-center">
                            <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
                            Processing...
                          </div>
                        ) : (
                          plan.cta
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
                        
                        {plan.limitations.length > 0 && (
                          <div className="border-t border-gray-200 pt-4">
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Not included:</h5>
                            <ul className="space-y-1">
                              {plan.limitations.map((limitation, limitIndex) => (
                                <li key={limitIndex} className="flex items-start text-sm text-gray-400">
                                  <span className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-300">×</span>
                                  {limitation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </GlowingCard>
              </InsightTooltip>
            </motion.div>
          ))}
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
                          <th className="text-center py-4 px-4 font-medium text-gray-900">Starter</th>
                          <th className="text-center py-4 px-4 font-medium text-gray-900">Professional</th>
                          <th className="text-center py-4 px-4 font-medium text-gray-900">Enterprise</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { feature: 'Startup Validations', starter: '3/month', pro: 'Unlimited', enterprise: 'Unlimited' },
                          { feature: 'KPI Tracking', starter: '10 metrics', pro: 'Unlimited', enterprise: 'Unlimited' },
                          { feature: 'Market Analysis', starter: 'Basic', pro: 'Advanced', enterprise: 'Advanced' },
                          { feature: 'Competitor Research', starter: 'Standard', pro: 'Comprehensive', enterprise: 'Comprehensive' },
                          { feature: 'Pitch Deck Builder', starter: '❌', pro: '✅', enterprise: '✅' },
                          { feature: 'VC Matching', starter: '❌', pro: '❌', enterprise: '✅' },
                          { feature: 'API Access', starter: '❌', pro: '✅', enterprise: '✅' },
                          { feature: 'Priority Support', starter: '❌', pro: '✅', enterprise: '✅' },
                          { feature: 'SSO & Teams', starter: '❌', pro: '❌', enterprise: '✅' },
                          { feature: 'Custom Integrations', starter: '❌', pro: '❌', enterprise: '✅' }
                        ].map((row, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-gray-700">{row.feature}</td>
                            <td className="py-3 px-4 text-center text-gray-600">{row.starter}</td>
                            <td className="py-3 px-4 text-center text-gray-600">{row.pro}</td>
                            <td className="py-3 px-4 text-center text-gray-600">{row.enterprise}</td>
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

        {/* FAQ Section */}
        <motion.div 
          className="mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">Everything you need to know about our pricing and plans</p>
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "Can I change plans anytime?",
                answer: "Yes! You can upgrade or downgrade your plan at any time. Changes are prorated and take effect immediately."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, Mastercard, American Express) and support international payments."
              },
              {
                question: "Is there a free trial?",
                answer: "Yes! Pro and Enterprise plans come with 14-day and 30-day free trials respectively. No credit card required."
              },
              {
                question: "What happens to my data if I cancel?",
                answer: "Your data is safely stored for 90 days after cancellation. You can export all your reports and data anytime."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 30-day money-back guarantee for all paid plans. Contact support for assistance."
              },
              {
                question: "Can I get a custom Enterprise plan?",
                answer: "Absolutely! Contact our sales team to discuss custom features, pricing, and implementation support."
              }
            ].map((faq, index) => (
              <motion.div key={index} variants={itemVariants}>
                <GlowingCard glowColor="blue" intensity="low">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-600 text-sm">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </GlowingCard>
              </motion.div>
            ))}
          </div>
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
                      successText="Trial Started!"
                      onClick={() => handlePlanSelect('pro')}
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