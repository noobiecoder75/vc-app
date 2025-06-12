import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import KPIChart from '../components/KPIChart';
import VCMatchCard from '../components/VCMatchCard';
import InsightTooltip from '../components/InsightTooltip';
import { 
  ArrowLeft, 
  BarChart3, 
  Target, 
  Users, 
  FileText, 
  Star, 
  TrendingUp,
  DollarSign,
  Zap,
  Award,
  Rocket,
  Brain
} from 'lucide-react';

const DashboardPage = () => {
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

  const readinessScore = 78;
  const quickStats = [
    { 
      icon: DollarSign, 
      label: 'Revenue', 
      value: '$35K', 
      change: '+12.5%',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      insight: 'Strong revenue growth indicates product-market fit',
      benchmark: { target: 50000, current: 35000 }
    },
    { 
      icon: TrendingUp, 
      label: 'Growth Rate', 
      value: '12.5%', 
      change: '+2.1%',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      insight: 'Above average growth rate for SaaS startups',
      benchmark: { target: 15, current: 12.5 }
    },
    { 
      icon: Users, 
      label: 'Active Users', 
      value: '2,850', 
      change: '+8.2%',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      insight: 'User growth is accelerating month-over-month',
      benchmark: { target: 5000, current: 2850 }
    },
    { 
      icon: Target, 
      label: 'Valuation', 
      value: '$2.5M', 
      change: '+15.3%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      insight: 'Valuation growth outpacing revenue - good sign',
      benchmark: { target: 5000000, current: 2500000 }
    }
  ];

  const premiumFeatures = [
    {
      icon: FileText,
      title: "AI-Powered Pitch Deck Builder",
      description: "Create compelling pitch decks with industry templates",
      insight: "Successful pitch decks follow proven patterns - we guide you through each slide"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics & Forecasting",
      description: "Predictive modeling and scenario planning",
      insight: "VCs want to see 3-year projections with multiple scenarios"
    },
    {
      icon: Users,
      title: "Direct VC Introductions",
      description: "Warm introductions to relevant investors",
      insight: "Warm introductions are 5x more likely to result in funding"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>
          
          <motion.div 
            className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
            variants={itemVariants}
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Startup Dashboard</h1>
              <p className="text-gray-600 text-lg">Track your progress and manage your fundraising journey</p>
            </div>
            
            <InsightTooltip
              title="VC Readiness Score"
              description="Comprehensive assessment of your fundraising readiness"
              insight={`Score of ${readinessScore}% indicates ${readinessScore >= 80 ? 'excellent' : readinessScore >= 60 ? 'good' : 'needs improvement'} readiness`}
              benchmark={{
                value: readinessScore,
                label: `${readinessScore}% Ready`,
                status: readinessScore >= 80 ? 'excellent' : readinessScore >= 60 ? 'good' : 'average'
              }}
              actionable={readinessScore < 80 ? "Focus on improving weak areas to increase score" : "You're ready to start fundraising!"}
              examples={["Successful startups typically score 80%+", "Slack had 95% readiness before Series A"]}
            >
              <div className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-help hover:shadow-md transition-shadow">
                <div className="p-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-lg">
                  <Star className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-600">VC Readiness Score</div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{readinessScore}%</span>
                    <Badge variant={readinessScore >= 80 ? 'success' : readinessScore >= 60 ? 'info' : 'warning'}>
                      {readinessScore >= 80 ? 'Excellent' : readinessScore >= 60 ? 'Good' : 'Improving'}
                    </Badge>
                  </div>
                  <Progress value={readinessScore} className="w-32 mt-1" />
                </div>
              </div>
            </InsightTooltip>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {quickStats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <InsightTooltip
                title={stat.label}
                description={`Current value: ${stat.value}`}
                insight={stat.insight}
                benchmark={stat.benchmark ? {
                  value: (stat.benchmark.current / stat.benchmark.target) * 100,
                  label: `${Math.round((stat.benchmark.current / stat.benchmark.target) * 100)}% of target`,
                  status: (stat.benchmark.current / stat.benchmark.target) >= 0.8 ? 'excellent' : 
                         (stat.benchmark.current / stat.benchmark.target) >= 0.6 ? 'good' : 'average'
                } : undefined}
                actionable={`Track this metric to reach your target of ${stat.benchmark ? 
                  (typeof stat.benchmark.target === 'number' && stat.benchmark.target > 1000 ? 
                    `$${(stat.benchmark.target / 1000).toFixed(0)}K` : 
                    stat.benchmark.target) : 'industry benchmark'}`}
              >
                <Card className="hover-glow transition-all duration-300 cursor-help">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 ${stat.bgColor} rounded-lg`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-red-600'}`}>
                        {stat.change}
                      </div>
                    </div>
                    {stat.benchmark && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Progress to Target</span>
                          <span>{Math.round((stat.benchmark.current / stat.benchmark.target) * 100)}%</span>
                        </div>
                        <Progress value={(stat.benchmark.current / stat.benchmark.target) * 100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </InsightTooltip>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* KPI Charts - Takes 2 columns */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <KPIChart />
          </motion.div>
          
          {/* VC Matching - Takes 1 column */}
          <motion.div variants={itemVariants}>
            <VCMatchCard />
          </motion.div>
        </motion.div>

        {/* Premium Features */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-xl p-8 text-white mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-2 mb-2">
                  <Rocket className="w-6 h-6" />
                  <h2 className="text-2xl font-semibold">Unlock Premium Features</h2>
                  <Badge variant="outline" className="text-white border-white">
                    <Zap className="w-3 h-3 mr-1" />
                    Pro
                  </Badge>
                </div>
                <p className="opacity-90 text-lg">
                  Get access to advanced tools that successful startups use to raise capital
                </p>
              </div>
              
              <div className="text-center lg:text-right">
                <Button 
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-3"
                >
                  <Award className="w-5 h-5 mr-2" />
                  Upgrade to Pro
                </Button>
                <p className="text-sm opacity-75 mt-2">Starting at $29/month</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {premiumFeatures.map((feature, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  custom={index}
                >
                  <InsightTooltip
                    title={feature.title}
                    description={feature.description}
                    insight={feature.insight}
                    actionable="Upgrade to Pro to unlock this feature"
                    type="info"
                  >
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200 cursor-help">
                      <div className="flex items-center space-x-3 mb-3">
                        <feature.icon className="w-5 h-5" />
                        <span className="font-medium">{feature.title}</span>
                      </div>
                      <p className="text-sm opacity-90">{feature.description}</p>
                    </div>
                  </InsightTooltip>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* AI Insights */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <Brain className="w-6 h-6 text-emerald-600" />
                  <span>AI-Powered Insights</span>
                  <Badge variant="success" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    New
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InsightTooltip
                    title="Fundraising Readiness"
                    description="AI assessment of your fundraising timeline"
                    insight="Based on your metrics, you're 6-8 months away from optimal fundraising conditions"
                    actionable="Focus on reaching $50K MRR and improving unit economics"
                  >
                    <div className="p-4 bg-white rounded-lg border border-emerald-200 cursor-help hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-gray-900 mb-2">📈 Fundraising Timeline</h4>
                      <p className="text-gray-700 text-sm mb-2">
                        Based on your current growth trajectory, you'll be ready for Series A in 6-8 months.
                      </p>
                      <Badge variant="info" className="text-xs">AI Prediction</Badge>
                    </div>
                  </InsightTooltip>

                  <InsightTooltip
                    title="Market Opportunity"
                    description="AI analysis of your market positioning"
                    insight="Your market timing is excellent - 73% of similar startups in your space are raising successfully"
                    actionable="Leverage the current market momentum in your pitch"
                  >
                    <div className="p-4 bg-white rounded-lg border border-blue-200 cursor-help hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-gray-900 mb-2">🎯 Market Timing</h4>
                      <p className="text-gray-700 text-sm mb-2">
                        Market conditions are favorable for your sector. 73% success rate for similar startups.
                      </p>
                      <Badge variant="success" className="text-xs">Optimal Timing</Badge>
                    </div>
                  </InsightTooltip>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;