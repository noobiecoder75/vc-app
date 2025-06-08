import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ChartData {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

const KPIChart = () => {
  const data: ChartData[] = [
    { name: 'Revenue', value: 25000, change: 12.5, trend: 'up' },
    { name: 'Users', value: 1250, change: 8.2, trend: 'up' },
    { name: 'CAC', value: 45, change: -5.3, trend: 'down' },
    { name: 'Churn', value: 2.1, change: -1.2, trend: 'down' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Performance Overview</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">{item.name}</span>
              {item.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500" />
              )}
            </div>
            
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {item.name === 'Revenue' || item.name === 'CAC' ? '$' : ''}
              {item.value.toLocaleString()}
              {item.name === 'Churn' ? '%' : ''}
            </div>
            
            <div className={`text-sm ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {item.change > 0 ? '+' : ''}{item.change}% from last month
            </div>
          </div>
        ))}
      </div>
      
      {/* Simple chart representation */}
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Growth Trend</h4>
        <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-end justify-between p-4">
          {[40, 55, 65, 45, 70, 85, 90].map((height, index) => (
            <div
              key={index}
              className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t w-8"
              style={{ height: `${height}%` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KPIChart;