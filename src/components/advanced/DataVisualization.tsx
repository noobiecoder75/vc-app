import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import AnimatedCounter from './AnimatedCounter';
import GlowingCard from './GlowingCard';
import InsightTooltip from '../InsightTooltip';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Activity, 
  Target,
  Zap,
  Brain,
  Star,
  Award
} from 'lucide-react';

interface DataPoint {
  name: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

interface DataVisualizationProps {
  title: string;
  data: DataPoint[];
  type?: 'bar' | 'line' | 'pie' | 'metric';
  showTrends?: boolean;
  showBenchmarks?: boolean;
  className?: string;
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  title,
  data,
  type = 'bar',
  showTrends = true,
  showBenchmarks = false,
  className = ''
}) => {
  const [selectedView, setSelectedView] = useState<'chart' | 'table' | 'insights'>('chart');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const renderBarChart = () => (
    <div className="space-y-4">
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">{item.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                <AnimatedCounter value={item.value} duration={1.5 + index * 0.2} />
              </span>
              {showTrends && item.change && (
                <div className={`flex items-center text-sm ${
                  item.change > 0 ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {item.change > 0 ? (
                    <TrendingUp className="w-3 h-3 mr-1" />
                  ) : (
                    <TrendingDown className="w-3 h-3 mr-1" />
                  )}
                  {Math.abs(item.change).toFixed(1)}%
                </div>
              )}
            </div>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{ 
                backgroundColor: item.color || colors[index % colors.length],
                boxShadow: hoveredIndex === index ? `0 0 10px ${item.color || colors[index % colors.length]}40` : 'none'
              }}
              initial={{ width: 0 }}
              animate={{ width: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center">
        <div className="relative w-64 h-64">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const startAngle = currentAngle;
              currentAngle += angle;

              const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos(((startAngle + angle) * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin(((startAngle + angle) * Math.PI) / 180);

              const largeArcFlag = angle > 180 ? 1 : 0;

              return (
                <motion.path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                  fill={item.color || colors[index % colors.length]}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="hover:opacity-80 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                <AnimatedCounter value={total} duration={2} />
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
        <div className="ml-8 space-y-2">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                hoveredIndex === index ? 'bg-gray-100' : ''
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color || colors[index % colors.length] }}
              />
              <span className="text-sm font-medium text-gray-700">{item.name}</span>
              <span className="text-sm text-gray-600">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

  const renderMetricCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <InsightTooltip
            title={item.name}
            description={`Current value: ${item.value.toLocaleString()}`}
            insight={`This metric shows ${item.trend === 'up' ? 'positive' : item.trend === 'down' ? 'negative' : 'stable'} performance`}
            benchmark={item.change ? {
              value: Math.abs(item.change),
              label: `${item.change > 0 ? '+' : ''}${item.change.toFixed(1)}% change`,
              status: item.change > 0 ? 'excellent' : 'average'
            } : undefined}
          >
            <GlowingCard 
              glowColor={index % 4 === 0 ? 'blue' : index % 4 === 1 ? 'emerald' : index % 4 === 2 ? 'purple' : 'orange'}
              intensity="low"
              className="cursor-help"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color || colors[index % colors.length] }}
                      />
                      <span className="text-sm font-medium text-gray-600">{item.name}</span>
                    </div>
                    {item.trend && (
                      <div className={`p-1 rounded-full ${
                        item.trend === 'up' ? 'bg-emerald-100' : 
                        item.trend === 'down' ? 'bg-red-100' : 'bg-gray-100'
                      }`}>
                        {item.trend === 'up' ? (
                          <TrendingUp className="w-3 h-3 text-emerald-600" />
                        ) : item.trend === 'down' ? (
                          <TrendingDown className="w-3 h-3 text-red-600" />
                        ) : (
                          <Activity className="w-3 h-3 text-gray-600" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    <AnimatedCounter value={item.value} duration={1.5 + index * 0.2} />
                  </div>
                  {item.change && (
                    <div className={`text-sm font-medium ${
                      item.change > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}% from last period
                    </div>
                  )}
                </CardContent>
              </Card>
            </GlowingCard>
          </InsightTooltip>
        </motion.div>
      ))}
    </div>
  );

  const renderTable = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Metric</th>
            <th className="text-right py-3 px-4 font-medium text-gray-700">Value</th>
            {showTrends && <th className="text-right py-3 px-4 font-medium text-gray-700">Change</th>}
            <th className="text-right py-3 px-4 font-medium text-gray-700">Trend</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color || colors[index % colors.length] }}
                  />
                  <span className="font-medium text-gray-900">{item.name}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-right font-bold text-gray-900">
                <AnimatedCounter value={item.value} duration={1.5} />
              </td>
              {showTrends && (
                <td className="py-3 px-4 text-right">
                  {item.change && (
                    <span className={`font-medium ${
                      item.change > 0 ? 'text-emerald-600' : 'text-red-600'
                    }`}>
                      {item.change > 0 ? '+' : ''}{item.change.toFixed(1)}%
                    </span>
                  )}
                </td>
              )}
              <td className="py-3 px-4 text-right">
                {item.trend && (
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    item.trend === 'up' ? 'bg-emerald-100 text-emerald-800' :
                    item.trend === 'down' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : item.trend === 'down' ? (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    ) : (
                      <Activity className="w-3 h-3 mr-1" />
                    )}
                    {item.trend}
                  </div>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderInsights = () => {
    const topPerformer = data.reduce((max, item) => item.value > max.value ? item : max, data[0]);
    const avgValue = data.reduce((sum, item) => sum + item.value, 0) / data.length;
    const positiveChanges = data.filter(item => item.change && item.change > 0).length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlowingCard glowColor="emerald" intensity="low">
            <Card>
              <CardContent className="p-6 text-center">
                <Star className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900 mb-1">Top Performer</div>
                <div className="text-sm text-gray-600 mb-2">{topPerformer.name}</div>
                <div className="text-2xl font-bold text-emerald-600">
                  <AnimatedCounter value={topPerformer.value} duration={2} />
                </div>
              </CardContent>
            </Card>
          </GlowingCard>

          <GlowingCard glowColor="blue" intensity="low">
            <Card>
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900 mb-1">Average</div>
                <div className="text-sm text-gray-600 mb-2">Across all metrics</div>
                <div className="text-2xl font-bold text-blue-600">
                  <AnimatedCounter value={avgValue} duration={2.2} />
                </div>
              </CardContent>
            </Card>
          </GlowingCard>

          <GlowingCard glowColor="purple" intensity="low">
            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900 mb-1">Growing</div>
                <div className="text-sm text-gray-600 mb-2">Positive trends</div>
                <div className="text-2xl font-bold text-purple-600">
                  <AnimatedCounter value={positiveChanges} duration={1.8} />
                  <span className="text-lg">/{data.length}</span>
                </div>
              </CardContent>
            </Card>
          </GlowingCard>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="w-5 h-5 text-blue-600 mr-2" />
              AI Insights
              <Badge variant="info" className="ml-2">
                <Zap className="w-3 h-3 mr-1" />
                Generated
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Performance Summary</h4>
                <p className="text-blue-800 text-sm">
                  Your metrics show {positiveChanges > data.length / 2 ? 'strong positive momentum' : 'mixed performance'} 
                  with {topPerformer.name} leading at {topPerformer.value.toLocaleString()}.
                </p>
              </div>
              
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-medium text-emerald-900 mb-2">Recommendations</h4>
                <ul className="text-emerald-800 text-sm space-y-1">
                  <li>• Focus on scaling {topPerformer.name} strategies</li>
                  <li>• Monitor metrics below average for improvement opportunities</li>
                  <li>• Maintain current positive trends through consistent execution</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <GlowingCard glowColor="blue" intensity="medium" className={className}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
              {title}
              <Badge variant="success" className="ml-2">
                <Award className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={selectedView === 'chart' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('chart')}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
              <Button
                variant={selectedView === 'table' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('table')}
              >
                Table
              </Button>
              <Button
                variant={selectedView === 'insights' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedView('insights')}
              >
                <Brain className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {selectedView === 'chart' && (
                <>
                  {type === 'bar' && renderBarChart()}
                  {type === 'pie' && renderPieChart()}
                  {type === 'metric' && renderMetricCards()}
                </>
              )}
              {selectedView === 'table' && renderTable()}
              {selectedView === 'insights' && renderInsights()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </GlowingCard>
  );
};

export default DataVisualization;