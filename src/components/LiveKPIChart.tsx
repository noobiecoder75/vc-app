import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, DollarSign, Target, Clock, Users } from 'lucide-react';
import { fetchKPIData, KPIData } from '../lib/kpiService';

interface LiveKPIChartProps {
  companyId: string;
  companyName?: string;
}

const LiveKPIChart: React.FC<LiveKPIChartProps> = ({ companyId, companyName }) => {
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadKPIData = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await fetchKPIData(companyId);
        setKpiData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load KPI data');
        console.error('Failed to load KPI data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadKPIData();
  }, [companyId]);

  const getMetricIcon = (metricName: string) => {
    const name = metricName.toLowerCase();
    if (name.includes('revenue') || name.includes('mrr') || name.includes('arr')) {
      return <DollarSign className="w-4 h-4 text-green-500" />;
    }
    if (name.includes('users') || name.includes('customer')) {
      return <Users className="w-4 h-4 text-blue-500" />;
    }
    if (name.includes('runway') || name.includes('months')) {
      return <Clock className="w-4 h-4 text-purple-500" />;
    }
    if (name.includes('ratio') || name.includes('ltv') || name.includes('cac')) {
      return <Target className="w-4 h-4 text-orange-500" />;
    }
    return <BarChart3 className="w-4 h-4 text-gray-500" />;
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'USD' || unit === '$') {
      return `$${value.toLocaleString()}`;
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    if (unit === 'months') {
      return `${value} months`;
    }
    if (unit === ':1') {
      return `${value.toFixed(1)}:1`;
    }
    return `${value.toLocaleString()}${unit ? ` ${unit}` : ''}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 h-24"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to Load KPIs</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!kpiData || kpiData.metrics.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No KPI Data Available</h3>
          <p className="text-gray-600 text-sm">
            No metrics were found for this startup. Try uploading a document with financial data or KPIs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            {companyName || kpiData.company.name || 'Startup'} KPIs
          </h3>
          <p className="text-sm text-gray-600">Real-time performance metrics</p>
        </div>
        <BarChart3 className="w-6 h-6 text-blue-600" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiData.metrics.slice(0, 8).map((metric, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getMetricIcon(metric.name)}
                <span className="text-sm font-medium text-gray-600 truncate">
                  {metric.name}
                </span>
              </div>
              {metric.trend && (
                metric.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500" />
                )
              )}
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {formatValue(metric.value, metric.unit)}
            </div>
            
            {metric.change !== undefined && (
              <div className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change > 0 ? '+' : ''}{metric.change.toFixed(1)}% from last period
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Company Goals Section */}
      {(kpiData.company.valuation_target_usd || kpiData.company.funding_goal_usd) && (
        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Company Goals</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {kpiData.company.valuation_target_usd && (
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm font-medium text-blue-600 mb-1">Target Valuation</div>
                <div className="text-2xl font-bold text-blue-900">
                  ${(kpiData.company.valuation_target_usd / 1000000).toFixed(1)}M
                </div>
              </div>
            )}
            {kpiData.company.funding_goal_usd && (
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm font-medium text-purple-600 mb-1">Funding Goal</div>
                <div className="text-2xl font-bold text-purple-900">
                  ${(kpiData.company.funding_goal_usd / 1000000).toFixed(1)}M
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Simple chart representation */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Metrics Overview</h4>
        <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-end justify-between p-4">
          {kpiData.metrics.slice(0, 7).map((metric, index) => {
            const height = Math.min(Math.max((metric.value / Math.max(...kpiData.metrics.map(m => m.value))) * 100, 10), 100);
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t w-8 transition-all duration-300 hover:opacity-80"
                  style={{ height: `${height}%` }}
                  title={`${metric.name}: ${formatValue(metric.value, metric.unit)}`}
                ></div>
                <div className="text-xs text-gray-600 mt-2 text-center w-12 truncate">
                  {metric.name.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveKPIChart;