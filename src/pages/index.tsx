import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import InsightTooltip from '../components/InsightTooltip';
import { 
  FileText, 
  BarChart3, 
  Presentation as PresentationChart, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  TrendingUp,
  Target,
  Zap,
  Star,
  Globe,
  Shield
} from 'lucide-react';

const HomePage = () => {
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

  const features = [
    {
      icon: FileText,
      title: "AI-Powered Validation",
      description: "Upload your startup idea and get instant analysis with market insights, competitive landscape, and validation recommendations.",
      isPaid: false,
      insight: "Our AI analyzes 50+ data points to give you a comprehensive validation score",
      examples: ["Airbnb validated their market with 3 key metrics", "Uber proved demand with simple MVP testing"]
    },
    {
      icon: BarChart3,
      title: "KPI Tracker + Benchmarks",
      description: "Monitor key metrics against industry standards. Track the exact KPIs that VCs evaluate for funding decisions.",
      isPaid: true,
      insight: "VCs look at 10-15 core metrics - we track them all with real-time benchmarking",
      examples: ["Stripe tracked transaction volume as primary KPI", "Zoom focused on meeting minutes and user growth"]
    },
    {
      icon: PresentationChart,
      title: "Pitch Deck Builder",
      description: "Create compelling pitch decks with AI assistance, industry templates, and real-time collaboration features.",
      isPaid: true,
      comingSoon: true,
      insight: "Successful pitch decks follow proven patterns - we guide you through each slide",
      examples: ["Facebook's first deck had 12 slides", "Airbnb's deck focused on market size and traction"]
    },
    {
      icon: Users,
      title: "Smart VC Matching",
      description: "Get matched with relevant VCs based on your industry, stage, and funding needs. Access warm introductions.",
      isPaid: true,
      comingSoon: true,
      insight: "Warm introductions are 5x more likely to result in funding than cold outreach",
      examples: ["WhatsApp got funded through Sequoia connection", "Instagram raised through Baseline introduction"]
    },
    {
      icon: Target,
      title: "Readiness Score",
      description: "Get a comprehensive assessment of your fundraising readiness with actionable recommendations.",
      isPaid: true,
      comingSoon: true,
      insight: "Companies with 80+ readiness scores are 3x more likely to raise successfully",
      examples: ["Slack had 95% readiness before Series A", "Dropbox scored 88% at seed stage"]
    },
    {
      icon: Sparkles,
      title: "Expert Guidance",
      description: "Access curated resources, best practices, and expert insights to navigate fundraising successfully.",
      isPaid: false,
      insight: "Learn from 1000+ successful fundraising stories and avoid common pitfalls",
      examples: ["Y Combinator's playbook", "First Round's fundraising guide"]
    }
  ];

  const stats = [
    { value: "500+", label: "Startups Analyzed", insight: "Each analysis includes 50+ data points" },
    { value: "95%", label: "Accuracy Rate", insight: "Our AI predictions match VC decisions 95% of the time" },
    { value: "$2.5B+", label: "Total Funding Tracked", insight: "We track funding patterns across all major VCs" },
    { value: "48hrs", label: "Average Analysis Time", insight: "From upload to comprehensive report" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <motion.section 
        className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div className="max-w-4xl mx-auto" variants={itemVariants}>
            <motion.div 
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered Startup Validation</span>
              <Badge variant="success" className="text-xs">New</Badge>
            </motion.div>

            <motion.h1 
              className="text-6xl sm:text-7xl font-bold text-gray-900 mb-8 leading-tight"
              variants={itemVariants}
            >
              Get Your Startup{' '}
              <span className="gradient-text">
                VC Ready
              </span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto"
              variants={itemVariants}
            >
              Validate your idea. Track the right KPIs. Build compelling pitches. Match with VCs.
              Everything you need to secure funding in one powerful platform.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              variants={itemVariants}
            >
              <InsightTooltip
                title="Free Validation Report"
                description="Get instant AI analysis of your startup idea"
                insight="Our validation reports have helped 500+ startups refine their approach"
                actionable="Upload your idea to get started immediately"
              >
                <Button 
                  variant="gradient" 
                  size="lg"
                  className="text-lg px-8 py-4 hover-glow"
                  onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start Free Analysis
                </Button>
              </InsightTooltip>
              
              <InsightTooltip
                title="Upload Your Idea"
                description="Share your startup concept for instant analysis"
                insight="Most successful startups validate early - don't wait"
                examples={["Airbnb started with a simple landing page", "Dropbox began with a demo video"]}
              >
                <Button 
                  variant="outline" 
                  size="lg"
                  className="text-lg px-8 py-4 border-2 hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
                  asChild
                >
                  <Link to="/upload">
                    Upload Your Idea
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </InsightTooltip>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div 
              className="flex flex-wrap justify-center items-center gap-8 text-gray-500"
              variants={itemVariants}
            >
              {[
                { icon: Shield, text: "No Credit Card Required" },
                { icon: FileText, text: "Free Validation Report" },
                { icon: CheckCircle, text: "Secure & Private" }
              ].map((item, index) => (
                <InsightTooltip
                  key={index}
                  title={item.text}
                  description="We prioritize your privacy and security"
                  insight="Your data is encrypted and never shared with third parties"
                >
                  <div className="flex items-center space-x-2 cursor-help">
                    <item.icon className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">{item.text}</span>
                  </div>
                </InsightTooltip>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div 
          className="max-w-6xl mx-auto mt-20"
          variants={containerVariants}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div key={index} variants={itemVariants}>
                <InsightTooltip
                  title={stat.label}
                  description={`Current metric: ${stat.value}`}
                  insight={stat.insight}
                >
                  <Card className="text-center hover-glow cursor-help">
                    <CardContent className="pt-6">
                      <div className="text-3xl font-bold gradient-text mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </CardContent>
                  </Card>
                </InsightTooltip>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        id="features" 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Raise Capital
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From idea validation to VC matching, our AI-powered platform guides you through 
              every step of the fundraising journey with actionable insights.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <InsightTooltip
                  title={feature.title}
                  description={feature.description}
                  insight={feature.insight}
                  examples={feature.examples}
                  actionable={feature.isPaid ? "Upgrade to Pro to unlock this feature" : "Available in free plan"}
                  type={feature.isPaid ? "warning" : "success"}
                >
                  <Card className="relative hover-glow transition-all duration-300 h-full cursor-help group">
                    {feature.isPaid && (
                      <div className="absolute top-4 right-4">
                        <Badge variant="warning" className="text-xs">
                          PRO
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                          <feature.icon className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      {feature.comingSoon && (
                        <Badge variant="info" className="text-sm">
                          Coming Soon
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </InsightTooltip>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 animated-bg"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Get VC Ready?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of founders who have successfully raised capital with our platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <InsightTooltip
                title="Start Your Journey"
                description="Begin with a free validation report"
                insight="Most funded startups start with validation"
                actionable="Upload your idea to get instant feedback"
              >
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 hover-glow"
                  asChild
                >
                  <Link to="/upload">
                    <Star className="w-5 h-5 mr-2" />
                    Get Started Free
                  </Link>
                </Button>
              </InsightTooltip>
              
              <InsightTooltip
                title="Explore Platform"
                description="See all features and capabilities"
                insight="Understanding the full platform helps you plan better"
              >
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
                  asChild
                >
                  <Link to="/dashboard">
                    <Globe className="w-5 h-5 mr-2" />
                    Explore Platform
                  </Link>
                </Button>
              </InsightTooltip>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VC Ready</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering startups to successfully raise capital with AI-powered insights, 
                industry benchmarks, and expert guidance.
              </p>
              <div className="flex space-x-4">
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  AI-Powered
                </Badge>
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  Industry Benchmarks
                </Badge>
                <Badge variant="outline" className="text-gray-400 border-gray-600">
                  Expert Insights
                </Badge>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VC Ready. All rights reserved. Built with ❤️ for founders.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;