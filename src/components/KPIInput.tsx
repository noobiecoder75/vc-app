import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';

interface KPIMetric {
  name: string;
  value: string;
  icon: React.ElementType;
  unit: string;
}

const KPIInput = () => {
  const [metrics, setMetrics] = useState<KPIMetric[]>([
    { name: 'Monthly Revenue', value: '', icon: DollarSign, unit: '$' },
    { name: 'Customer Acquisition Cost', value: '', icon: Target, unit: '$' },
    { name: 'Monthly Active Users', value: '', icon: Users, unit: '' },
    { name: 'Growth Rate', value: '', icon: TrendingUp, unit: '%' },
  ]);

  const handleInputChange = (index: number, value: string) => {
    const updatedMetrics = [...metrics];
    updatedMetrics[index].value = value;
    setMetrics(updatedMetrics);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Performance Indicators</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Icon className="w-4 h-4 mr-2 text-blue-600" />
                {metric.name}
              </label>
              <div className="relative">
                {metric.unit && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {metric.unit}
                  </span>
                )}
                <input
                  type="number"
                  value={metric.value}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    metric.unit ? 'pl-8' : ''
                  }`}
                  placeholder="Enter value"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
        Save KPIs
      </button>
    </div>
  );
};

export default KPIInput;