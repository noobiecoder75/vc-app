import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import InteractiveChart from '../InteractiveChart';
import MetricCard from '../MetricCard';
import InsightTooltip from '../InsightTooltip';
import AnimatedCounter from '../advanced/AnimatedCounter';
import GlowingCard from '../advanced/GlowingCard';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Target, 
  Zap, 
  Calendar,
  Filter,
  Download,
  Share2,
  RefreshCw
} from 'lucide-react';

interface EnhancedKPIChartProps {
  companyId?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
}

const EnhancedKPIChart: React.FC<EnhancedKPIChartProps> = ({
  companyId,
  timeRange = '30d'
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [viewMode, setViewMode] = useState<'overview' | 'detailed' | 'comparison'>('overview');

  // Enhanced data with more sophisticated metrics
  const enhancedMetrics = [
    {
      name: 'Monthly Recurring Revenue',
      value: 125000,
      unit: 'USD',
      change: 15.2,
      trend: 'up' as const,
      benchmark: { excellent: 200000, good: 100000, average: 50000, poor: 10000 },
      insight: "Exceptional MRR growth indicates strong product-market fit and scalable business model",
      examples: ["Stripe reached $125K MRR before Series A", "Zoom had similar trajectory"],
      forecast: { next30: 143750, confidence: 85 },
      cohortData: [
        { month: 'Jan', value: 95000, newCustomers: 45, churn: 2.1 },
        { month: 'Feb', value: 108000, newCustomers: 52, churn: 1.8 },
        { month: 'Mar', value: 125000, newCustomers: 58, churn: 1.5 }
      ]
    },
    {
      name: 'Customer Acquisition Cost',
      value: 285,
      unit: 'USD',
      change: -8.3,
      trend: 'down' as const,
      benchmark: { excellent: 200, good: 400, average: 800, poor: 1500 },
      insight: "Decreasing CAC while maintaining growth shows improving acquisition efficiency",
      examples: ["HubSpot optimized CAC to $250", "Salesforce maintained $300 CAC"],
      forecast: { next30: 265, confidence: 78 }
    },
    {
      name: 'Customer Lifetime Value',
      value: 4250,
      unit: 'USD',
      change: 12.7,
      trend: 'up' as const,
      benchmark: { excellent: 5000, good: 3000, average: 1500, poor: 500 },
      insight: "Strong LTV growth indicates excellent product stickiness and expansion revenue",
      examples: ["Shopify achieved $4K+ LTV", "Slack maintained high LTV through upsells"],
      forecast: { next30: 4790, confidence: 82 }
    },
    {
      name: 'Net Revenue Retention',
      value: 118,
      unit: '%',
      change: 5.4,
      trend: 'up' as const,
      benchmark: { excellent: 120, good: 110, average: 100, poor: 90 },
      insight: "NRR >110% indicates strong expansion revenue and customer success",
      examples: ["Snowflake achieved 158% NRR", "Datadog maintained 130%+ NRR"],
      forecast: { next30: 122, confidence: 88 }
    }
  ];

  const chartData = [
    { name: 'Jan', value: 95000, benchmark: 80000, forecast: null },
    { name: 'Feb', value: 108000, benchmark: 90000, forecast: null },
    { name: 'Mar', value: 125000, benchmark: 100000, forecast: null },
    { name: 'Apr', value: null, benchmark: 110000, forecast: 143750 },
    { name: 'May', value: null, benchmark: 120000, forecast: 165000 }
  ];

  const overallScore = Math.round(
    enhancedMetrics.reduce((acc, metric) => {
      const benchmark = metric.benchmark;
      let score = 0;
      if (metric.name.includes('CAC')) {
        if (metric.value <= benchmark.excellent) score = 100;
        else if (metric.value <= benchmark.good) score = 80;
        else if (metric.value <= benchmark.average) score = 60;
        else score = 40;
      } else {
        if (metric.value >= benchmark.excellent) score = 100;
        else if (metric.value >= benchmark.good) score = 80;
        else if (metric.value >= benchmark.average) score = 60;
        else score = 40;
      }
      return acc + score;
    }, 0) / enhancedMetrics.length
  );

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GlowingCard glowColor="blue" intensity="medium">
          <Card>
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                    <BarChart3 className="w-7 h-7 text-blue-600" />
                    <span>Enhanced Performance Analytics</span>
                    <Badge variant="success" className="text-sm">
                      <Zap className="w-3 h-3 mr-1" />
                      AI-Powered
                    </Badge>
                  </CardTitle>
                  <p className="text-gray-600 mt-1">
                    Real-time insights with predictive analytics and industry benchmarking
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
                  
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
              
              {/* Overall Score with Animation */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <InsightTooltip
                  title="Overall Performance Score"
                  description="Comprehensive assessment across all key metrics"
                  insight={`Score of ${overallScore}% indicates ${overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : 'needs improvement'} performance`}
                  benchmark={{
                    value: overallScore,
                    label: `${overallScore}% Overall`,
                    status: overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : 'average'
                  }}
                >
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4 cursor-help hover:shadow-md transition-shadow">
                    <div className="text-3xl font-bold gradient-text">
                      <AnimatedCounter value={overallScore} suffix="%" duration={2} />
                    </div>
                    <div className="text-sm text-gray-600">Overall Score</div>
                  </div>
                </InsightTooltip>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-700">
                    <AnimatedCounter value={4} duration={1.5} />
                  </div>
                  <div className="text-sm text-blue-600">Metrics Tracked</div>
                </div>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-700">
                    <AnimatedCounter value={85} suffix="%" duration={1.8} />
                  </div>
                  <div className="text-sm text-purple-600">Forecast Confidence</div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-orange-700">
                    <AnimatedCounter value={15.2} suffix="%" duration={2.2} />
                  </div>
                  <div className="text-sm text-orange-600">Growth Rate</div>
                </div>
              </div>
            </CardHeader>
          </Card>
        </GlowingCard>
      </motion.div>

      {/* Enhanced Tabs */}
      <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Benchmarks</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Enhanced Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {enhancedMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlowingCard 
                  glowColor={index % 2 === 0 ? 'blue' : 'purple'} 
                  intensity="low"
                >
                  <MetricCard
                    name={metric.name}
                    value={metric.value}
                    unit={metric.unit}
                    change={metric.change}
                    trend={metric.trend}
                    benchmark={metric.benchmark}
                    industry="SaaS"
                    insight={metric.insight}
                    examples={metric.examples}
                  />
                </GlowingCard>
              </motion.div>
            ))}
          </div>

          {/* Enhanced Interactive Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <GlowingCard glowColor="emerald" intensity="medium">
              <InteractiveChart
                title="Revenue Growth with Forecasting"
                data={chartData.filter(d => d.value !== null)}
                type="line"
                insight="Consistent growth with strong predictive indicators for continued expansion"
                benchmark={{
                  value: 15.2,
                  label: "15.2% MoM Growth",
                  status: "excellent"
                }}
                examples={[
                  "Stripe maintained 20% monthly growth for 2+ years",
                  "Zoom achieved 15% monthly growth pre-IPO"
                ]}
              />
            </GlowingCard>
          </motion.div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {enhancedMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlowingCard>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{metric.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold">
                            <AnimatedCounter 
                              value={metric.value} 
                              prefix={metric.unit === 'USD' ? '$' : ''}
                              suffix={metric.unit === '%' ? '%' : ''}
                              decimals={metric.unit === '%' ? 1 : 0}
                            />
                          </span>
                          <Badge variant={metric.change > 0 ? 'success' : 'destructive'}>
                            {metric.change > 0 ? '+' : ''}{metric.change}%
                          </Badge>
                        </div>
                        
                        {metric.forecast && (
                          <div className="bg-blue-50 rounded-lg p-3">
                            <div className="text-sm font-medium text-blue-900 mb-1">
                              30-Day Forecast
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-semibold text-blue-700">
                                {metric.unit === 'USD' ? '$' : ''}{metric.forecast.next30.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                              </span>
                              <span className="text-sm text-blue-600">
                                {metric.forecast.confidence}% confidence
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </GlowingCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {enhancedMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlowingCard>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {metric.name}
                        <Badge variant="outline">Industry Benchmark</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-2 text-center text-xs">
                          <div className="bg-red-50 p-2 rounded">
                            <div className="font-semibold text-red-700">Poor</div>
                            <div className="text-red-600">
                              {metric.unit === 'USD' ? '$' : ''}{metric.benchmark.poor.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                            </div>
                          </div>
                          <div className="bg-yellow-50 p-2 rounded">
                            <div className="font-semibold text-yellow-700">Average</div>
                            <div className="text-yellow-600">
                              {metric.unit === 'USD' ? '$' : ''}{metric.benchmark.average.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                            </div>
                          </div>
                          <div className="bg-blue-50 p-2 rounded">
                            <div className="font-semibold text-blue-700">Good</div>
                            <div className="text-blue-600">
                              {metric.unit === 'USD' ? '$' : ''}{metric.benchmark.good.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                            </div>
                          </div>
                          <div className="bg-emerald-50 p-2 rounded">
                            <div className="font-semibold text-emerald-700">Excellent</div>
                            <div className="text-emerald-600">
                              {metric.unit === 'USD' ? '$' : ''}{metric.benchmark.excellent.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold mb-1">
                            {metric.unit === 'USD' ? '$' : ''}{metric.value.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                          </div>
                          <div className="text-sm text-gray-600">Your Current Value</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </GlowingCard>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedKPIChart;