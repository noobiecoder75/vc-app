import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import FileUpload from '../components/FileUpload';
import GlowingCard from '../components/advanced/GlowingCard';
import ParticleBackground from '../components/advanced/ParticleBackground';
import AnimatedCounter from '../components/advanced/AnimatedCounter';
import MorphingButton from '../components/advanced/MorphingButton';
import InsightTooltip from '../components/InsightTooltip';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Lightbulb, FileText, Zap, Brain, Target, TrendingUp, Sparkles, CheckCircle, Star, Award } from 'lucide-react';

const UploadPage = () => {
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

  const benefits = [
    {
      icon: Lightbulb,
      title: "Market Analysis",
      description: "Comprehensive market size assessment, growth trends, and opportunity identification",
      stats: { value: 50, suffix: "B+", label: "Market Size Analyzed" },
      glowColor: "blue"
    },
    {
      icon: FileText,
      title: "Competitive Landscape",
      description: "Detailed competitor analysis, positioning insights, and differentiation opportunities",
      stats: { value: 1000, suffix: "+", label: "Competitors Tracked" },
      glowColor: "purple"
    },
    {
      icon: Zap,
      title: "Action Plan",
      description: "Concrete next steps, validation strategies, and recommended resources",
      stats: { value: 95, suffix: "%", label: "Success Rate" },
      glowColor: "emerald"
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Upload Your Idea",
      description: "Share documents, pitch decks, or business plans",
      icon: FileText,
      color: "blue"
    },
    {
      step: 2,
      title: "AI Analysis",
      description: "Our AI analyzes 50+ data points in real-time",
      icon: Brain,
      color: "purple"
    },
    {
      step: 3,
      title: "Get Insights",
      description: "Receive comprehensive validation report",
      icon: Target,
      color: "emerald"
    },
    {
      step: 4,
      title: "Take Action",
      description: "Follow personalized recommendations",
      icon: TrendingUp,
      color: "orange"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground particleCount={30} color="#3B82F6" speed={0.3} />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-12"
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
              <span className="text-sm font-medium text-gray-700">AI-Powered Validation</span>
              <Badge variant="success" className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Free
              </Badge>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl font-bold text-gray-900 mb-4"
            variants={itemVariants}
          >
            Upload Your <span className="gradient-text">Startup Idea</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Share your startup concept and get instant AI-powered analysis with market insights, 
            competitive landscape, and validation recommendations.
          </motion.p>
        </motion.div>

        {/* Process Steps */}
        <motion.div 
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 
            className="text-2xl font-semibold text-gray-900 text-center mb-8"
            variants={itemVariants}
          >
            How It Works
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div key={index} variants={itemVariants}>
                <InsightTooltip
                  title={step.title}
                  description={step.description}
                  insight={`Step ${step.step} of our validation process`}
                  actionable="Each step builds on the previous for comprehensive analysis"
                >
                  <GlowingCard 
                    glowColor={step.color as any}
                    intensity="low"
                    className="cursor-help"
                  >
                    <div className="text-center p-6">
                      <div className={`w-12 h-12 bg-gradient-to-r from-${step.color}-100 to-${step.color}-200 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <step.icon className={`w-6 h-6 text-${step.color}-600`} />
                      </div>
                      <div className={`text-2xl font-bold text-${step.color}-600 mb-2`}>
                        {step.step}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </GlowingCard>
                </InsightTooltip>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Upload Component */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlowingCard glowColor="blue" intensity="medium">
            <FileUpload />
          </GlowingCard>
        </motion.div>

        {/* Enhanced What You'll Get Section */}
        <motion.div 
          className="mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <GlowingCard glowColor="purple" intensity="medium">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <motion.h2 
                className="text-2xl font-semibold text-gray-900 mb-6 text-center flex items-center justify-center"
                variants={itemVariants}
              >
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                What You'll Get in Your Free Validation Report
                <Badge variant="success" className="ml-2">
                  <Award className="w-3 h-3 mr-1" />
                  Premium Quality
                </Badge>
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div key={index} variants={itemVariants}>
                    <InsightTooltip
                      title={benefit.title}
                      description={benefit.description}
                      insight="Our AI analyzes thousands of data points to provide accurate insights"
                      examples={["Similar to reports that cost $5K+ from consultants", "Used by 500+ successful startups"]}
                    >
                      <GlowingCard 
                        glowColor={benefit.glowColor as any}
                        intensity="low"
                        className="cursor-help h-full"
                      >
                        <div className="text-center p-6 h-full flex flex-col">
                          <div className={`w-12 h-12 bg-gradient-to-r from-${benefit.glowColor}-100 to-${benefit.glowColor}-200 rounded-lg flex items-center justify-center mx-auto mb-4`}>
                            <benefit.icon className={`w-6 h-6 text-${benefit.glowColor}-600`} />
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                          <p className="text-gray-600 text-sm mb-4 flex-grow">{benefit.description}</p>
                          
                          <div className="bg-gray-50 rounded-lg p-3 mt-auto">
                            <div className="text-2xl font-bold gradient-text">
                              <AnimatedCounter 
                                value={benefit.stats.value} 
                                suffix={benefit.stats.suffix}
                                duration={2 + index * 0.3}
                              />
                            </div>
                            <div className="text-xs text-gray-600">{benefit.stats.label}</div>
                          </div>
                        </div>
                      </GlowingCard>
                    </InsightTooltip>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlowingCard>
        </motion.div>

        {/* Enhanced Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <GlowingCard glowColor="emerald" intensity="high">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center relative overflow-hidden">
              <ParticleBackground particleCount={15} color="#FFFFFF" speed={0.2} />
              
              <div className="relative z-10">
                <h2 className="text-2xl font-semibold mb-4">Ready for More?</h2>
                <p className="mb-6 opacity-90">
                  Once you receive your validation report, explore our premium features to track KPIs, 
                  build pitch decks, and connect with investors.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <InsightTooltip
                    title="Explore Dashboard"
                    description="See advanced analytics and KPI tracking"
                    insight="Premium features help startups raise 3x more capital"
                  >
                    <MorphingButton
                      className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-6 py-3"
                      successText="Let's Explore!"
                      onClick={async () => {
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        window.location.href = '/dashboard';
                      }}
                    >
                      Explore Dashboard
                      <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                    </MorphingButton>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="View Companies"
                    description="Browse successful startup examples"
                    insight="Learn from companies that have raised millions"
                  >
                    <Link
                      to="/companies"
                      className="inline-flex items-center px-6 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-200 font-semibold"
                    >
                      View Examples
                      <TrendingUp className="w-4 h-4 ml-2" />
                    </Link>
                  </InsightTooltip>
                </div>
              </div>
            </div>
          </GlowingCard>
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;