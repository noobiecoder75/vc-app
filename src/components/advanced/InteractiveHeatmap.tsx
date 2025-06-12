import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../ui/tooltip';
import AnimatedCounter from './AnimatedCounter';
import GlowingCard from './GlowingCard';
import { Activity, TrendingUp, Zap, Target } from 'lucide-react';

interface HeatmapData {
  x: number;
  y: number;
  value: number;
  label: string;
  category?: string;
}

interface InteractiveHeatmapProps {
  title: string;
  data: HeatmapData[];
  width?: number;
  height?: number;
  colorScheme?: 'blue' | 'emerald' | 'purple' | 'orange';
  showLabels?: boolean;
  className?: string;
}

const InteractiveHeatmap: React.FC<InteractiveHeatmapProps> = ({
  title,
  data,
  width = 400,
  height = 300,
  colorScheme = 'blue',
  showLabels = true,
  className = ''
}) => {
  const [hoveredCell, setHoveredCell] = useState<HeatmapData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));

  const getColorIntensity = (value: number) => {
    const normalized = (value - minValue) / (maxValue - minValue);
    return Math.max(0.1, normalized);
  };

  const getColorByScheme = (intensity: number) => {
    const schemes = {
      blue: `rgba(59, 130, 246, ${intensity})`,
      emerald: `rgba(16, 185, 129, ${intensity})`,
      purple: `rgba(139, 92, 246, ${intensity})`,
      orange: `rgba(249, 115, 22, ${intensity})`
    };
    return schemes[colorScheme];
  };

  const categories = [...new Set(data.map(d => d.category).filter(Boolean))];
  const filteredData = selectedCategory 
    ? data.filter(d => d.category === selectedCategory)
    : data;

  const cellSize = Math.min(width / 10, height / 8);

  return (
    <TooltipProvider>
      <GlowingCard glowColor={colorScheme} intensity="medium" className={className}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center">
                <Activity className="w-5 h-5 text-blue-600 mr-2" />
                {title}
                <Badge variant="info" className="ml-2">
                  <Zap className="w-3 h-3 mr-1" />
                  Interactive
                </Badge>
              </CardTitle>
              {categories.length > 0 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      !selectedCategory 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        selectedCategory === category
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Heatmap */}
              <div className="flex-1">
                <svg width={width} height={height} className="border rounded-lg">
                  {filteredData.map((cell, index) => (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <motion.rect
                          x={cell.x * cellSize}
                          y={cell.y * cellSize}
                          width={cellSize - 2}
                          height={cellSize - 2}
                          fill={getColorByScheme(getColorIntensity(cell.value))}
                          stroke="white"
                          strokeWidth={1}
                          rx={2}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.02 }}
                          whileHover={{ scale: 1.1 }}
                          className="cursor-pointer"
                          onMouseEnter={() => setHoveredCell(cell)}
                          onMouseLeave={() => setHoveredCell(null)}
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <div className="font-medium">{cell.label}</div>
                          <div className="text-sm text-gray-600">
                            Value: <AnimatedCounter value={cell.value} duration={1} />
                          </div>
                          {cell.category && (
                            <div className="text-xs text-gray-500">
                              Category: {cell.category}
                            </div>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                  
                  {showLabels && filteredData.map((cell, index) => (
                    <text
                      key={`label-${index}`}
                      x={cell.x * cellSize + cellSize / 2}
                      y={cell.y * cellSize + cellSize / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs font-medium fill-white pointer-events-none"
                      style={{
                        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.5))'
                      }}
                    >
                      {cell.value}
                    </text>
                  ))}
                </svg>
              </div>

              {/* Legend and Stats */}
              <div className="w-full lg:w-64 space-y-4">
                {/* Color Legend */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Intensity Scale</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                    <div className="h-4 rounded-full bg-gradient-to-r from-gray-200 to-blue-600"></div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span><AnimatedCounter value={minValue} duration={1.5} /></span>
                      <span><AnimatedCounter value={maxValue} duration={1.5} /></span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-900">Total Cells</span>
                      <span className="text-lg font-bold text-blue-600">
                        <AnimatedCounter value={filteredData.length} duration={1} />
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-900">Average</span>
                      <span className="text-lg font-bold text-emerald-600">
                        <AnimatedCounter 
                          value={filteredData.reduce((sum, d) => sum + d.value, 0) / filteredData.length} 
                          decimals={1}
                          duration={1.2} 
                        />
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-purple-900">Peak Value</span>
                      <span className="text-lg font-bold text-purple-600">
                        <AnimatedCounter value={maxValue} duration={1.4} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hovered Cell Info */}
                {hoveredCell && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg"
                  >
                    <div className="flex items-center mb-2">
                      <Target className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">Selected Cell</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Label:</span>
                        <span className="font-medium">{hoveredCell.label}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value:</span>
                        <span className="font-bold text-blue-600">
                          <AnimatedCounter value={hoveredCell.value} duration={0.8} />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Position:</span>
                        <span className="font-medium">({hoveredCell.x}, {hoveredCell.y})</span>
                      </div>
                      {hoveredCell.category && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="font-medium">{hoveredCell.category}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </GlowingCard>
    </TooltipProvider>
  );
};

export default InteractiveHeatmap;