import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Progress } from '../ui/progress';
import GlowingCard from './GlowingCard';
import AnimatedCounter from './AnimatedCounter';
import InsightTooltip from '../InsightTooltip';
import { 
  Globe, 
  TrendingUp, 
  Target, 
  Users, 
  Building2, 
  PieChart,
  BarChart3,
  DollarSign,
  Zap,
  Brain,
  Star,
  Award,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  AlertTriangle,
  Rocket,
  LineChart
} from 'lucide-react';

interface MarketSizeAnalysisProps {
  companyId?: string;
  industry?: string;
}

const MarketSizeAnalysis: React.FC<MarketSizeAnalysisProps> = ({
  companyId,
  industry = 'SaaS'
}) => {
  const [selectedAnalysisType, setSelectedAnalysisType] = useState<'bottom-up' | 'top-down' | 'competitive'>('bottom-up');
  const [selectedRegion, setSelectedRegion] = useState('global');

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

  // Bottom-Up Analysis Data (80% focus)
  const bottomUpData = {
    totalAddressableCustomers: 2500000,
    customerSegments: [
      { name: 'Enterprise (1000+ employees)', customers: 500000, penetration: 0.8, revenue: 50000, total: 20000000000 },
      { name: 'Mid-Market (100-999 employees)', customers: 800000, penetration: 2.5, revenue: 25000, total: 500000000 },
      { name: 'SMB (10-99 employees)', customers: 1200000, penetration: 1.2, revenue: 5000, total: 72000000 }
    ],
    conversionFunnel: [
      { stage: 'Total Addressable Market', value: 2500000, percentage: 100 },
      { stage: 'Aware of Problem', value: 1250000, percentage: 50 },
      { stage: 'Actively Looking', value: 375000, percentage: 15 },
      { stage: 'Considering Solutions', value: 125000, percentage: 5 },
      { stage: 'Ready to Purchase', value: 25000, percentage: 1 }
    ],
    unitEconomics: {
      averageContractValue: 25000,
      salesCycleMonths: 6,
      churnRate: 5,
      expansionRate: 125,
      grossMargin: 85
    }
  };

  // Top-Down Analysis Data (20% focus)
  const topDownData = {
    totalMarketSize: 150000000000,
    cagr: 15.2,
    marketSegments: [
      { name: 'Core Platform', size: 67500000000, percentage: 45, growth: 18.5 },
      { name: 'Analytics & BI', size: 37500000000, percentage: 25, growth: 22.1 },
      { name: 'Integration Services', size: 30000000000, percentage: 20, growth: 12.8 },
      { name: 'Professional Services', size: 15000000000, percentage: 10, growth: 8.5 }
    ],
    geographicSplit: [
      { region: 'North America', size: 63000000000, percentage: 42, growth: 14.2 },
      { region: 'Europe', size: 42000000000, percentage: 28, growth: 16.8 },
      { region: 'Asia Pacific', size: 33000000000, percentage: 22, growth: 19.5 },
      { region: 'Rest of World', size: 12000000000, percentage: 8, growth: 25.2 }
    ]
  };

  // Competitive Landscape Data
  const competitiveData = {
    marketShare: [
      { company: 'Market Leader', share: 23, revenue: 34500000000, growth: 12.5 },
      { company: 'Second Player', share: 18, revenue: 27000000000, growth: 15.2 },
      { company: 'Third Player', share: 12, revenue: 18000000000, growth: 8.9 },
      { company: 'Your Company', share: 0.15, revenue: 225000000, growth: 18.5 },
      { company: 'Others', share: 46.85, revenue: 70275000000, growth: 11.8 }
    ],
    competitiveAdvantages: [
      { advantage: 'Technology Innovation', score: 92, description: 'AI-powered features ahead of competition' },
      { advantage: 'Speed to Market', score: 88, description: '50% faster implementation than competitors' },
      { advantage: 'Customer Experience', score: 85, description: 'Higher NPS and satisfaction scores' },
      { advantage: 'Pricing Strategy', score: 78, description: '15% more cost-effective solution' },
      { advantage: 'Market Presence', score: 45, description: 'Limited brand awareness vs established players' }
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <GlowingCard glowColor="emerald" intensity="high">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                      <Globe className="w-8 h-8 text-emerald-600" />
                      <span>Market Size Analysis</span>
                      <Badge variant="success" className="text-sm">
                        <Brain className="w-3 h-3 mr-1" />
                        AI-Powered
                      </Badge>
                    </CardTitle>
                    <p className="text-gray-600 mt-1 text-lg">
                      Comprehensive market opportunity assessment with bottom-up and top-down analysis
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                      <SelectTrigger className="w-32">
                        <Globe className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="global">Global</SelectItem>
                        <SelectItem value="north-america">North America</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                        <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* TAM/SAM/SOM Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                  <InsightTooltip
                    title="Total Addressable Market"
                    description="The total market demand for your product category"
                    insight="TAM represents the maximum revenue opportunity if you captured 100% market share"
                    examples={["Salesforce TAM: $175B", "Microsoft Office TAM: $50B"]}
                  >
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 text-center cursor-help hover:shadow-md transition-shadow">
                      <div className="text-4xl font-bold text-blue-600 mb-2">
                        <AnimatedCounter 
                          value={topDownData.totalMarketSize / 1000000000}
                          prefix="$"
                          suffix="B"
                          decimals={0}
                          duration={2}
                        />
                      </div>
                      <div className="text-sm text-blue-700 font-medium">Total Addressable Market</div>
                      <div className="text-xs text-blue-600 mt-1">
                        Growing at <AnimatedCounter value={topDownData.cagr} suffix="%" decimals={1} duration={1.5} /> CAGR
                      </div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Serviceable Addressable Market"
                    description="The portion of TAM you can realistically target"
                    insight="SAM focuses on your specific geographic and demographic segments"
                  >
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 text-center cursor-help hover:shadow-md transition-shadow">
                      <div className="text-4xl font-bold text-purple-600 mb-2">
                        <AnimatedCounter 
                          value={(topDownData.totalMarketSize * 0.4) / 1000000000}
                          prefix="$"
                          suffix="B"
                          decimals={0}
                          duration={2.2}
                        />
                      </div>
                      <div className="text-sm text-purple-700 font-medium">Serviceable Addressable Market</div>
                      <div className="text-xs text-purple-600 mt-1">40% of TAM</div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Serviceable Obtainable Market"
                    description="The portion of SAM you can capture short-term"
                    insight="SOM represents your realistic market opportunity in the next 3-5 years"
                  >
                    <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-6 text-center cursor-help hover:shadow-md transition-shadow">
                      <div className="text-4xl font-bold text-emerald-600 mb-2">
                        <AnimatedCounter 
                          value={(topDownData.totalMarketSize * 0.04) / 1000000000}
                          prefix="$"
                          suffix="B"
                          decimals={1}
                          duration={2.4}
                        />
                      </div>
                      <div className="text-sm text-emerald-700 font-medium">Serviceable Obtainable Market</div>
                      <div className="text-xs text-emerald-600 mt-1">10% of SAM</div>
                    </div>
                  </InsightTooltip>
                </div>
              </CardHeader>
            </Card>
          </GlowingCard>
        </motion.div>
      </motion.div>

      {/* Analysis Tabs */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="shadow-lg">
            <Tabs value={selectedAnalysisType} onValueChange={(value) => setSelectedAnalysisType(value as any)}>
              <div className="border-b border-gray-200 px-6 pt-6">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 h-12">
                  <TabsTrigger 
                    value="bottom-up" 
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">Bottom-Up (80%)</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="top-down"
                    className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Top-Down (20%)</span>
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
                {/* Bottom-Up Analysis Tab */}
                <TabsContent value="bottom-up" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Bottom-Up Market Analysis</h3>
                      <p className="text-gray-600">Customer-centric approach focusing on addressable segments and unit economics</p>
                      <Badge variant="info" className="mt-2">
                        <Star className="w-3 h-3 mr-1" />
                        Primary Analysis Method (80% Weight)
                      </Badge>
                    </div>

                    {/* Customer Segments */}
                    <GlowingCard glowColor="blue" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Building2 className="w-5 h-5 text-blue-600 mr-2" />
                            Customer Segments Analysis
                            <Badge variant="info" className="ml-2">
                              <AnimatedCounter value={bottomUpData.totalAddressableCustomers / 1000000} suffix="M" decimals={1} duration={2} />
                              <span className="ml-1">Total Customers</span>
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            {bottomUpData.customerSegments.map((segment, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                                  <Badge variant="outline">
                                    {formatCurrency(segment.total)}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <div className="font-bold text-blue-600">
                                      <AnimatedCounter value={segment.customers / 1000} suffix="K" duration={1.5} />
                                    </div>
                                    <div className="text-blue-700">Total Companies</div>
                                  </div>
                                  <div className="text-center p-3 bg-emerald-50 rounded-lg">
                                    <div className="font-bold text-emerald-600">
                                      <AnimatedCounter value={segment.penetration} suffix="%" decimals={1} duration={1.5} />
                                    </div>
                                    <div className="text-emerald-700">Penetration Rate</div>
                                  </div>
                                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                                    <div className="font-bold text-purple-600">
                                      {formatCurrency(segment.revenue)}
                                    </div>
                                    <div className="text-purple-700">Avg Contract Value</div>
                                  </div>
                                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                                    <div className="font-bold text-orange-600">
                                      {formatCurrency(segment.total)}
                                    </div>
                                    <div className="text-orange-700">Market Opportunity</div>
                                  </div>
                                </div>
                                
                                <div className="mt-4">
                                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>Market Penetration</span>
                                    <span>{segment.penetration}%</span>
                                  </div>
                                  <Progress value={segment.penetration} className="h-2" />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>

                    {/* Conversion Funnel */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <GlowingCard glowColor="emerald" intensity="medium">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <Activity className="w-5 h-5 text-emerald-600 mr-2" />
                              Customer Acquisition Funnel
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {bottomUpData.conversionFunnel.map((stage, index) => (
                                <motion.div 
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="relative"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">{stage.stage}</span>
                                    <div className="flex items-center space-x-2">
                                      <span className="text-lg font-bold text-gray-900">
                                        <AnimatedCounter value={stage.value / 1000} suffix="K" duration={1.5} />
                                      </span>
                                      <Badge variant="outline" className="text-xs">
                                        {stage.percentage}%
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-3">
                                    <motion.div
                                      className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${stage.percentage}%` }}
                                      transition={{ duration: 1, delay: index * 0.1 }}
                                    />
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </GlowingCard>

                      {/* Unit Economics */}
                      <GlowingCard glowColor="purple" intensity="medium">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                              Unit Economics
                              <Badge variant="success" className="ml-2">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Healthy
                              </Badge>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-purple-50 rounded-lg">
                                  <div className="text-2xl font-bold text-purple-600">
                                    {formatCurrency(bottomUpData.unitEconomics.averageContractValue)}
                                  </div>
                                  <div className="text-sm text-purple-700">Avg Contract Value</div>
                                </div>
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                  <div className="text-2xl font-bold text-blue-600">
                                    <AnimatedCounter value={bottomUpData.unitEconomics.salesCycleMonths} duration={1.5} />
                                  </div>
                                  <div className="text-sm text-blue-700">Sales Cycle (Months)</div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-3 text-sm">
                                <div className="text-center p-2 bg-red-50 rounded">
                                  <div className="font-bold text-red-600">
                                    <AnimatedCounter value={bottomUpData.unitEconomics.churnRate} suffix="%" duration={1.5} />
                                  </div>
                                  <div className="text-red-700">Churn Rate</div>
                                </div>
                                <div className="text-center p-2 bg-emerald-50 rounded">
                                  <div className="font-bold text-emerald-600">
                                    <AnimatedCounter value={bottomUpData.unitEconomics.expansionRate} suffix="%" duration={1.5} />
                                  </div>
                                  <div className="text-emerald-700">Expansion Rate</div>
                                </div>
                                <div className="text-center p-2 bg-blue-50 rounded">
                                  <div className="font-bold text-blue-600">
                                    <AnimatedCounter value={bottomUpData.unitEconomics.grossMargin} suffix="%" duration={1.5} />
                                  </div>
                                  <div className="text-blue-700">Gross Margin</div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </GlowingCard>
                    </div>
                  </motion.div>
                </TabsContent>

                {/* Top-Down Analysis Tab */}
                <TabsContent value="top-down" className="mt-0">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Top-Down Market Analysis</h3>
                      <p className="text-gray-600">Industry reports and market research validation</p>
                      <Badge variant="warning" className="mt-2">
                        <LineChart className="w-3 h-3 mr-1" />
                        Validation Method (20% Weight)
                      </Badge>
                    </div>

                    {/* Market Segments */}
                    <GlowingCard glowColor="orange" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <PieChart className="w-5 h-5 text-orange-600 mr-2" />
                            Market Segments
                            <Badge variant="info" className="ml-2">
                              {formatCurrency(topDownData.totalMarketSize)}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {topDownData.marketSegments.map((segment, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="border border-gray-200 rounded-lg p-4"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-semibold text-gray-900">{segment.name}</h4>
                                  <Badge variant="outline">{segment.percentage}%</Badge>
                                </div>
                                
                                <div className="text-center mb-3">
                                  <div className="text-2xl font-bold text-orange-600">
                                    {formatCurrency(segment.size)}
                                  </div>
                                  <div className="text-sm text-gray-600">Market Size</div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Growth Rate</span>
                                  <span className="font-semibold text-emerald-600">
                                    +<AnimatedCounter value={segment.growth} suffix="%" decimals={1} duration={1.5} />
                                  </span>
                                </div>
                                
                                <Progress value={segment.percentage} className="mt-2 h-2" />
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>

                    {/* Geographic Distribution */}
                    <GlowingCard glowColor="blue" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Globe className="w-5 h-5 text-blue-600 mr-2" />
                            Geographic Distribution
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {topDownData.geographicSplit.map((region, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-4 bg-blue-50 rounded-lg"
                              >
                                <div className="text-xl font-bold text-blue-600 mb-1">
                                  {formatCurrency(region.size)}
                                </div>
                                <div className="text-sm font-medium text-blue-900 mb-2">{region.region}</div>
                                <div className="text-xs text-blue-700 mb-2">{region.percentage}% of market</div>
                                <div className="text-xs text-emerald-600 font-medium">
                                  +{region.growth}% growth
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
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
                      <p className="text-gray-600">Market share analysis and competitive positioning</p>
                    </div>

                    {/* Market Share */}
                    <GlowingCard glowColor="purple" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Target className="w-5 h-5 text-purple-600 mr-2" />
                            Market Share Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {competitiveData.marketShare.map((company, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`border rounded-lg p-4 ${company.company === 'Your Company' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center space-x-3">
                                    <h4 className="font-semibold text-gray-900">{company.company}</h4>
                                    {company.company === 'Your Company' && (
                                      <Badge variant="info">You</Badge>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <div className="font-bold text-gray-900">
                                      <AnimatedCounter value={company.share} suffix="%" decimals={2} duration={1.5} />
                                    </div>
                                    <div className="text-sm text-gray-600">Market Share</div>
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Revenue: </span>
                                    <span className="font-semibold">{formatCurrency(company.revenue)}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Growth: </span>
                                    <span className={`font-semibold ${company.growth > 15 ? 'text-emerald-600' : 'text-gray-900'}`}>
                                      +{company.growth}%
                                    </span>
                                  </div>
                                </div>
                                
                                <Progress value={company.share} className="mt-3 h-2" />
                              </motion.div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </GlowingCard>

                    {/* Competitive Advantages */}
                    <GlowingCard glowColor="emerald" intensity="medium">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Award className="w-5 h-5 text-emerald-600 mr-2" />
                            Competitive Advantages
                            <Badge variant="success" className="ml-2">
                              <Star className="w-3 h-3 mr-1" />
                              Strengths
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {competitiveData.competitiveAdvantages.map((advantage, index) => (
                              <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`border rounded-lg p-4 ${getScoreColor(advantage.score)}`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-semibold text-gray-900">{advantage.advantage}</h4>
                                  <div className="text-right">
                                    <div className="text-lg font-bold">
                                      <AnimatedCounter value={advantage.score} duration={1.5} />
                                    </div>
                                    <div className="text-xs">Score</div>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{advantage.description}</p>
                                <Progress value={advantage.score} className="h-2" />
                              </motion.div>
                            ))}
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

      {/* Market Opportunity Summary */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <GlowingCard glowColor="emerald" intensity="high">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-8 text-white">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Market Opportunity Summary</h3>
                <p className="text-emerald-100">Your addressable market opportunity breakdown</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    <AnimatedCounter value={0.15} suffix="%" decimals={2} duration={2} />
                  </div>
                  <div className="text-emerald-100">Current Market Share</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    <AnimatedCounter value={6} prefix="$" suffix="B" duration={2.2} />
                  </div>
                  <div className="text-emerald-100">Addressable Market</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    <AnimatedCounter value={18.5} suffix="%" decimals={1} duration={2.4} />
                  </div>
                  <div className="text-emerald-100">Growth Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    <AnimatedCounter value={5} suffix=" years" duration={2.6} />
                  </div>
                  <div className="text-emerald-100">Time to 1% Share</div>
                </div>
              </div>
            </div>
          </GlowingCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MarketSizeAnalysis;