import React from 'react';
import { Target, TrendingUp } from 'lucide-react';

const ValuationProgress = () => {
  const currentValuation = 2500000;
  const targetValuation = 5000000;
  const progress = (currentValuation / targetValuation) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Valuation Goal</h3>
        <Target className="w-6 h-6 text-blue-600" />
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Current Progress</span>
          <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            ${(currentValuation / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-gray-600">Current Valuation</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            ${(targetValuation / 1000000).toFixed(1)}M
          </div>
          <div className="text-sm text-gray-600">Target Valuation</div>
        </div>
      </div>
      
      <div className="flex items-center justify-center space-x-2 text-green-600">
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm font-medium">On track to reach goal in 18 months</span>
      </div>
    </div>
  );
};

export default ValuationProgress;