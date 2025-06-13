import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import EnhancedKPIChart from './EnhancedKPIChart';
import MarketSizeAnalysis from '../advanced/MarketSizeAnalysis';
import DataVisualization from '../advanced/DataVisualization';
import MetricComparison from '../advanced/MetricComparison';
import InteractiveHeatmap from '../advanced/InteractiveHeatmap';
import GlowingCard from '../advanced/GlowingCard';
import AnimatedCounter from '../advanced/AnimatedCounter';
import InsightTooltip from '../InsightTooltip';
import { 
  BarChart3, 
  TrendingUp, 
  Globe, 
  Target, 
  Users, 
  DollarSign,
  Activity,
  Brain,
  Zap,
  Award,
  Star,
  Rocket,
  Building2,
  PieChart,
  LineChart,
  Calendar,
  Filter,
  Download,
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface ComprehensiveKPIDashboardProps {
  companyId?: string;
  companyName?: string;
  industry?: string;
  stage?: string;
}

const ComprehensiveKPIDashboard: React.FC<ComprehensiveKPIDashboardProps> = ({
  companyId,
  companyName = 'Your Startup',
  industry = 'SaaS',
  stage = 'Series A'
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed' | 'market' | 'competitive'>('overview');
  const [selectedMetricCategory, setSelectedMetricCategory] = useState('all');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Enhanced KPI data with more comprehensive metrics
  const kpiData = {
    overview: {
      totalScore: 82,
      vcReadiness: 78,
      marketFit: 85,
      growthRate: 15.2,
      burnEfficiency: 92
    },
    financialMetrics: [
      { name: 'Monthly Recurring Revenue', value: 125000, change: 15.2, trend: 'up' as const, unit: 'USD', benchmark: 100000 },
      { name: 'Annual Recurring Revenue', value: 1500000, change: 18.5, trend: 'up' as const, unit: 'USD', benchmark: 1200000 },
      { name: 'Gross Revenue Retention', value: 95.2, change: 2.1, trend: 'up' as const, unit: '%', benchmark: 90 },
      { name: 'Net Revenue Retention', value: 118, change: 5.4, trend: 'up' as const, unit: '%', benchmark: 110 },
      { name: 'Customer Acquisition Cost', value: 285, change: -8.3, trend: 'down' as const, unit: 'USD', benchmark: 400 },
      { name: 'Customer Lifetime Value', value: 4250, change: 12.7, trend: 'up' as const, unit: 'USD', benchmark: 3000 },
      { name: 'LTV/CAC Ratio', value: 14.9, change: 22.1, trend: 'up' as const, unit: ':1', benchmark: 7.5 },
      { name: 'Payback Period', value: 8.2, change: -15.3, trend: 'down' as const, unit: 'months', benchmark: 12 }
    ],
    growthMetrics: [
      { name: 'Monthly Growth Rate', value: 15.2, change: 2.1, trend: 'up' as const, unit: '%', benchmark: 10 },
      { name: 'User Growth Rate', value: 22.8, change: 5.7, trend: 'up' as const, unit: '%', benchmark: 15 },
      { name: 'Revenue Growth Rate', value: 18.5, change: 3.2, trend: 'up' as const, unit: '%', benchmark: 12 },
      { name: 'Market Share Growth', value: 0.15, change: 25.0, trend: 'up' as const, unit: '%', benchmark: 0.1 }
    ],
    operationalMetrics: [
      { name: 'Monthly Active Users', value: 12500, change: 8.2, trend: 'up' as const, unit: 'count', benchmark: 10000 },
      { name: 'Daily Active Users', value: 4200, change: 12.1, trend: 'up' as const, unit: 'count', benchmark: 3500 },
      { name: 'Session Duration', value: 24.5, change: 15.8, trend: 'up' as const, unit: 'minutes', benchmark: 20 },
      { name: 'Feature Adoption Rate', value: 68.5, change: 8.9, trend: 'up' as const, unit: '%', benchmark: 60 },
      { name: 'Support Ticket Volume', value: 125, change: -12.5, trend: 'down' as const, unit: 'count', benchmark: 200 },
      { name: 'Customer Satisfaction', value: 4.7, change: 6.8, trend: 'up' as const, unit: '/5', benchmark: 4.0 }
    ],
    salesMetrics: [
      { name: 'Sales Qualified Leads', value: 285, change: 18.2, trend: 'up' as const, unit: 'count', benchmark: 200 },
      { name: 'Lead Conversion Rate', value: 12.8, change: 5.2, trend: 'up' as const, unit: '%', benchmark: 10 },
      { name: 'Sales Cycle Length', value: 45, change: -8.2, trend: 'down' as const, unit: 'days', benchmark: 60 },
      { name: 'Win Rate', value: 28.5, change: 12.1, trend: 'up' as const, unit: '%', benchmark: 20 },
      { name: 'Average Deal Size', value: 15000, change: 22.5, trend: 'up' as const, unit: 'USD', benchmark: 12000 },
      { name: 'Pipeline Velocity', value: 1.8, change: 15.8, trend: 'up' as const, unit: 'x', benchmark: 1.5 }
    ]
  };

  const heatmapData = Array.from({ length: 70 }, (_, i) => ({
    x: i % 10,
    y: Math.floor(i / 10),
    value: Math.floor(Math.random() * 100) + 1,
    label: `Metric ${i + 1}`,
    category: ['Financial', 'Growth', 'Operational', 'Sales'][Math.floor(Math.random() * 4)]
  }));

  const comparisonMetrics = [
    {
      name: 'Monthly Recurring Revenue',
      current: 125000,
      previous: 108000,
      benchmark: 100000,
      target: 150000,
      unit: 'USD',
      category: 'Financial'
    },
    {
      name: 'Customer Acquisition Cost',
      current: 285,
      previous: 310,
      benchmark: 400,
      target: 250,
      unit: 'USD',
      category: 'Financial'
    },
    {
      name: 'Net Revenue Retention',
      current: 118,
      previous: 112,
      benchmark: 110,
      target: 125,
      unit: '%',
      category: 'Growth'
    },
    {
      name: 'Monthly Active Users',
      current: 12500,
      previous: 11500,
      benchmark: 10000,
      target: 15000,
      unit: 'count',
      category: 'Operational'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 60) return <TrendingUp className="w-4 h-4" />;
    if (score >= 40) return <Minus className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const metricCategories = ['all', 'financial', 'growth', 'operational', 'sales'];

  const getFilteredMetrics = () => {
    if (selectedMetricCategory === 'all') {
      return [
        ...kpiData.financialMetrics,
        ...kpiData.growthMetrics,
        ...kpiData.operationalMetrics,
        ...kpiData.salesMetrics
      ];
    }
    
    switch (selectedMetricCategory) {
      case 'financial': return kpiData.financialMetrics;
      case 'growth': return kpiData.growthMetrics;
      case 'operational': return kpiData.operationalMetrics;
      case 'sales': return kpiData.salesMetrics;
      default: return [];
    }
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <GlowingCard glowColor="blue" intensity="high">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                      <span>Comprehensive KPI Dashboard</span>
                      <Badge variant="success" className="text-sm">
                        <Brain className="w-3 h-3 mr-1" />
                        AI-Enhanced
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-600 mt-1 text-lg">
                      Real-time analytics with predictive insights for {companyName}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                      <SelectTrigger className="w-32">
                        <Calendar className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 Days</SelectItem>
                        <SelectItem value="30d">30 Days</SelectItem>
                        <SelectItem value="90d">90 Days</SelectItem>
                        <SelectItem value="1y">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={selectedMetricCategory} onValueChange={setSelectedMetricCategory}>
                      <SelectTrigger className="w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Metrics</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="growth">Growth</SelectItem>
                        <SelectItem value="operational">Operational</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                
                {/* Overall Performance Scores */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                  <InsightTooltip
                    title="Overall Score"
                    description="Comprehensive performance assessment"
                    insight="Based on 50+ key metrics across all business areas"
                    benchmark={{
                      value: kpiData.overview.totalScore,
                      label: `${kpiData.overview.totalScore}% Overall`,
                      status: kpiData.overview.totalScore >= 80 ? 'excellent' : 'good'
                    }}
                  >
                    <div className={`rounded-lg p-4 border cursor-help hover:shadow-md transition-shadow ${getScoreColor(kpiData.overview.totalScore)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Score</span>
                        {getScoreIcon(kpiData.overview.totalScore)}
                      </div>
                      <div className="text-2xl font-bold">
                        <AnimatedCounter value={kpiData.overview.totalScore} suffix="%" duration={2} />
                      </div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="VC Readiness"
                    description="Fundraising readiness assessment"
                    insight="Measures how prepared you are for VC discussions"
                  >
                    <div className={`rounded-lg p-4 border cursor-help hover:shadow-md transition-shadow ${getScoreColor(kpiData.overview.vcReadiness)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">VC Readiness</span>
                        {getScoreIcon(kpiData.overview.vcReadiness)}
                      </div>
                      <div className="text-2xl font-bold">
                        <AnimatedCounter value={kpiData.overview.vcReadiness} suffix="%" duration={2.2} />
                      </div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Market Fit"
                    description="Product-market fit indicator"
                    insight="Strong market fit indicates sustainable growth potential"
                  >
                    <div className={`rounded-lg p-4 border cursor-help hover:shadow-md transition-shadow ${getScoreColor(kpiData.overview.marketFit)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Market Fit</span>
                        {getScoreIcon(kpiData.overview.marketFit)}
                      </div>
                      <div className="text-2xl font-bold">
                        <AnimatedCounter value={kpiData.overview.marketFit} suffix="%" duration={2.4} />
                      </div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Growth Rate"
                    description="Monthly growth velocity"
                    insight="Consistent 15%+ growth indicates strong traction"
                  >
                    <div className={`rounded-lg p-4 border cursor-help hover:shadow-md transition-shadow ${getScoreColor(kpiData.overview.growthRate * 5)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Growth Rate</span>
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-2xl font-bold text-emerald-600">
                        <AnimatedCounter value={kpiData.overview.growthRate} suffix="%" decimals={1} duration={2.6} />
                      </div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Burn Efficiency"
                    description="Capital efficiency score"
                    insight="High efficiency means you're getting more growth per dollar spent"
                  >
                    <div className={`rounded-lg p-4 border cursor-help hover:shadow-md transition-shadow ${getScoreColor(kpiData.overview.burnEfficiency)}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Burn Efficiency</span>
                        {getScoreIcon(kpiData.overview.burnEfficiency)}
                      </div>
                      <div className="text-2xl font-bold">
                        <AnimatedCounter value={kpiData.overview.burnEfficiency} suffix="%" duration={2.8} />
                      </div>
                    </div>
                  </InsightTooltip>
                </div>
              </CardHeader>
            </Card>
          </GlowingCard>
        </motion.div>
      </motion.div>

      {/* Main Dashboard Tabs */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
              <div className="border-b border-gray-200 px-6 pt-6">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 h-12">
                  <TabsTrigger 
                    value="overview" 
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="detailed"
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <LineChart className="w-4 h-4" />
                    <span className="hidden sm:inline">Detailed</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="market"
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">Market</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="competitive"
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <Target className="w-4 h-4" />
                    <span className="hidden sm:inline">Competitive</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    {/* Enhanced KPI Chart */}
                    <EnhancedKPIChart companyId={companyId} timeRange={selectedTimeRange} />
                    
                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <DataVisualization
                        title="Financial Performance"
                        data={kpiData.financialMetrics.slice(0, 6)}
                        type="metric"
                        showTrends={true}
                        showBenchmarks={true}
                      />
                      
                      <DataVisualization
                        title="Growth Metrics"
                        data={kpiData.growthMetrics}
                        type="bar"
                        showTrends={true}
                        showBenchmarks={true}
                      />
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Detailed Analysis Tab */}
                <TabsContent value="detailed" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    {/* Metric Comparison */}
                    <MetricComparison
                      title="Performance vs Benchmarks"
                      metrics={comparisonMetrics}
                      timeframe="vs Last Month"
                      showBenchmarks={true}
                      showTargets={true}
                    />
                    
                    {/* Interactive Heatmap */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <InteractiveHeatmap
                        title="Metric Performance Heatmap"
                        data={heatmapData}
                        colorScheme="blue"
                        showLabels={false}
                      />
                      
                      <DataVisualization
                        title="Operational Metrics"
                        data={kpiData.operationalMetrics}
                        type="metric"
                        showTrends={true}
                        showBenchmarks={true}
                      />
                    </div>
                    
                    {/* Sales Performance */}
                    <DataVisualization
                      title="Sales Performance"
                      data={kpiData.salesMetrics}
                      type="bar"
                      showTrends={true}
                      showBenchmarks={true}
                    />
                  </motion.div>
                </TabsContent>

                {/* Market Analysis Tab */}
                <TabsContent value="market" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <MarketSizeAnalysis 
                      companyId={companyId}
                      industry={industry}
                    />
                  </motion.div>
                </TabsContent>

                {/* Competitive Analysis Tab */}
                <TabsContent value="competitive" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Competitive Intelligence</h3>
                      <p className="text-gray-600">Advanced competitive analysis and positioning insights</p>
                    </div>
                    
                    {/* Competitive Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <GlowingCard glowColor="purple" intensity="medium">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Target className="w-5 h-5 text-purple-600 mr-2" />
                              Market Position
                              <Badge variant="info" className="ml-2">
                                <Star className="w-3 h-3 mr-1" />
                                Competitive
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="text-center p-4 bg-purple-50 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600 mb-1">
                                  <AnimatedCounter value={0.15} suffix="%" decimals={2} duration={2} />
                                </div>
                                <div className="text-sm text-purple-700">Current Market Share</div>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">vs Market Leader</span>
                                  <span className="font-semibold text-gray-900">-22.85%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Growth Rate Advantage</span>
                                  <span className="font-semibold text-emerald-600">+5.2%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Price Competitiveness</span>
                                  <span className="font-semibold text-blue-600">15% Lower</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </GlowingCard>
                      
                      <GlowingCard glowColor="emerald" intensity="medium">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Award className="w-5 h-5 text-emerald-600 mr-2" />
                              Competitive Advantages
                              <Badge variant="success" className="ml-2">
                                <Rocket className="w-3 h-3 mr-1" />
                                Strengths
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                <div>
                                  <div className="font-medium text-emerald-900">Superior Technology</div>
                                  <div className="text-sm text-emerald-700">Modern architecture & AI capabilities</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                <div>
                                  <div className="font-medium text-emerald-900">Faster Implementation</div>
                                  <div className="text-sm text-emerald-700">50% faster than competitors</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3 p-3 bg-emerald-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 text-emerald-600" />
                                <div>
                                  <div className="font-medium text-emerald-900">Better Unit Economics</div>
                                  <div className="text-sm text-emerald-700">Higher LTV/CAC ratio</div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </GlowingCard>
                    </div>
                    
                    {/* Competitive Benchmarking */}
                    <GlowingCard glowColor="blue" intensity="high">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-bold mb-2">Competitive Benchmarking</h3>
                          <p className="text-blue-100">How you stack up against industry leaders</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                          <div className="text-center">
                            <div className="text-3xl font-bold mb-2">
                              <AnimatedCounter value={85} suffix="%" duration={2} />
                            </div>
                            <div className="text-blue-100">Feature Completeness</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold mb-2">
                              <AnimatedCounter value={92} suffix="%" duration={2.2} />
                            </div>
                            <div className="text-blue-100">Customer Satisfaction</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold mb-2">
                              <AnimatedCounter value={78} suffix="%" duration={2.4} />
                            </div>
                            <div className="text-blue-100">Market Awareness</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold mb-2">
                              <AnimatedCounter value={88} suffix="%" duration={2.6} />
                            </div>
                            <div className="text-blue-100">Overall Score</div>
                          </div>
                        </div>
                      </div>
                    </GlowingCard>
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ComprehensiveKPIDashboard;