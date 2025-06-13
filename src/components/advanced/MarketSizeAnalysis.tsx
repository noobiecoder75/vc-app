import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import AnimatedCounter from './AnimatedCounter';
import GlowingCard from './GlowingCard';
import InsightTooltip from '../InsightTooltip';
import { 
  Globe, 
  TrendingUp, 
  Target, 
  BarChart3, 
  PieChart, 
  Users, 
  DollarSign,
  Zap,
  Brain,
  Award,
  ArrowUp,
  ArrowDown,
  Activity,
  Layers,
  Map,
  Building2,
  Rocket,
  Star
} from 'lucide-react';

interface MarketData {
  tam: number;
  sam: number;
  som: number;
  currentMarketShare: number;
  targetMarketShare: number;
  marketGrowthRate: number;
  competitorCount: number;
  marketMaturity: 'emerging' | 'growth' | 'mature' | 'declining';
}

interface CompetitorData {
  name: string;
  marketShare: number;
  revenue: number;
  valuation: number;
  stage: string;
  strengths: string[];
  weaknesses: string[];
}

interface MarketSizeAnalysisProps {
  companyId?: string;
  industry?: string;
  className?: string;
}

const MarketSizeAnalysis: React.FC<MarketSizeAnalysisProps> = ({
  companyId,
  industry = 'SaaS',
  className = ''
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'bottomup' | 'topdown' | 'competitive'>('overview');
  const [selectedRegion, setSelectedRegion] = useState<'global' | 'north-america' | 'europe' | 'asia-pacific'>('global');
  const [timeHorizon, setTimeHorizon] = useState<'1year' | '3year' | '5year'>('3year');

  // Sample market data - in real app, this would come from props/API
  const marketData: MarketData = {
    tam: 150000000000, // $150B
    sam: 25000000000,  // $25B
    som: 2500000000,   // $2.5B
    currentMarketShare: 0.05, // 0.05%
    targetMarketShare: 2.0,   // 2%
    marketGrowthRate: 15.2,   // 15.2% CAGR
    competitorCount: 1247,
    marketMaturity: 'growth'
  };

  const competitors: CompetitorData[] = [
    {
      name: 'Market Leader Corp',
      marketShare: 23.5,
      revenue: 5875000000,
      valuation: 45000000000,
      stage: 'Public',
      strengths: ['Brand Recognition', 'Enterprise Sales', 'Global Presence'],
      weaknesses: ['Legacy Technology', 'High Prices', 'Slow Innovation']
    },
    {
      name: 'Innovation Dynamics',
      marketShare: 12.8,
      revenue: 3200000000,
      valuation: 18000000000,
      stage: 'Series D',
      strengths: ['Modern Tech Stack', 'Fast Growth', 'Developer-Friendly'],
      weaknesses: ['Limited Enterprise', 'Narrow Focus', 'Funding Dependent']
    },
    {
      name: 'Global Solutions Inc',
      marketShare: 8.9,
      revenue: 2225000000,
      valuation: 12000000000,
      stage: 'Public',
      strengths: ['International Reach', 'Partnerships', 'Compliance'],
      weaknesses: ['Complex Product', 'Poor UX', 'High Churn']
    }
  ];

  const bottomUpData = {
    totalAddressableCustomers: 2500000,
    targetCustomerSegments: [
      { name: 'Enterprise (1000+ employees)', size: 125000, penetration: 15, avgRevenue: 50000 },
      { name: 'Mid-Market (100-999 employees)', size: 750000, penetration: 8, avgRevenue: 15000 },
      { name: 'SMB (10-99 employees)', size: 1625000, penetration: 3, avgRevenue: 3000 }
    ],
    conversionRates: {
      awareness: 25,
      consideration: 40,
      trial: 60,
      purchase: 35
    }
  };

  const topDownData = {
    totalMarketValue: marketData.tam,
    marketSegments: [
      { name: 'Core Platform', percentage: 45, value: marketData.tam * 0.45 },
      { name: 'Analytics & BI', percentage: 25, value: marketData.tam * 0.25 },
      { name: 'Integration Services', percentage: 20, value: marketData.tam * 0.20 },
      { name: 'Professional Services', percentage: 10, value: marketData.tam * 0.10 }
    ],
    geographicSplit: [
      { region: 'North America', percentage: 42, value: marketData.tam * 0.42 },
      { region: 'Europe', percentage: 28, value: marketData.tam * 0.28 },
      { region: 'Asia Pacific', percentage: 22, value: marketData.tam * 0.22 },
      { region: 'Rest of World', percentage: 8, value: marketData.tam * 0.08 }
    ]
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) return `$${(amount / 1000000000).toFixed(1)}B`;
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case 'emerging': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'growth': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'mature': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'declining': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Header with Controls */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <GlowingCard glowColor="blue" intensity="medium">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
                      <Globe className="w-7 h-7 text-blue-600" />
                      <span>Market Size Analysis</span>
                      <Badge variant="success" className="text-sm">
                        <Brain className="w-3 h-3 mr-1" />
                        AI-Powered
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-600 mt-1">
                      Comprehensive market analysis with bottom-up and top-down approaches
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger className="w-40">
                        <Map className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select value={timeHorizon} onValueChange={setTimeHorizon}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1year">1 Year</SelectItem>
                        <SelectItem value="3year">3 Years</SelectItem>
                        <SelectItem value="5year">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Market Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <InsightTooltip
                    title="Total Addressable Market"
                    description="The total market demand for your product category"
                    insight="TAM represents the maximum revenue opportunity if you captured 100% market share"
                    examples={["Uber's TAM includes all transportation", "Airbnb's TAM includes all accommodation"]}
                  >
                    <div className="bg-blue-50 rounded-lg p-4 cursor-help hover:bg-blue-100 transition-colors">
                      <div className="text-2xl font-bold text-blue-600">
                        <AnimatedCounter 
                          value={marketData.tam / 1000000000} 
                          prefix="$"
                          suffix="B"
                          decimals={0}
                          duration={2}
                        />
                      </div>
                      <div className="text-sm text-blue-700">Total Addressable Market</div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Serviceable Addressable Market"
                    description="The portion of TAM you can realistically target"
                    insight="SAM is your realistic market opportunity based on your business model"
                  >
                    <div className="bg-purple-50 rounded-lg p-4 cursor-help hover:bg-purple-100 transition-colors">
                      <div className="text-2xl font-bold text-purple-600">
                        <AnimatedCounter 
                          value={marketData.sam / 1000000000} 
                          prefix="$"
                          suffix="B"
                          decimals={0}
                          duration={2.2}
                        />
                      </div>
                      <div className="text-sm text-purple-700">Serviceable Addressable Market</div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Serviceable Obtainable Market"
                    description="The portion of SAM you can capture short-term"
                    insight="SOM is your immediate market opportunity based on current capabilities"
                  >
                    <div className="bg-emerald-50 rounded-lg p-4 cursor-help hover:bg-emerald-100 transition-colors">
                      <div className="text-2xl font-bold text-emerald-600">
                        <AnimatedCounter 
                          value={marketData.som / 1000000000} 
                          prefix="$"
                          suffix="B"
                          decimals={1}
                          duration={2.4}
                        />
                      </div>
                      <div className="text-sm text-emerald-700">Serviceable Obtainable Market</div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Market Growth Rate"
                    description="Annual compound growth rate of the market"
                    insight="High growth markets offer more opportunity but also more competition"
                  >
                    <div className="bg-orange-50 rounded-lg p-4 cursor-help hover:bg-orange-100 transition-colors">
                      <div className="text-2xl font-bold text-orange-600">
                        <AnimatedCounter 
                          value={marketData.marketGrowthRate} 
                          suffix="%"
                          decimals={1}
                          duration={2.6}
                        />
                      </div>
                      <div className="text-sm text-orange-700">Annual Growth Rate</div>
                    </div>
                  </InsightTooltip>
                </div>
              </CardHeader>
            </Card>
          </GlowingCard>
        </motion.div>
      </motion.div>

      {/* Main Analysis Tabs */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)}>
              <div className="border-b border-gray-200 px-6 pt-6">
                <TabsList className="grid w-full grid-cols-4 bg-gray-100 h-12">
                  <TabsTrigger 
                    value="overview" 
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <Globe className="w-4 h-4" />
                    <span className="hidden sm:inline">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bottomup"
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Bottom-Up</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="topdown"
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <Layers className="w-4 h-4" />
                    <span className="hidden sm:inline">Top-Down</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="competitive"
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <Target className="w-4 h-4" />
                    <span className="hidden sm:inline">Competitive</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                <TabsContent value="overview" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    {/* Market Maturity and Status */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <GlowingCard glowColor="emerald" intensity="low">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Activity className="w-5 h-5 text-emerald-600 mr-2" />
                              Market Maturity
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className={`inline-flex items-center px-3 py-2 rounded-full border ${getMaturityColor(marketData.marketMaturity)}`}>
                                <span className="font-medium capitalize">{marketData.marketMaturity} Market</span>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Market Growth</span>
                                  <span className="font-semibold text-emerald-600">
                                    <AnimatedCounter value={marketData.marketGrowthRate} suffix="%" decimals={1} />
                                  </span>
                                </div>
                                <Progress value={marketData.marketGrowthRate} className="h-2" />
                                
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Competitor Count</span>
                                  <span className="font-semibold text-gray-900">
                                    <AnimatedCounter value={marketData.competitorCount} />
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </GlowingCard>

                      <GlowingCard glowColor="purple" intensity="low">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Target className="w-5 h-5 text-purple-600 mr-2" />
                              Market Opportunity
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="text-center">
                                <div className="text-3xl font-bold text-purple-600 mb-1">
                                  <AnimatedCounter 
                                    value={(marketData.som / marketData.tam) * 100} 
                                    suffix="%" 
                                    decimals={2}
                                    duration={2}
                                  />
                                </div>
                                <div className="text-sm text-gray-600">SOM as % of TAM</div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Current Share</span>
                                  <span className="font-medium">{marketData.currentMarketShare}%</span>
                                </div>
                                <Progress value={marketData.currentMarketShare} className="h-2" />
                                
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-600">Target Share</span>
                                  <span className="font-medium">{marketData.targetMarketShare}%</span>
                                </div>
                                <Progress value={marketData.targetMarketShare} className="h-2" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </GlowingCard>
                    </div>

                    {/* TAM/SAM/SOM Visualization */}
                    <GlowingCard glowColor="blue" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <PieChart className="w-5 h-5 text-blue-600 mr-2" />
                            Market Size Breakdown
                            <Badge variant="info" className="ml-2">
                              <Zap className="w-3 h-3 mr-1" />
                              Interactive
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Visual Representation */}
                            <div className="flex items-center justify-center">
                              <div className="relative">
                                {/* TAM Circle */}
                                <div className="w-64 h-64 rounded-full bg-blue-100 border-4 border-blue-300 flex items-center justify-center relative">
                                  <span className="absolute top-4 text-xs font-medium text-blue-700">TAM</span>
                                  
                                  {/* SAM Circle */}
                                  <div className="w-40 h-40 rounded-full bg-purple-100 border-4 border-purple-300 flex items-center justify-center relative">
                                    <span className="absolute top-2 text-xs font-medium text-purple-700">SAM</span>
                                    
                                    {/* SOM Circle */}
                                    <div className="w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-300 flex items-center justify-center">
                                      <span className="text-xs font-medium text-emerald-700">SOM</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Market Size Details */}
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                  <div>
                                    <div className="font-semibold text-blue-900">Total Addressable Market</div>
                                    <div className="text-sm text-blue-700">Everyone who could use your product</div>
                                  </div>
                                  <div className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(marketData.tam)}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                                  <div>
                                    <div className="font-semibold text-purple-900">Serviceable Addressable Market</div>
                                    <div className="text-sm text-purple-700">Who you can realistically reach</div>
                                  </div>
                                  <div className="text-2xl font-bold text-purple-600">
                                    {formatCurrency(marketData.sam)}
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
                                  <div>
                                    <div className="font-semibold text-emerald-900">Serviceable Obtainable Market</div>
                                    <div className="text-sm text-emerald-700">Who you can capture short-term</div>
                                  </div>
                                  <div className="text-2xl font-bold text-emerald-600">
                                    {formatCurrency(marketData.som)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>
                  </motion.div>
                </TabsContent>

                {/* Bottom-Up Analysis Tab */}
                <TabsContent value="bottomup" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Bottom-Up Market Analysis</h3>
                      <p className="text-gray-600">Building market size from customer segments and unit economics</p>
                    </div>

                    {/* Customer Segments */}
                    <GlowingCard glowColor="emerald" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Users className="w-5 h-5 text-emerald-600 mr-2" />
                            Target Customer Segments
                            <Badge variant="success" className="ml-2">
                              <Building2 className="w-3 h-3 mr-1" />
                              B2B Focus
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {bottomUpData.targetCustomerSegments.map((segment, index) => {
                              const revenue = segment.size * (segment.penetration / 100) * segment.avgRevenue;
                              return (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                                    <Badge variant="outline">
                                      <AnimatedCounter value={segment.penetration} suffix="%" /> penetration
                                    </Badge>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                      <div className="text-lg font-bold text-blue-600">
                                        <AnimatedCounter value={segment.size / 1000} suffix="K" />
                                      </div>
                                      <div className="text-xs text-blue-700">Total Companies</div>
                                    </div>
                                    
                                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                                      <div className="text-lg font-bold text-purple-600">
                                        <AnimatedCounter value={segment.penetration} suffix="%" />
                                      </div>
                                      <div className="text-xs text-purple-700">Target Penetration</div>
                                    </div>
                                    
                                    <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                      <div className="text-lg font-bold text-emerald-600">
                                        {formatCurrency(segment.avgRevenue)}
                                      </div>
                                      <div className="text-xs text-emerald-700">Avg Revenue/Customer</div>
                                    </div>
                                    
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                      <div className="text-lg font-bold text-orange-600">
                                        {formatCurrency(revenue)}
                                      </div>
                                      <div className="text-xs text-orange-700">Segment Revenue</div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4">
                                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                                      <span>Market Penetration</span>
                                      <span>{segment.penetration}%</span>
                                    </div>
                                    <Progress value={segment.penetration} className="h-2" />
                                  </div>
                                </motion.div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>

                    {/* Conversion Funnel */}
                    <GlowingCard glowColor="purple" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                            Customer Acquisition Funnel
                            <Badge variant="info" className="ml-2">
                              <Rocket className="w-3 h-3 mr-1" />
                              Conversion Rates
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              {Object.entries(bottomUpData.conversionRates).map(([stage, rate], index) => (
                                <motion.div
                                  key={stage}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="text-center"
                                >
                                  <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
                                    <div className="text-3xl font-bold text-purple-600 mb-2">
                                      <AnimatedCounter value={rate} suffix="%" duration={1.5 + index * 0.2} />
                                    </div>
                                    <div className="text-sm font-medium text-gray-700 capitalize">{stage}</div>
                                    <div className="mt-2">
                                      <Progress value={rate} className="h-2" />
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                            
                            {/* Funnel Visualization */}
                            <div className="bg-gray-50 rounded-lg p-6">
                              <h4 className="font-medium text-gray-900 mb-4 text-center">Customer Journey Flow</h4>
                              <div className="flex items-center justify-center space-x-4">
                                {Object.entries(bottomUpData.conversionRates).map(([stage, rate], index) => (
                                  <React.Fragment key={stage}>
                                    <div className="text-center">
                                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center border-2 border-purple-300">
                                        <span className="text-sm font-bold text-purple-700">{rate}%</span>
                                      </div>
                                      <div className="text-xs text-gray-600 mt-2 capitalize">{stage}</div>
                                    </div>
                                    {index < Object.keys(bottomUpData.conversionRates).length - 1 && (
                                      <ArrowUp className="w-5 h-5 text-gray-400 rotate-90" />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>

                    {/* Bottom-Up Summary */}
                    <GlowingCard glowColor="blue" intensity="high">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold mb-4">Bottom-Up Market Calculation</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <div className="text-3xl font-bold mb-2">
                                <AnimatedCounter 
                                  value={bottomUpData.totalAddressableCustomers / 1000000} 
                                  suffix="M" 
                                  decimals={1}
                                  duration={2}
                                />
                              </div>
                              <div className="text-blue-100">Total Addressable Customers</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold mb-2">
                                <AnimatedCounter 
                                  value={bottomUpData.targetCustomerSegments.reduce((sum, seg) => 
                                    sum + (seg.size * seg.penetration / 100), 0) / 1000
                                  } 
                                  suffix="K" 
                                  decimals={0}
                                  duration={2.2}
                                />
                              </div>
                              <div className="text-blue-100">Reachable Customers</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold mb-2">
                                {formatCurrency(
                                  bottomUpData.targetCustomerSegments.reduce((sum, seg) => 
                                    sum + (seg.size * seg.penetration / 100 * seg.avgRevenue), 0
                                  )
                                )}
                              </div>
                              <div className="text-blue-100">Total Revenue Opportunity</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlowingCard>
                  </motion.div>
                </TabsContent>

                {/* Top-Down Analysis Tab */}
                <TabsContent value="topdown" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Top-Down Market Analysis</h3>
                      <p className="text-gray-600">Market size analysis from industry reports and research</p>
                    </div>

                    {/* Market Segments */}
                    <GlowingCard glowColor="orange" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Layers className="w-5 h-5 text-orange-600 mr-2" />
                            Market Segments Breakdown
                            <Badge variant="warning" className="ml-2">
                              <Star className="w-3 h-3 mr-1" />
                              Industry Data
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {topDownData.marketSegments.map((segment, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline">
                                      <AnimatedCounter value={segment.percentage} suffix="%" />
                                    </Badge>
                                    <span className="text-lg font-bold text-orange-600">
                                      {formatCurrency(segment.value)}
                                    </span>
                                  </div>
                                </div>
                                
                                <div className="space-y-2">
                                  <div className="flex justify-between text-sm text-gray-600">
                                    <span>Market Share</span>
                                    <span>{segment.percentage}%</span>
                                  </div>
                                  <Progress value={segment.percentage} className="h-3" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>

                    {/* Geographic Distribution */}
                    <GlowingCard glowColor="emerald" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Map className="w-5 h-5 text-emerald-600 mr-2" />
                            Geographic Market Distribution
                            <Badge variant="success" className="ml-2">
                              <Globe className="w-3 h-3 mr-1" />
                              Global
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Regional Breakdown */}
                            <div className="space-y-4">
                              {topDownData.geographicSplit.map((region, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="bg-emerald-50 rounded-lg p-4 border border-emerald-200"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-emerald-900">{region.region}</span>
                                    <span className="text-lg font-bold text-emerald-600">
                                      {formatCurrency(region.value)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between text-sm text-emerald-700 mb-1">
                                    <span>Market Share</span>
                                    <span>{region.percentage}%</span>
                                  </div>
                                  <Progress value={region.percentage} className="h-2" />
                                </motion.div>
                              ))}
                            </div>
                            
                            {/* Market Insights */}
                            <div className="space-y-4">
                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <h4 className="font-medium text-blue-900 mb-3">Market Insights</h4>
                                <div className="space-y-3 text-sm text-blue-800">
                                  <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <span>North America leads with 42% market share due to early adoption</span>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <span>Europe shows strong growth potential with increasing digitization</span>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <span>Asia Pacific is fastest growing region at 25% CAGR</span>
                                  </div>
                                  <div className="flex items-start space-x-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                    <span>Emerging markets offer significant untapped opportunity</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                                <h4 className="font-medium text-purple-900 mb-3">Growth Drivers</h4>
                                <div className="space-y-2 text-sm text-purple-800">
                                  <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                    <span>Digital transformation initiatives</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                    <span>Remote work adoption</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                    <span>AI and automation trends</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <TrendingUp className="w-4 h-4 text-purple-600" />
                                    <span>Regulatory compliance needs</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>

                    {/* Top-Down Summary */}
                    <GlowingCard glowColor="purple" intensity="high">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold mb-6">Top-Down Market Validation</h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                              <div className="text-3xl font-bold mb-2">
                                {formatCurrency(topDownData.totalMarketValue)}
                              </div>
                              <div className="text-purple-100">Total Market Value</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold mb-2">
                                <AnimatedCounter value={15.2} suffix="%" decimals={1} duration={2} />
                              </div>
                              <div className="text-purple-100">Annual Growth Rate</div>
                            </div>
                            <div>
                              <div className="text-3xl font-bold mb-2">
                                <AnimatedCounter value={5} duration={1.5} />
                              </div>
                              <div className="text-purple-100">Years to Maturity</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </GlowingCard>
                  </motion.div>
                </TabsContent>

                {/* Competitive Analysis Tab */}
                <TabsContent value="competitive" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Competitive Landscape</h3>
                      <p className="text-gray-600">Analysis of key competitors and market positioning</p>
                    </div>

                    {/* Competitor Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                      {competitors.map((competitor, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <GlowingCard 
                            glowColor={index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'purple' : 'emerald'}
                            intensity="low"
                          >
                            <Card className="h-full">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-lg">{competitor.name}</CardTitle>
                                  <Badge variant="outline">{competitor.stage}</Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="text-lg font-bold text-blue-600">
                                      <AnimatedCounter 
                                        value={competitor.marketShare} 
                                        suffix="%" 
                                        decimals={1}
                                        duration={1.5 + index * 0.2}
                                      />
                                    </div>
                                    <div className="text-xs text-blue-700">Market Share</div>
                                  </div>
                                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                    <div className="text-lg font-bold text-emerald-600">
                                      {formatCurrency(competitor.revenue)}
                                    </div>
                                    <div className="text-xs text-emerald-700">Revenue</div>
                                  </div>
                                </div>
                                
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                  <div className="text-xl font-bold text-purple-600">
                                    {formatCurrency(competitor.valuation)}
                                  </div>
                                  <div className="text-xs text-purple-700">Valuation</div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                                  <div className="space-y-1">
                                    {competitor.strengths.map((strength, i) => (
                                      <div key={i} className="flex items-center text-sm text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        {strength}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-medium text-red-700 mb-2">Weaknesses</h4>
                                  <div className="space-y-1">
                                    {competitor.weaknesses.map((weakness, i) => (
                                      <div key={i} className="flex items-center text-sm text-red-600">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                        {weakness}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </GlowingCard>
                        </motion.div>
                      ))}
                    </div>

                    {/* Market Share Visualization */}
                    <GlowingCard glowColor="blue" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <PieChart className="w-5 h-5 text-blue-600 mr-2" />
                            Market Share Distribution
                            <Badge variant="info" className="ml-2">
                              <Award className="w-3 h-3 mr-1" />
                              Competitive Position
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-4">
                              {competitors.map((competitor, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                  <span className="font-medium text-gray-900">{competitor.name}</span>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-24">
                                      <Progress value={competitor.marketShare} className="h-2" />
                                    </div>
                                    <span className="font-bold text-gray-700 w-12">
                                      {competitor.marketShare.toFixed(1)}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                              
                              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                                <span className="font-medium text-blue-900">Your Company</span>
                                <div className="flex items-center space-x-3">
                                  <div className="w-24">
                                    <Progress value={marketData.currentMarketShare} className="h-2" />
                                  </div>
                                  <span className="font-bold text-blue-700 w-12">
                                    {marketData.currentMarketShare.toFixed(2)}%
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg">
                                <span className="font-medium text-gray-700">Others</span>
                                <div className="flex items-center space-x-3">
                                  <div className="w-24">
                                    <Progress 
                                      value={100 - competitors.reduce((sum, c) => sum + c.marketShare, 0) - marketData.currentMarketShare} 
                                      className="h-2" 
                                    />
                                  </div>
                                  <span className="font-bold text-gray-700 w-12">
                                    {(100 - competitors.reduce((sum, c) => sum + c.marketShare, 0) - marketData.currentMarketShare).toFixed(1)}%
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                                <h4 className="font-medium text-emerald-900 mb-3">Competitive Advantages</h4>
                                <div className="space-y-2 text-sm text-emerald-800">
                                  <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-emerald-600" />
                                    <span>Modern technology stack</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-emerald-600" />
                                    <span>Superior user experience</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-emerald-600" />
                                    <span>Competitive pricing model</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Star className="w-4 h-4 text-emerald-600" />
                                    <span>Faster implementation</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                <h4 className="font-medium text-amber-900 mb-3">Market Opportunities</h4>
                                <div className="space-y-2 text-sm text-amber-800">
                                  <div className="flex items-center space-x-2">
                                    <Target className="w-4 h-4 text-amber-600" />
                                    <span>Underserved SMB segment</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Target className="w-4 h-4 text-amber-600" />
                                    <span>International expansion</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Target className="w-4 h-4 text-amber-600" />
                                    <span>Vertical specialization</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Target className="w-4 h-4 text-amber-600" />
                                    <span>AI-powered features</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>
                  </motion.div>
                </TabsContent>
              </div>
            </Tabs>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MarketSizeAnalysis;