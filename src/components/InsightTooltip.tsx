import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Badge } from './ui/badge';
import { Info, TrendingUp, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface InsightTooltipProps {
  children: React.ReactNode;
  title: string;
  description: string;
  insight?: string;
  benchmark?: {
    value: number;
    label: string;
    status: 'excellent' | 'good' | 'average' | 'poor';
  };
  actionable?: string;
  examples?: string[];
  type?: 'info' | 'success' | 'warning' | 'error';
}

const InsightTooltip: React.FC<InsightTooltipProps> = ({
  children,
  title,
  description,
  insight,
  benchmark,
  actionable,
  examples,
  type = 'info'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBenchmarkColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'good':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'average':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="cursor-help">
          {children}
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start space-x-2">
            {getIcon()}
            <div className="flex-1">
              <h4 className="font-semibold text-sm text-gray-900">{title}</h4>
              <p className="text-xs text-gray-600 mt-1">{description}</p>
            </div>
          </div>

          {/* Benchmark */}
          {benchmark && (
            <div className={`p-2 rounded-lg border ${getBenchmarkColor(benchmark.status)}`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">Industry Benchmark</span>
                <Badge variant="outline" className="text-xs">
                  {benchmark.label}
                </Badge>
              </div>
              <div className="text-sm font-semibold mt-1">
                {benchmark.value}
              </div>
            </div>
          )}

          {/* Insight */}
          {insight && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="flex items-start space-x-2">
                <TrendingUp className="w-3 h-3 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-800">{insight}</p>
              </div>
            </div>
          )}

          {/* Actionable */}
          {actionable && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2">
              <div className="flex items-start space-x-2">
                <ArrowRight className="w-3 h-3 text-emerald-600 mt-0.5" />
                <p className="text-xs text-emerald-800 font-medium">{actionable}</p>
              </div>
            </div>
          )}

          {/* Examples */}
          {examples && examples.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">Success Examples:</p>
              {examples.map((example, index) => (
                <p key={index} className="text-xs text-gray-600 pl-2 border-l-2 border-gray-200">
                  {example}
                </p>
              ))}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default InsightTooltip;