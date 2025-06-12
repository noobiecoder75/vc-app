import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Users, DollarSign, Clock, Zap, BarChart3, Star, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { fetchKPIData, KPIData } from '../lib/kpiService';

interface KPIAnalysisProps {
  companyId: string;
  companyName?: string;
  industry?: string;
  stage?: string;
}

interface BenchmarkData {
  metric: string;
  value: number;
  unit: string;
  benchmark: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  vcImportance: 'Critical' | 'High' | 'Medium';
  insight: string;
  successStory?: string;
}

const KPIAnalysis: React.FC<KPIAnalysisProps> = ({ companyId, companyName, industry, stage }) => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadKPIData = async () => {
      try {
        setLoading(true);
        const data = await fetchKPIData(companyId);
        setKpiData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load KPI data');
      } finally {
        setLoading(false);
      }
    };

    loadKPIData();
  }, [companyId]);

  // Industry-specific benchmarks based on stage and sector
  const getIndustryBenchmarks = (industry: string, stage: string): BenchmarkData[] => {
    const baseMetrics: BenchmarkData[] = [
      {
        metric: 'Monthly Recurring Revenue',
        value: 0,
        unit: 'USD',
        benchmark: {
          excellent: stage === 'Series A' ? 1000000 : stage === 'Seed' ? 100000 : 10000,
          good: stage === 'Series A' ? 500000 : stage === 'Seed' ? 50000 : 5000,
          average: stage === 'Series A' ? 200000 : stage === 'Seed' ? 20000 : 2000,
          poor: stage === 'Series A' ? 100000 : stage === 'Seed' ? 10000 : 1000
        },
        vcImportance: 'Critical',
        insight: 'MRR growth is the #1 metric VCs evaluate for SaaS companies. Consistent 15-20% MoM growth signals strong product-market fit.',
        successStory: 'Slack had $15M ARR when they raised Series A. Zoom reached $6M ARR before their Series A.'
      },
      {
        metric: 'Customer Acquisition Cost',
        value: 0,
        unit: 'USD',
        benchmark: {
          excellent: industry?.includes('SaaS') ? 200 : 500,
          good: industry?.includes('SaaS') ? 500 : 1000,
          average: industry?.includes('SaaS') ? 1000 : 2000,
          poor: industry?.includes('SaaS') ? 2000 : 5000
        },
        vcImportance: 'Critical',
        insight: 'CAC should be recovered within 12 months. Best-in-class SaaS companies achieve CAC payback in 5-7 months.',
        successStory: 'HubSpot maintained CAC under $500 during early growth. Salesforce kept CAC:LTV ratio at 1:3 minimum.'
      },
      {
        metric: 'Customer Lifetime Value',
        value: 0,
        unit: 'USD',
        benchmark: {
          excellent: industry?.includes('SaaS') ? 3000 : 5000,
          good: industry?.includes('SaaS') ? 2000 : 3000,
          average: industry?.includes('SaaS') ? 1000 : 2000,
          poor: industry?.includes('SaaS') ? 500 : 1000
        },
        vcImportance: 'Critical',
        insight: 'LTV:CAC ratio should be 3:1 minimum, with 5:1+ being excellent. This indicates sustainable unit economics.',
        successStory: 'Shopify achieved 5:1 LTV:CAC ratio before Series A. Stripe maintained 8:1 ratio during hypergrowth.'
      },
      {
        metric: 'Monthly Active Users',
        value: 0,
        unit: 'count',
        benchmark: {
          excellent: stage === 'Series A' ? 50000 : stage === 'Seed' ? 10000 : 1000,
          good: stage === 'Series A' ? 25000 : stage === 'Seed' ? 5000 : 500,
          average: stage === 'Series A' ? 10000 : stage === 'Seed' ? 2000 : 200,
          poor: stage === 'Series A' ? 5000 : stage === 'Seed' ? 1000 : 100
        },
        vcImportance: 'High',
        insight: 'User growth rate matters more than absolute numbers. 20%+ monthly user growth indicates strong traction.',
        successStory: 'Facebook had 1M users when they raised Series A. Instagram had 100K users at seed stage.'
      },
      {
        metric: 'Churn Rate',
        value: 0,
        unit: '%',
        benchmark: {
          excellent: 2,
          good: 5,
          average: 10,
          poor: 20
        },
        vcImportance: 'Critical',
        insight: 'Monthly churn under 5% is good, under 2% is excellent. Annual churn should be under 10% for SaaS.',
        successStory: 'Zoom maintained <2% monthly churn. Slack achieved <5% annual churn before IPO.'
      },
      {
        metric: 'Net Revenue Retention',
        value: 0,
        unit: '%',
        benchmark: {
          excellent: 120,
          good: 110,
          average: 100,
          poor: 90
        },
        vcImportance: 'Critical',
        insight: 'NRR >110% indicates strong expansion revenue. Best SaaS companies achieve 120%+ NRR.',
        successStory: 'Snowflake achieved 158% NRR. Datadog maintained 130%+ NRR during growth phase.'
      },
      {
        metric: 'Gross Margin',
        value: 0,
        unit: '%',
        benchmark: {
          excellent: industry?.includes('SaaS') ? 85 : 70,
          good: industry?.includes('SaaS') ? 75 : 60,
          average: industry?.includes('SaaS') ? 65 : 50,
          poor: industry?.includes('SaaS') ? 50 : 40
        },
        vcImportance: 'High',
        insight: 'SaaS companies should target 80%+ gross margins. Hardware companies typically achieve 50-70%.',
        successStory: 'Atlassian achieved 85% gross margins. Shopify maintains 55% gross margins with payments.'
      },
      {
        metric: 'Burn Rate',
        value: 0,
        unit: 'USD',
        benchmark: {
          excellent: stage === 'Series A' ? 100000 : stage === 'Seed' ? 30000 : 10000,
          good: stage === 'Series A' ? 200000 : stage === 'Seed' ? 60000 : 20000,
          average: stage === 'Series A' ? 400000 : stage === 'Seed' ? 100000 : 40000,
          poor: stage === 'Series A' ? 800000 : stage === 'Seed' ? 200000 : 80000
        },
        vcImportance: 'High',
        insight: 'Burn should provide 18+ months runway. Efficient burn with strong growth is key to VC confidence.',
        successStory: 'Airbnb burned $40K/month in early days. Uber burned efficiently relative to growth rate.'
      },
      {
        metric: 'Revenue Growth Rate',
        value: 0,
        unit: '%',
        benchmark: {
          excellent: 20,
          good: 15,
          average: 10,
          poor: 5
        },
        vcImportance: 'Critical',
        insight: 'Monthly revenue growth of 15-20% is excellent. Consistent growth matters more than absolute numbers.',
        successStory: 'Stripe grew 20% monthly for 2+ years. Square maintained 15% monthly growth pre-IPO.'
      },
      {
        metric: 'Customer Concentration',
        value: 0,
        unit: '%',
        benchmark: {
          excellent: 10,
          good: 20,
          average: 30,
          poor: 50
        },
        vcImportance: 'Medium',
        insight: 'No single customer should represent >20% of revenue. Diversified customer base reduces risk.',
        successStory: 'Salesforce kept largest customer <5% of revenue. HubSpot maintained diverse customer base.'
      }
    ];

    return baseMetrics;
  };

  const getBenchmarkStatus = (value: number, benchmark: BenchmarkData['benchmark'], isLowerBetter: boolean = false) => {
    if (isLowerBetter) {
      if (value <= benchmark.excellent) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
      if (value <= benchmark.good) return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp };
      if (value <= benchmark.average) return { status: 'average', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Minus };
      return { status: 'poor', color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle };
    } else {
      if (value >= benchmark.excellent) return { status: 'excellent', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
      if (value >= benchmark.good) return { status: 'good', color: 'text-blue-600', bg: 'bg-blue-50', icon: TrendingUp };
      if (value >= benchmark.average) return { status: 'average', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: Minus };
      return { status: 'poor', color: 'text-red-600', bg: 'bg-red-50', icon: AlertTriangle };
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'USD') {
      if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
      return `$${value.toLocaleString()}`;
    }
    if (unit === '%') return `${value.toFixed(1)}%`;
    if (unit === 'count') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value.toLocaleString();
    }
    return `${value.toLocaleString()}${unit ? ` ${unit}` : ''}`;
  };

  const getMetricIcon = (metricName: string) => {
    const name = metricName.toLowerCase();
    if (name.includes('revenue') || name.includes('mrr')) return DollarSign;
    if (name.includes('users') || name.includes('customer')) return Users;
    if (name.includes('churn') || name.includes('retention')) return TrendingDown;
    if (name.includes('growth') || name.includes('rate')) return TrendingUp;
    if (name.includes('burn') || name.includes('runway')) return Clock;
    if (name.includes('margin') || name.includes('profit')) return BarChart3;
    return Target;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !kpiData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load KPI Analysis</h3>
        <p className="text-red-600">{error || 'No KPI data available'}</p>
      </div>
    );
  }

  const benchmarks = getIndustryBenchmarks(industry || 'SaaS', stage || 'Seed');
  
  // Map actual metrics to benchmarks
  const analysisData = benchmarks.map(benchmark => {
    const actualMetric = kpiData.metrics.find(m => 
      m.name.toLowerCase().includes(benchmark.metric.toLowerCase().split(' ')[0]) ||
      benchmark.metric.toLowerCase().includes(m.name.toLowerCase().split(' ')[0])
    );
    
    return {
      ...benchmark,
      value: actualMetric?.value || 0,
      hasData: !!actualMetric
    };
  });

  // Add financial model data
  if (kpiData.financial.monthly_revenue_usd) {
    const revenueIndex = analysisData.findIndex(item => item.metric === 'Monthly Recurring Revenue');
    if (revenueIndex !== -1) {
      analysisData[revenueIndex].value = kpiData.financial.monthly_revenue_usd;
      analysisData[revenueIndex].hasData = true;
    }
  }

  if (kpiData.financial.burn_rate_usd) {
    const burnIndex = analysisData.findIndex(item => item.metric === 'Burn Rate');
    if (burnIndex !== -1) {
      analysisData[burnIndex].value = kpiData.financial.burn_rate_usd;
      analysisData[burnIndex].hasData = true;
    }
  }

  const criticalMetrics = analysisData.filter(item => item.vcImportance === 'Critical');
  const highMetrics = analysisData.filter(item => item.vcImportance === 'High');
  const mediumMetrics = analysisData.filter(item => item.vcImportance === 'Medium');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">VC-Focused KPI Analysis</h2>
            <p className="text-gray-600">
              Benchmarked against {industry || 'SaaS'} companies at {stage || 'Seed'} stage
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Industry Benchmarks</span>
          </div>
        </div>

        {/* Overall Score */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-700">
              {Math.round((criticalMetrics.filter(m => m.hasData && getBenchmarkStatus(m.value, m.benchmark, m.metric.includes('Churn') || m.metric.includes('CAC')).status === 'excellent').length / criticalMetrics.length) * 100)}%
            </div>
            <div className="text-sm text-green-600">Critical Metrics Excellence</div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-700">
              {analysisData.filter(m => m.hasData).length}/{analysisData.length}
            </div>
            <div className="text-sm text-blue-600">Metrics Tracked</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-700">
              {Math.round((analysisData.filter(m => m.hasData && getBenchmarkStatus(m.value, m.benchmark, m.metric.includes('Churn') || m.metric.includes('CAC')).status !== 'poor').length / analysisData.filter(m => m.hasData).length) * 100) || 0}%
            </div>
            <div className="text-sm text-purple-600">Above Average Performance</div>
          </div>
        </div>
      </div>

      {/* Critical Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Critical VC Metrics</h3>
          <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">Must Have</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {criticalMetrics.map((metric, index) => {
            const Icon = getMetricIcon(metric.metric);
            const isLowerBetter = metric.metric.includes('Churn') || metric.metric.includes('CAC');
            const status = getBenchmarkStatus(metric.value, metric.benchmark, isLowerBetter);
            const StatusIcon = status.icon;

            return (
              <div key={index} className={`border-2 rounded-lg p-6 ${status.bg} border-gray-200 hover:shadow-md transition-shadow`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <Icon className={`w-5 h-5 mr-3 ${status.color}`} />
                    <h4 className="font-semibold text-gray-900">{metric.metric}</h4>
                  </div>
                  <StatusIcon className={`w-5 h-5 ${status.color}`} />
                </div>

                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {metric.hasData ? formatValue(metric.value, metric.unit) : 'No Data'}
                  </div>
                  <div className={`text-sm font-medium ${status.color} capitalize`}>
                    {metric.hasData ? status.status : 'Not Tracked'}
                  </div>
                </div>

                {/* Benchmark Range */}
                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-2">Industry Benchmarks:</div>
                  <div className="grid grid-cols-4 gap-1 text-xs">
                    <div className="text-center">
                      <div className="text-green-600 font-medium">Excellent</div>
                      <div className="text-gray-700">{formatValue(metric.benchmark.excellent, metric.unit)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-blue-600 font-medium">Good</div>
                      <div className="text-gray-700">{formatValue(metric.benchmark.good, metric.unit)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-yellow-600 font-medium">Average</div>
                      <div className="text-gray-700">{formatValue(metric.benchmark.average, metric.unit)}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-red-600 font-medium">Poor</div>
                      <div className="text-gray-700">{formatValue(metric.benchmark.poor, metric.unit)}</div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-700 mb-2">{metric.insight}</p>
                  {metric.successStory && (
                    <p className="text-xs text-blue-600 italic">💡 {metric.successStory}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* High Importance Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">High Importance Metrics</h3>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Important</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {highMetrics.map((metric, index) => {
            const Icon = getMetricIcon(metric.metric);
            const isLowerBetter = metric.metric.includes('Churn') || metric.metric.includes('CAC') || metric.metric.includes('Burn');
            const status = getBenchmarkStatus(metric.value, metric.benchmark, isLowerBetter);

            return (
              <div key={index} className={`rounded-lg p-4 ${status.bg} border border-gray-200`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${status.color}`} />
                  <span className={`text-xs font-medium ${status.color} capitalize`}>
                    {metric.hasData ? status.status : 'No Data'}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{metric.metric}</h4>
                <div className="text-xl font-bold text-gray-900">
                  {metric.hasData ? formatValue(metric.value, metric.unit) : '--'}
                </div>
                <p className="text-xs text-gray-600 mt-2">{metric.insight}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Medium Importance Metrics */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-6 h-6 text-gray-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Supporting Metrics</h3>
          <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Nice to Have</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mediumMetrics.map((metric, index) => {
            const Icon = getMetricIcon(metric.metric);
            const status = getBenchmarkStatus(metric.value, metric.benchmark);

            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span className={`text-xs font-medium ${status.color} capitalize`}>
                    {metric.hasData ? status.status : 'No Data'}
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">{metric.metric}</h4>
                <div className="text-lg font-bold text-gray-900">
                  {metric.hasData ? formatValue(metric.value, metric.unit) : '--'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Items */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-4">Recommended Actions for VC Readiness</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2">🎯 Priority Improvements</h4>
            <ul className="space-y-1 text-sm opacity-90">
              {analysisData
                .filter(m => m.hasData && getBenchmarkStatus(m.value, m.benchmark, m.metric.includes('Churn') || m.metric.includes('CAC')).status === 'poor')
                .slice(0, 3)
                .map((metric, i) => (
                  <li key={i}>• Improve {metric.metric} - currently below industry average</li>
                ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">📊 Missing Metrics to Track</h4>
            <ul className="space-y-1 text-sm opacity-90">
              {analysisData
                .filter(m => !m.hasData && m.vcImportance === 'Critical')
                .slice(0, 3)
                .map((metric, i) => (
                  <li key={i}>• Start tracking {metric.metric}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIAnalysis;