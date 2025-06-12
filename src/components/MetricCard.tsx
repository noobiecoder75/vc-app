import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import InsightTooltip from './InsightTooltip';
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, Target, BarChart3 } from 'lucide-react';
import { formatCurrency, formatNumber, getMetricInsight } from '../lib/utils';

interface MetricCardProps {
  name: string;
  value: number;
  unit: string;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  benchmark?: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
  industry?: string;
  insight?: string;
  examples?: string[];
}

const MetricCard: React.FC<MetricCardProps> = ({
  name,
  value,
  unit,
  change,
  trend,
  benchmark,
  industry,
  insight,
  examples
}) => {
  const getMetricIcon = (metricName: string) => {
    const lowerName = metricName.toLowerCase();
    if (lowerName.includes('revenue') || lowerName.includes('mrr')) {
      return <DollarSign className="w-4 h-4 text-emerald-600" />;
    }
    if (lowerName.includes('users') || lowerName.includes('customer')) {
      return <Users className="w-4 h-4 text-blue-600" />;
    }
    if (lowerName.includes('cac') || lowerName.includes('ltv')) {
      return <Target className="w-4 h-4 text-purple-600" />;
    }
    return <BarChart3 className="w-4 h-4 text-gray-600" />;
  };

  const formatValue = (val: number, unit: string) => {
    if (unit === 'USD' || unit === '$') {
      return formatCurrency(val);
    }
    if (unit === '%') {
      return `${val.toFixed(1)}%`;
    }
    if (unit === 'count') {
      return formatNumber(val);
    }
    return `${formatNumber(val)}${unit ? ` ${unit}` : ''}`;
  };

  const getBenchmarkStatus = () => {
    if (!benchmark) return null;
    
    const isLowerBetter = name.toLowerCase().includes('churn') || name.toLowerCase().includes('cac');
    
    if (isLowerBetter) {
      if (value <= benchmark.excellent) return { status: 'excellent', label: 'Excellent' };
      if (value <= benchmark.good) return { status: 'good', label: 'Good' };
      if (value <= benchmark.average) return { status: 'average', label: 'Average' };
      return { status: 'poor', label: 'Needs Improvement' };
    } else {
      if (value >= benchmark.excellent) return { status: 'excellent', label: 'Excellent' };
      if (value >= benchmark.good) return { status: 'good', label: 'Good' };
      if (value >= benchmark.average) return { status: 'average', label: 'Average' };
      return { status: 'poor', label: 'Needs Improvement' };
    }
  };

  const benchmarkStatus = getBenchmarkStatus();
  const metricInsight = insight || getMetricInsight(name, value, industry);

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-600" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-600';
    if (trend === 'down') return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <InsightTooltip
      title={name}
      description={`Current value: ${formatValue(value, unit)}`}
      insight={metricInsight}
      benchmark={benchmark ? {
        value: benchmark.excellent,
        label: `Excellent: ${formatValue(benchmark.excellent, unit)}`,
        status: benchmarkStatus?.status as any || 'average'
      } : undefined}
      actionable={benchmarkStatus?.status === 'poor' ? 
        `Focus on improving ${name.toLowerCase()} to reach industry standards` : 
        undefined
      }
      examples={examples}
      type={benchmarkStatus?.status === 'excellent' ? 'success' : 
           benchmarkStatus?.status === 'poor' ? 'warning' : 'info'}
    >
      <Card className="hover-glow transition-all duration-300 cursor-help">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 flex items-center space-x-2">
            {getMetricIcon(name)}
            <span>{name}</span>
          </CardTitle>
          {benchmarkStatus && (
            <Badge 
              variant={benchmarkStatus.status === 'excellent' ? 'success' : 
                      benchmarkStatus.status === 'good' ? 'info' :
                      benchmarkStatus.status === 'average' ? 'warning' : 'destructive'}
              className="text-xs"
            >
              {benchmarkStatus.label}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              {formatValue(value, unit)}
            </div>
            {change !== undefined && (
              <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
                {getTrendIcon()}
                <span>{change > 0 ? '+' : ''}{change.toFixed(1)}%</span>
              </div>
            )}
          </div>
          
          {benchmark && (
            <div className="mt-2 text-xs text-gray-500">
              <div className="flex justify-between">
                <span>Poor: {formatValue(benchmark.poor, unit)}</span>
                <span>Excellent: {formatValue(benchmark.excellent, unit)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                <div 
                  className={`h-1 rounded-full ${
                    benchmarkStatus?.status === 'excellent' ? 'bg-emerald-500' :
                    benchmarkStatus?.status === 'good' ? 'bg-blue-500' :
                    benchmarkStatus?.status === 'average' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, Math.max(10, 
                      ((value - benchmark.poor) / (benchmark.excellent - benchmark.poor)) * 100
                    ))}%` 
                  }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </InsightTooltip>
  );
};

export default MetricCard;