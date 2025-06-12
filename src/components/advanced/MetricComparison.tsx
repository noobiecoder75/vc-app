import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import AnimatedCounter from './AnimatedCounter';
import GlowingCard from './GlowingCard';
import InsightTooltip from '../InsightTooltip';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Zap,
  ArrowRight,
  Star,
  AlertTriangle
} from 'lucide-react';

interface ComparisonMetric {
  name: string;
  current: number;
  previous: number;
  benchmark: number;
  unit: string;
  target?: number;
  category: string;
}

interface MetricComparisonProps {
  title: string;
  metrics: ComparisonMetric[];
  timeframe?: string;
  showBenchmarks?: boolean;
  showTargets?: boolean;
  className?: string;
}

const MetricComparison: React.FC<MetricComparisonProps> = ({
  title,
  metrics,
  timeframe = 'vs Last Period',
  showBenchmarks = true,
  showTargets = true,
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'change' | 'performance'>('performance');

  const categories = ['all', ...new Set(metrics.map(m => m.category))];
  
  const filteredMetrics = selectedCategory === 'all' 
    ? metrics 
    : metrics.filter(m => m.category === selectedCategory);

  const sortedMetrics = [...filteredMetrics].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'change':
        const changeA = ((a.current - a.previous) / a.previous) * 100;
        const changeB = ((b.current - b.previous) / b.previous) * 100;
        return changeB - changeA;
      case 'performance':
        const perfA = (a.current / a.benchmark) * 100;
        const perfB = (b.current / b.benchmark) * 100;
        return perfB - perfA;
      default:
        return 0;
    }
  });

  const getChangePercentage = (current: number, previous: number) => {
    return ((current - previous) / previous) * 100;
  };

  const getPerformanceScore = (current: number, benchmark: number) => {
    return (current / benchmark) * 100;
  };

  const getStatusColor = (score: number) => {
    if (score >= 100) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getStatusIcon = (score: number) => {
    if (score >= 100) return <Award className="w-4 h-4" />;
    if (score >= 80) return <Star className="w-4 h-4" />;
    if (score >= 60) return <Target className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'USD' || unit === '$') {
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

  return (
    <GlowingCard glowColor="blue" intensity="medium" className={className}>
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
              {title}
              <Badge variant="info" className="ml-2">
                <Zap className="w-3 h-3 mr-1" />
                {timeframe}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center space-x-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="change">Change</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {sortedMetrics.map((metric, index) => {
                const change = getChangePercentage(metric.current, metric.previous);
                const performance = getPerformanceScore(metric.current, metric.benchmark);
                const targetProgress = metric.target ? (metric.current / metric.target) * 100 : null;

                return (
                  <motion.div
                    key={metric.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    layout
                  >
                    <InsightTooltip
                      title={metric.name}
                      description={`Current: ${formatValue(metric.current, metric.unit)}`}
                      insight={`Performance vs benchmark: ${performance.toFixed(1)}%. ${
                        performance >= 100 ? 'Exceeding expectations!' : 
                        performance >= 80 ? 'Good performance' : 
                        'Room for improvement'
                      }`}
                      benchmark={{
                        value: performance,
                        label: `${performance.toFixed(1)}% vs benchmark`,
                        status: performance >= 100 ? 'excellent' : performance >= 80 ? 'good' : 'average'
                      }}
                      actionable={performance < 100 ? `Focus on reaching benchmark of ${formatValue(metric.benchmark, metric.unit)}` : 'Maintain current performance'}
                    >
                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-help">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg border ${getStatusColor(performance)}`}>
                              {getStatusIcon(performance)}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{metric.name}</h4>
                              <p className="text-sm text-gray-600">{metric.category}</p>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">
                              <AnimatedCounter 
                                value={metric.current} 
                                prefix={metric.unit === 'USD' ? '$' : ''}
                                suffix={metric.unit === '%' ? '%' : ''}
                                decimals={metric.unit === '%' ? 1 : 0}
                                duration={1.5 + index * 0.1}
                              />
                            </div>
                            <div className={`text-sm font-medium flex items-center ${
                              change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              {change > 0 ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                              ) : change < 0 ? (
                                <TrendingDown className="w-3 h-3 mr-1" />
                              ) : null}
                              {change > 0 ? '+' : ''}{change.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Previous Period */}
                          <div className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-sm text-gray-600 mb-1">Previous</div>
                            <div className="font-semibold text-gray-900">
                              {formatValue(metric.previous, metric.unit)}
                            </div>
                          </div>

                          {/* Benchmark */}
                          {showBenchmarks && (
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-sm text-blue-600 mb-1">Benchmark</div>
                              <div className="font-semibold text-blue-900">
                                {formatValue(metric.benchmark, metric.unit)}
                              </div>
                              <div className="text-xs text-blue-700 mt-1">
                                {performance.toFixed(0)}% achieved
                              </div>
                            </div>
                          )}

                          {/* Target */}
                          {showTargets && metric.target && (
                            <div className="text-center p-3 bg-purple-50 rounded-lg">
                              <div className="text-sm text-purple-600 mb-1">Target</div>
                              <div className="font-semibold text-purple-900">
                                {formatValue(metric.target, metric.unit)}
                              </div>
                              {targetProgress && (
                                <div className="text-xs text-purple-700 mt-1">
                                  {targetProgress.toFixed(0)}% complete
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Progress Bars */}
                        <div className="mt-4 space-y-2">
                          {showBenchmarks && (
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>vs Benchmark</span>
                                <span>{performance.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                  className={`h-2 rounded-full ${
                                    performance >= 100 ? 'bg-emerald-500' :
                                    performance >= 80 ? 'bg-blue-500' :
                                    performance >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, performance)}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 }}
                                />
                              </div>
                            </div>
                          )}

                          {showTargets && metric.target && targetProgress && (
                            <div>
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>vs Target</span>
                                <span>{targetProgress.toFixed(1)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                  className="h-2 rounded-full bg-purple-500"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, targetProgress)}%` }}
                                  transition={{ duration: 1, delay: index * 0.1 + 0.2 }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </InsightTooltip>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-emerald-50 rounded-lg">
              <div className="text-2xl font-bold text-emerald-600">
                <AnimatedCounter 
                  value={sortedMetrics.filter(m => getPerformanceScore(m.current, m.benchmark) >= 100).length}
                  duration={2}
                />
              </div>
              <div className="text-sm text-emerald-700">Above Benchmark</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                <AnimatedCounter 
                  value={sortedMetrics.filter(m => getChangePercentage(m.current, m.previous) > 0).length}
                  duration={2.2}
                />
              </div>
              <div className="text-sm text-blue-700">Improving</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                <AnimatedCounter 
                  value={sortedMetrics.reduce((avg, m) => avg + getPerformanceScore(m.current, m.benchmark), 0) / sortedMetrics.length}
                  decimals={1}
                  suffix="%"
                  duration={2.4}
                />
              </div>
              <div className="text-sm text-purple-700">Avg Performance</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                <AnimatedCounter 
                  value={sortedMetrics.length}
                  duration={1.8}
                />
              </div>
              <div className="text-sm text-orange-700">Total Metrics</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </GlowingCard>
  );
};

export default MetricComparison;