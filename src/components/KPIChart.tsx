import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import InteractiveChart from './InteractiveChart';
import MetricCard from './MetricCard';
import InsightTooltip from './InsightTooltip';
import { TrendingUp, TrendingDown, BarChart3, Target, Zap } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
  benchmark?: number;
}

const KPIChart = () => {
  const data: ChartData[] = [
    { name: 'Jan', value: 18000, change: 12.5, trend: 'up', benchmark: 15000 },
    { name: 'Feb', value: 22000, change: 22.2, trend: 'up', benchmark: 18000 },
    { name: 'Mar', value: 25000, change: 13.6, trend: 'up', benchmark: 20000 },
    { name: 'Apr', value: 28000, change: 12.0, trend: 'up', benchmark: 22000 },
    { name: 'May', value: 32000, change: 14.3, trend: 'up', benchmark: 25000 },
    { name: 'Jun', value: 35000, change: 9.4, trend: 'up', benchmark: 28000 },
  ];

  const metrics = [
    {
      name: 'Monthly Revenue',
      value: 35000,
      unit: 'USD',
      change: 9.4,
      trend: 'up' as const,
      benchmark: {
        excellent: 50000,
        good: 30000,
        average: 15000,
        poor: 5000
      },
      insight: "Strong revenue growth indicates product-market fit",
      examples: ["Stripe reached $35K MRR before Series A", "Zoom had similar growth trajectory"]
    },
    {
      name: 'Customer Acquisition Cost',
      value: 45,
      unit: 'USD',
      change: -5.3,
      trend: 'down' as const,
      benchmark: {
        excellent: 30,
        good: 50,
        average: 100,
        poor: 200
      },
      insight: "Decreasing CAC shows improving acquisition efficiency",
      examples: ["HubSpot maintained CAC under $50", "Salesforce optimized to $40 CAC"]
    },
    {
      name: 'Customer Lifetime Value',
      value: 1250,
      unit: 'USD',
      change: 8.2,
      trend: 'up' as const,
      benchmark: {
        excellent: 1500,
        good: 1000,
        average: 500,
        poor: 200
      },
      insight: "Growing LTV indicates strong product stickiness",
      examples: ["Shopify achieved $1200+ LTV", "Slack maintained high LTV through expansion"]
    },
    {
      name: 'Monthly Churn Rate',
      value: 2.1,
      unit: '%',
      change: -1.2,
      trend: 'down' as const,
      benchmark: {
        excellent: 2,
        good: 5,
        average: 10,
        poor: 20
      },
      insight: "Low churn rate indicates strong product-market fit",
      examples: ["Zoom maintained <2% churn", "Slack achieved <3% monthly churn"]
    },
  ];

  const overallScore = Math.round(
    metrics.reduce((acc, metric) => {
      const benchmark = metric.benchmark;
      let score = 0;
      if (metric.name.includes('Churn') || metric.name.includes('CAC')) {
        // Lower is better
        if (metric.value <= benchmark.excellent) score = 100;
        else if (metric.value <= benchmark.good) score = 80;
        else if (metric.value <= benchmark.average) score = 60;
        else score = 40;
      } else {
        // Higher is better
        if (metric.value >= benchmark.excellent) score = 100;
        else if (metric.value >= benchmark.good) score = 80;
        else if (metric.value >= benchmark.average) score = 60;
        else score = 40;
      }
      return acc + score;
    }, 0) / metrics.length
  );

  return (
    <div className="space-y-6">
      {/* Overall Performance Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <InsightTooltip
          title="Performance Overview"
          description="Comprehensive view of your startup's key metrics"
          insight={`Overall score of ${overallScore}% indicates ${overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : 'needs improvement'} performance`}
          benchmark={{
            value: overallScore,
            label: `${overallScore}% Overall Score`,
            status: overallScore >= 80 ? 'excellent' : overallScore >= 60 ? 'good' : 'average'
          }}
          actionable={overallScore < 80 ? "Focus on improving metrics below industry benchmarks" : "Maintain current performance and scale"}
          examples={["Successful startups typically score 80%+", "VCs look for consistent 70%+ scores"]}
        >
          <Card className="hover-glow cursor-help">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                  <span>Performance Overview</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={overallScore >= 80 ? 'success' : overallScore >= 60 ? 'info' : 'warning'}
                    className="text-sm"
                  >
                    {overallScore}% Score
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Target className="w-3 h-3 mr-1" />
                    VC Ready
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>
        </InsightTooltip>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
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
          </motion.div>
        ))}
      </div>

      {/* Interactive Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <InteractiveChart
          title="Revenue Growth Trend"
          data={data}
          type="line"
          insight="Consistent month-over-month growth indicates strong market traction and scalable business model"
          benchmark={{
            value: 15,
            label: "15% MoM Growth",
            status: "excellent"
          }}
          examples={[
            "Stripe maintained 20% monthly growth for 2+ years",
            "Zoom achieved 15% monthly growth pre-IPO"
          ]}
        />
      </motion.div>

      {/* Growth Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">Growth Acceleration Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <InsightTooltip
                    title="Revenue Velocity"
                    description="Rate of revenue acceleration"
                    insight="Your revenue is accelerating at 12.5% month-over-month"
                    actionable="Maintain this growth rate to reach $100K MRR in 8 months"
                  >
                    <div className="p-3 bg-white rounded-lg border border-blue-200 cursor-help hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        <span className="font-medium text-gray-900">Revenue Velocity</span>
                      </div>
                      <p className="text-gray-600">12.5% acceleration</p>
                    </div>
                  </InsightTooltip>

                  <InsightTooltip
                    title="Unit Economics"
                    description="LTV to CAC ratio health"
                    insight="Your LTV:CAC ratio of 27.8:1 is excellent for SaaS"
                    actionable="Maintain this ratio while scaling acquisition"
                  >
                    <div className="p-3 bg-white rounded-lg border border-blue-200 cursor-help hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-1">
                        <Target className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-900">Unit Economics</span>
                      </div>
                      <p className="text-gray-600">LTV:CAC 27.8:1</p>
                    </div>
                  </InsightTooltip>

                  <InsightTooltip
                    title="Retention Quality"
                    description="Customer retention strength"
                    insight="2.1% churn rate puts you in top 10% of SaaS companies"
                    actionable="Focus on expansion revenue to drive negative churn"
                  >
                    <div className="p-3 bg-white rounded-lg border border-blue-200 cursor-help hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-2 mb-1">
                        <TrendingDown className="w-4 h-4 text-purple-600" />
                        <span className="font-medium text-gray-900">Retention Quality</span>
                      </div>
                      <p className="text-gray-600">Top 10% retention</p>
                    </div>
                  </InsightTooltip>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default KPIChart;