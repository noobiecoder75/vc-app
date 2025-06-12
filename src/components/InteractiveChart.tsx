import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import InsightTooltip from './InsightTooltip';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  change?: number;
  benchmark?: number;
}

interface InteractiveChartProps {
  title: string;
  data: ChartData[];
  type: 'line' | 'bar' | 'pie';
  insight?: string;
  benchmark?: {
    value: number;
    label: string;
    status: 'excellent' | 'good' | 'average' | 'poor';
  };
  examples?: string[];
}

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  title,
  data,
  type,
  insight,
  benchmark,
  examples
}) => {
  const colors = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-blue-600">
            Value: <span className="font-semibold">{payload[0].value.toLocaleString()}</span>
          </p>
          {data.change && (
            <p className={`text-sm ${data.change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              Change: {data.change > 0 ? '+' : ''}{data.change.toFixed(1)}%
            </p>
          )}
          {data.benchmark && (
            <p className="text-sm text-gray-600">
              Benchmark: {data.benchmark.toLocaleString()}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getChartIcon = () => {
    switch (type) {
      case 'line':
        return <Activity className="w-5 h-5 text-blue-600" />;
      case 'bar':
        return <BarChart3 className="w-5 h-5 text-purple-600" />;
      case 'pie':
        return <PieChartIcon className="w-5 h-5 text-emerald-600" />;
      default:
        return <BarChart3 className="w-5 h-5 text-gray-600" />;
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
              {benchmark && (
                <Line 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#6b7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };

  return (
    <InsightTooltip
      title={title}
      description={`Interactive ${type} chart showing key metrics`}
      insight={insight || `This ${type} chart visualizes important trends and patterns in your data`}
      benchmark={benchmark}
      examples={examples}
      actionable="Hover over data points for detailed insights"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="hover-glow transition-all duration-300 cursor-help">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              {getChartIcon()}
              <span>{title}</span>
            </CardTitle>
            {benchmark && (
              <Badge 
                variant={benchmark.status === 'excellent' ? 'success' : 
                        benchmark.status === 'good' ? 'info' :
                        benchmark.status === 'average' ? 'warning' : 'destructive'}
              >
                {benchmark.label}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {renderChart()}
            
            {/* Summary Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {Math.max(...data.map(d => d.value)).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Peak</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {Math.round(data.reduce((sum, d) => sum + d.value, 0) / data.length).toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Average</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-900">
                  {data.length}
                </div>
                <div className="text-xs text-gray-600">Data Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </InsightTooltip>
  );
};

export default InteractiveChart;