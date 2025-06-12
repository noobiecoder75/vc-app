import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import EnhancedKPIChart from '../components/enhanced/EnhancedKPIChart';
import VCMatchCard from '../components/VCMatchCard';
import InsightTooltip from '../components/InsightTooltip';
import AnimatedCounter from '../components/advanced/AnimatedCounter';
import GlowingCard from '../components/advanced/GlowingCard';
import MorphingButton from '../components/advanced/MorphingButton';
import FloatingActionButton from '../components/advanced/FloatingActionButton';
import ParticleBackground from '../components/advanced/ParticleBackground';
import DataVisualization from '../components/advanced/DataVisualization';
import InteractiveHeatmap from '../components/advanced/InteractiveHeatmap';
import MetricComparison from '../components/advanced/MetricComparison';
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
  Brain,
  Upload,
  Settings,
  Share2,
  Download,
  Sparkles,
  Activity,
  Globe
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
      value: 125000, 
      change: 15.2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      insight: 'Strong revenue growth indicates product-market fit',
      benchmark: { target: 200000, current: 125000 }
    },
    { 
      icon: TrendingUp, 
      label: 'Growth Rate', 
      value: 15.2, 
      change: 2.1,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      insight: 'Above average growth rate for SaaS startups',
      benchmark: { target: 20, current: 15.2 }
    },
    { 
      icon: Users, 
      label: 'Active Users', 
      value: 2850, 
      change: 8.2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      insight: 'User growth is accelerating month-over-month',
      benchmark: { target: 5000, current: 2850 }
    },
    { 
      icon: Target, 
      label: 'Valuation', 
      value: 2500000, 
      change: 15.3,
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

  const floatingActions = [
    {
      icon: Upload,
      label: 'Upload Document',
      onClick: () => console.log('Upload clicked'),
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => console.log('Settings clicked'),
      color: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      icon: Share2,
      label: 'Share Dashboard',
      onClick: () => console.log('Share clicked'),
      color: 'bg-emerald-600 hover:bg-emerald-700'
    },
    {
      icon: Download,
      label: 'Export Data',
      onClick: () => console.log('Export clicked'),
      color: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  // Sample data for advanced visualizations
  const performanceData = [
    { name: 'Revenue', value: 125000, change: 15.2, trend: 'up' as const, color: '#10B981' },
    { name: 'Users', value: 2850, change: 8.2, trend: 'up' as const, color: '#3B82F6' },
    { name: 'Conversion', value: 3.4, change: -2.1, trend: 'down' as const, color: '#F59E0B' },
    { name: 'Retention', value: 89.5, change: 5.7, trend: 'up' as const, color: '#8B5CF6' },
    { name: 'CAC', value: 45, change: -8.3, trend: 'down' as const, color: '#EF4444' },
    { name: 'LTV', value: 1250, change: 12.4, trend: 'up' as const, color: '#EC4899' }
  ];

  const heatmapData = Array.from({ length: 50 }, (_, i) => ({
    x: i % 10,
    y: Math.floor(i / 10),
    value: Math.floor(Math.random() * 100) + 1,
    label: `Cell ${i + 1}`,
    category: ['Revenue', 'Users', 'Growth', 'Retention'][Math.floor(Math.random() * 4)]
  }));

  const comparisonMetrics = [
    {
      name: 'Monthly Revenue',
      current: 125000,
      previous: 108000,
      benchmark: 100000,
      target: 150000,
      unit: 'USD',
      category: 'Financial'
    },
    {
      name: 'User Growth Rate',
      current: 15.2,
      previous: 12.8,
      benchmark: 10.0,
      target: 20.0,
      unit: '%',
      category: 'Growth'
    },
    {
      name: 'Customer Satisfaction',
      current: 4.7,
      previous: 4.5,
      benchmark: 4.0,
      target: 4.8,
      unit: '/5',
      category: 'Quality'
    },
    {
      name: 'Churn Rate',
      current: 2.1,
      previous: 2.8,
      benchmark: 5.0,
      target: 2.0,
      unit: '%',
      category: 'Retention'
    }
  ];

  const formatValue = (value: number, type: string) => {
    if (type === 'currency') {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
      return `$${value.toLocaleString()}`;
    }
    if (type === 'percentage') return `${value.toFixed(1)}%`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground particleCount={30} color="#3B82F6" speed={0.3} />
      
      <div className="max-w-7xl mx-auto relative z-10">
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2 gradient-text">
                Enhanced Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                AI-powered insights with real-time analytics and predictive modeling
              </p>
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
              <GlowingCard glowColor="emerald" intensity="medium" className="cursor-help">
                <div className="flex items-center space-x-4 p-6">
                  <div className="p-3 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-xl">
                    <Star className="w-8 h-8 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-600">VC Readiness Score</div>
                    <div className="flex items-center space-x-3">
                      <span className="text-3xl font-bold text-gray-900">
                        <AnimatedCounter value={readinessScore} suffix="%" duration={2} />
                      </span>
                      <Badge variant={readinessScore >= 80 ? 'success' : readinessScore >= 60 ? 'info' : 'warning'}>
                        {readinessScore >= 80 ? 'Excellent' : readinessScore >= 60 ? 'Good' : 'Improving'}
                      </Badge>
                    </div>
                    <Progress value={readinessScore} className="w-40 mt-2" />
                  </div>
                </div>
              </GlowingCard>
            </InsightTooltip>
          </motion.div>
        </motion.div>

        {/* Enhanced Quick Stats */}
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
                description={`Current value: ${formatValue(stat.value, stat.label === 'Revenue' || stat.label === 'Valuation' ? 'currency' : stat.label === 'Growth Rate' ? 'percentage' : 'number')}`}
                insight={stat.insight}
                benchmark={stat.benchmark ? {
                  value: (stat.benchmark.current / stat.benchmark.target) * 100,
                  label: `${Math.round((stat.benchmark.current / stat.benchmark.target) * 100)}% of target`,
                  status: (stat.benchmark.current / stat.benchmark.target) >= 0.8 ? 'excellent' : 
                         (stat.benchmark.current / stat.benchmark.target) >= 0.6 ? 'good' : 'average'
                } : undefined}
                actionable={`Track this metric to reach your target`}
              >
                <GlowingCard 
                  glowColor={index % 4 === 0 ? 'emerald' : index % 4 === 1 ? 'blue' : index % 4 === 2 ? 'purple' : 'orange'} 
                  intensity="low"
                  className="cursor-help"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 ${stat.bgColor} rounded-xl`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">
                            <AnimatedCounter 
                              value={stat.value} 
                              prefix={stat.label === 'Revenue' || stat.label === 'Valuation' ? '$' : ''}
                              suffix={stat.label === 'Growth Rate' ? '%' : ''}
                              decimals={stat.label === 'Growth Rate' ? 1 : 0}
                              duration={1.5 + index * 0.2}
                            />
                          </p>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${stat.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </div>
                    </div>
                    {stat.benchmark && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Progress to Target</span>
                          <span>{Math.round((stat.benchmark.current / stat.benchmark.target) * 100)}%</span>
                        </div>
                        <Progress value={(stat.benchmark.current / stat.benchmark.target) * 100} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </GlowingCard>
              </InsightTooltip>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Main Content Grid */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Enhanced KPI Charts - Takes 2 columns */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <EnhancedKPIChart />
          </motion.div>
          
          {/* VC Matching - Takes 1 column */}
          <motion.div variants={itemVariants}>
            <VCMatchCard />
          </motion.div>
        </motion.div>

        {/* Advanced Data Visualizations */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <DataVisualization
              title="Performance Metrics"
              data={performanceData}
              type="metric"
              showTrends={true}
              showBenchmarks={true}
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <InteractiveHeatmap
              title="Activity Heatmap"
              data={heatmapData}
              colorScheme="blue"
              showLabels={false}
            />
          </motion.div>
        </motion.div>

        {/* Metric Comparison */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <MetricComparison
              title="Performance vs Benchmarks"
              metrics={comparisonMetrics}
              timeframe="vs Last Month"
              showBenchmarks={true}
              showTargets={true}
            />
          </motion.div>
        </motion.div>

        {/* Enhanced Premium Features */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="purple" intensity="high">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 rounded-xl p-8 text-white relative overflow-hidden">
                <ParticleBackground particleCount={15} color="#FFFFFF" speed={0.2} />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-emerald-600/20 animate-pulse" />
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                    <div className="mb-6 lg:mb-0">
                      <div className="flex items-center space-x-3 mb-3">
                        <Rocket className="w-8 h-8" />
                        <h2 className="text-3xl font-bold">Unlock Premium Features</h2>
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
                      <MorphingButton
                        variant="default"
                        className="bg-white text-blue-600 hover:bg-gray-50 font-semibold px-8 py-3 text-lg"
                        successText="Welcome to Pro!"
                        onClick={async () => {
                          await new Promise(resolve => setTimeout(resolve, 2000));
                        }}
                      >
                        <Award className="w-5 h-5 mr-2" />
                        Upgrade to Pro
                      </MorphingButton>
                      <p className="text-sm opacity-75 mt-2">Starting at $29/month</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {premiumFeatures.map((feature, index) => (
                      <motion.div 
                        key={index}
                        variants={itemVariants}
                        custom={index}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <InsightTooltip
                          title={feature.title}
                          description={feature.description}
                          insight={feature.insight}
                          actionable="Upgrade to Pro to unlock this feature"
                          type="info"
                        >
                          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-200 cursor-help border border-white/20">
                            <div className="flex items-center space-x-3 mb-3">
                              <feature.icon className="w-6 h-6" />
                              <span className="font-semibold">{feature.title}</span>
                            </div>
                            <p className="text-sm opacity-90">{feature.description}</p>
                          </div>
                        </InsightTooltip>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </GlowingCard>
          </motion.div>
        </motion.div>

        {/* Enhanced AI Insights */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="emerald" intensity="medium">
              <Card className="bg-gradient-to-r from-emerald-50 to-blue-50 border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3 text-gray-900">
                    <Brain className="w-7 h-7 text-emerald-600" />
                    <span>AI-Powered Insights</span>
                    <Badge variant="success" className="text-sm">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Enhanced
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InsightTooltip
                      title="Fundraising Readiness"
                      description="AI assessment of your fundraising timeline"
                      insight="Based on your metrics, you're 6-8 months away from optimal fundraising conditions"
                      actionable="Focus on reaching $200K MRR and improving unit economics"
                      examples={["Similar startups raised at $150K MRR", "VCs prefer 18+ months runway"]}
                    >
                      <GlowingCard glowColor="blue" intensity="low" className="cursor-help">
                        <div className="p-6 bg-white rounded-lg border border-emerald-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            📈 <span className="ml-2">Fundraising Timeline</span>
                          </h4>
                          <p className="text-gray-700 text-sm mb-3">
                            Based on your current growth trajectory, you'll be ready for Series A in 6-8 months.
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="info" className="text-xs">AI Prediction</Badge>
                            <span className="text-lg font-bold text-blue-600">
                              <AnimatedCounter value={6} suffix=" months" duration={1.5} />
                            </span>
                          </div>
                        </div>
                      </GlowingCard>
                    </InsightTooltip>

                    <InsightTooltip
                      title="Market Opportunity"
                      description="AI analysis of your market positioning"
                      insight="Your market timing is excellent - 73% of similar startups in your space are raising successfully"
                      actionable="Leverage the current market momentum in your pitch"
                      examples={["SaaS market is hot right now", "Enterprise adoption accelerating"]}
                    >
                      <GlowingCard glowColor="purple" intensity="low" className="cursor-help">
                        <div className="p-6 bg-white rounded-lg border border-blue-200">
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                            🎯 <span className="ml-2">Market Timing</span>
                          </h4>
                          <p className="text-gray-700 text-sm mb-3">
                            Market conditions are favorable for your sector. 73% success rate for similar startups.
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge variant="success" className="text-xs">Optimal Timing</Badge>
                            <span className="text-lg font-bold text-emerald-600">
                              <AnimatedCounter value={73} suffix="%" duration={2} />
                            </span>
                          </div>
                        </div>
                      </GlowingCard>
                    </InsightTooltip>
                  </div>
                </CardContent>
              </Card>
            </GlowingCard>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton actions={floatingActions} />
    </div>
  );
};

export default DashboardPage;