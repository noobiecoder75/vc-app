import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import LiveKPIChart from '../components/LiveKPIChart';
import KPIAnalysis from '../components/KPIAnalysis';
import GlowingCard from '../components/advanced/GlowingCard';
import AnimatedCounter from '../components/advanced/AnimatedCounter';
import ParticleBackground from '../components/advanced/ParticleBackground';
import DataVisualization from '../components/advanced/DataVisualization';
import InteractiveHeatmap from '../components/advanced/InteractiveHeatmap';
import MetricComparison from '../components/advanced/MetricComparison';
import InsightTooltip from '../components/InsightTooltip';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Users, 
  BarChart3, 
  FileText, 
  Target, 
  Loader2, 
  AlertTriangle, 
  Star, 
  Globe, 
  Zap,
  Award,
  Brain,
  Activity,
  CheckCircle,
  TrendingDown,
  PieChart
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  industry_name: string | null;
  sub_industry_name: string | null;
  startup_stage: string | null;
  country: string | null;
  geo_region: string | null;
  valuation_target_usd: number | null;
  funding_goal_usd: number | null;
  incorporation_year: number | null;
  pitch_deck_summary: string | null;
  gpt_pitch_score: number | null;
  created_at: string;
}

interface FinancialModel {
  monthly_revenue_usd: number | null;
  burn_rate_usd: number | null;
  ltv_cac_ratio: number | null;
  runway_months: number | null;
  revenue_model_notes: string | null;
  tam_sam_som_json: any | null;
  model_quality_score: number | null;
}

interface PitchDeck {
  core_problem: string | null;
  core_solution: string | null;
  customer_segment: string | null;
  product_summary_md: string | null;
  market_trends_json: any | null;
  deck_quality_score: number | null;
}

interface GoToMarket {
  gtm_channels: string[] | null;
  gtm_notes_md: string | null;
  gtm_strength_score: number | null;
}

interface VCFitReport {
  matched_vcs_json: any | null;
  similar_startup_cases: string[] | null;
  requirements_to_improve: string[] | null;
  fit_score_breakdown: any | null;
  investor_synopsis_md: string | null;
  funding_probability: number | null;
}

interface Founder {
  full_name: string | null;
  linkedin_url: string | null;
  education_history: string[] | null;
  domain_experience_yrs: number | null;
  technical_skills: string[] | null;
  notable_achievements: string | null;
  founder_fit_score: number | null;
}

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<Company | null>(null);
  const [financialModel, setFinancialModel] = useState<FinancialModel | null>(null);
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null);
  const [goToMarket, setGoToMarket] = useState<GoToMarket | null>(null);
  const [vcFitReport, setVcFitReport] = useState<VCFitReport | null>(null);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    if (id) {
      fetchCompanyData(id);
    }
  }, [id]);

  const fetchCompanyData = async (companyId: string) => {
    try {
      setLoading(true);
      setError('');

      console.log(`🔍 Fetching data for company: ${companyId}`);

      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyError) throw companyError;
      setCompany(companyData);
      console.log('✅ Company data loaded:', companyData);

      // Fetch all related data in parallel
      const [financialResult, pitchResult, gtmResult, vcResult, foundersResult] = await Promise.allSettled([
        supabase.from('financial_models').select('*').eq('company_id', companyId),
        supabase.from('pitch_decks').select('*').eq('company_id', companyId),
        supabase.from('go_to_market').select('*').eq('company_id', companyId),
        supabase.from('vc_fit_reports').select('*').eq('company_id', companyId),
        supabase.from('founders').select('*').eq('company_id', companyId)
      ]);

      // Process results
      if (financialResult.status === 'fulfilled' && !financialResult.value.error) {
        setFinancialModel(financialResult.value.data?.[0] || null);
      }
      if (pitchResult.status === 'fulfilled' && !pitchResult.value.error) {
        setPitchDeck(pitchResult.value.data?.[0] || null);
      }
      if (gtmResult.status === 'fulfilled' && !gtmResult.value.error) {
        setGoToMarket(gtmResult.value.data?.[0] || null);
      }
      if (vcResult.status === 'fulfilled' && !vcResult.value.error) {
        setVcFitReport(vcResult.value.data?.[0] || null);
      }
      if (foundersResult.status === 'fulfilled' && !foundersResult.value.error) {
        setFounders(foundersResult.value.data || []);
      }

      console.log('✅ All company data loaded successfully');

    } catch (err) {
      console.error('❌ Error fetching company data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch company data');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return '$0';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const getStageColor = (stage: string | null) => {
    switch (stage?.toLowerCase()) {
      case 'pre-seed':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'seed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'series a':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'series b':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'series c':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getScoreColor = (score: number | null) => {
    if (score === null || score === undefined) return 'text-gray-500';
    if (score >= 8) return 'text-emerald-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Sample data for visualizations
  const performanceData = [
    { name: 'Revenue', value: financialModel?.monthly_revenue_usd || 125000, change: 15.2, trend: 'up' as const, color: '#10B981' },
    { name: 'Burn Rate', value: financialModel?.burn_rate_usd || 85000, change: -8.3, trend: 'down' as const, color: '#EF4444' },
    { name: 'LTV/CAC', value: financialModel?.ltv_cac_ratio || 4.2, change: 12.4, trend: 'up' as const, color: '#3B82F6' },
    { name: 'Runway', value: financialModel?.runway_months || 18, change: -2.1, trend: 'down' as const, color: '#F59E0B' }
  ];

  const heatmapData = Array.from({ length: 40 }, (_, i) => ({
    x: i % 8,
    y: Math.floor(i / 8),
    value: Math.floor(Math.random() * 100) + 1,
    label: `Metric ${i + 1}`,
    category: ['Revenue', 'Users', 'Growth', 'Retention'][Math.floor(Math.random() * 4)]
  }));

  const comparisonMetrics = [
    {
      name: 'Monthly Revenue',
      current: financialModel?.monthly_revenue_usd || 125000,
      previous: 108000,
      benchmark: 100000,
      target: 150000,
      unit: 'USD',
      category: 'Financial'
    },
    {
      name: 'Burn Rate',
      current: financialModel?.burn_rate_usd || 85000,
      previous: 92000,
      benchmark: 80000,
      target: 75000,
      unit: 'USD',
      category: 'Financial'
    },
    {
      name: 'LTV/CAC Ratio',
      current: financialModel?.ltv_cac_ratio || 4.2,
      previous: 3.8,
      benchmark: 3.0,
      target: 5.0,
      unit: ':1',
      category: 'Unit Economics'
    },
    {
      name: 'Runway',
      current: financialModel?.runway_months || 18,
      previous: 20,
      benchmark: 12,
      target: 24,
      unit: 'months',
      category: 'Financial'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        <ParticleBackground particleCount={20} color="#3B82F6" speed={0.2} />
        <div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        <ParticleBackground particleCount={20} color="#EF4444" speed={0.2} />
        <div className="text-center relative z-10">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h2>
          <p className="text-red-600 mb-4">{error || 'The requested company could not be found.'}</p>
          <Link
            to="/companies"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ParticleBackground particleCount={30} color="#3B82F6" speed={0.3} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link
              to="/companies"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Companies
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="blue" intensity="medium">
              <Card>
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 mr-4">{company.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStageColor(company.startup_stage)}`}>
                          {company.startup_stage || 'Unknown Stage'}
                        </span>
                        {company.gpt_pitch_score && (
                          <Badge variant="info" className="ml-2">
                            <Star className="w-3 h-3 mr-1" />
                            {company.gpt_pitch_score.toFixed(1)}/10
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        {company.industry_name && (
                          <div className="flex items-center text-gray-600">
                            <Building2 className="w-4 h-4 mr-2" />
                            <span className="text-sm">{company.industry_name}</span>
                          </div>
                        )}
                        
                        {company.country && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{company.country}</span>
                          </div>
                        )}
                        
                        {company.incorporation_year && (
                          <div className="flex items-center text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-sm">Founded {company.incorporation_year}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center text-gray-600">
                          <Activity className="w-4 h-4 mr-2" />
                          <span className="text-sm">Live Data</span>
                        </div>
                      </div>

                      {company.pitch_deck_summary && (
                        <p className="text-gray-700 leading-relaxed">{company.pitch_deck_summary}</p>
                      )}
                    </div>
                    
                    <div className="mt-6 lg:mt-0 lg:ml-8">
                      <div className="grid grid-cols-2 gap-4">
                        {company.valuation_target_usd && (
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                              <AnimatedCounter value={company.valuation_target_usd / 1000000} suffix="M" prefix="$" decimals={1} duration={2} />
                            </div>
                            <div className="text-sm text-blue-700">Target Valuation</div>
                          </div>
                        )}
                        
                        {company.funding_goal_usd && (
                          <div className="text-center p-4 bg-purple-50 rounded-lg">
                            <div className="text-2xl font-bold text-purple-600">
                              <AnimatedCounter value={company.funding_goal_usd / 1000000} suffix="M" prefix="$" decimals={1} duration={2.2} />
                            </div>
                            <div className="text-sm text-purple-700">Funding Goal</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </GlowingCard>
          </motion.div>
        </motion.div>

        {/* ✅ FIXED: Properly Structured Tab Navigation */}
        <motion.div 
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="purple" intensity="low">
              <Card>
                <CardContent className="p-0">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-2">
                      <TabsTrigger
                        value="overview"
                        className="flex flex-col items-center space-y-1 py-3 px-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                      >
                        <Building2 className="w-4 h-4" />
                        <span className="text-xs font-medium">Overview</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="kpi-analysis"
                        className="flex flex-col items-center space-y-1 py-3 px-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span className="text-xs font-medium">KPI Analysis</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="financial"
                        className="flex flex-col items-center space-y-1 py-3 px-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span className="text-xs font-medium">Financial</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="pitch"
                        className="flex flex-col items-center space-y-1 py-3 px-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-xs font-medium">Pitch Deck</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="market"
                        className="flex flex-col items-center space-y-1 py-3 px-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                      >
                        <Globe className="w-4 h-4" />
                        <span className="text-xs font-medium">Market Size</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="vc-matching"
                        className="flex flex-col items-center space-y-1 py-3 px-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
                      >
                        <Users className="w-4 h-4" />
                        <span className="text-xs font-medium">VC Matching</span>
                      </TabsTrigger>
                    </TabsList>

                    {/* ✅ FIXED: Properly Structured Tab Content */}
                    <div className="p-6">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={activeTab}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Overview Tab */}
                          {activeTab === 'overview' && (
                            <TabsContent value="overview" className="space-y-8 mt-0">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Live KPI Chart */}
                                <motion.div variants={itemVariants}>
                                  <GlowingCard glowColor="emerald" intensity="medium">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center">
                                          <BarChart3 className="w-5 h-5 text-emerald-600 mr-2" />
                                          Live KPI Dashboard
                                          <Badge variant="success" className="ml-2">
                                            <Zap className="w-3 h-3 mr-1" />
                                            Real-time
                                          </Badge>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <LiveKPIChart companyId={company.id} companyName={company.name} />
                                      </CardContent>
                                    </Card>
                                  </GlowingCard>
                                </motion.div>

                                {/* Performance Heatmap */}
                                <motion.div variants={itemVariants}>
                                  <InteractiveHeatmap
                                    title="Performance Heatmap"
                                    data={heatmapData}
                                    colorScheme="blue"
                                    showLabels={false}
                                  />
                                </motion.div>
                              </div>

                              {/* Team Information */}
                              {founders.length > 0 && (
                                <motion.div variants={itemVariants}>
                                  <GlowingCard glowColor="purple" intensity="medium">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center">
                                          <Users className="w-5 h-5 text-purple-600 mr-2" />
                                          Founding Team
                                          <Badge variant="info" className="ml-2">
                                            <Award className="w-3 h-3 mr-1" />
                                            {founders.length} Founders
                                          </Badge>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                          {founders.map((founder, index) => (
                                            <motion.div
                                              key={index}
                                              initial={{ opacity: 0, x: -20 }}
                                              animate={{ opacity: 1, x: 0 }}
                                              transition={{ delay: index * 0.1 }}
                                            >
                                              <InsightTooltip
                                                title={founder.full_name || 'Unknown Founder'}
                                                description={`${founder.domain_experience_yrs || 0} years experience`}
                                                insight={founder.notable_achievements || 'Experienced founder with domain expertise'}
                                                benchmark={founder.founder_fit_score ? {
                                                  value: founder.founder_fit_score,
                                                  label: `${founder.founder_fit_score.toFixed(1)}/10 Fit Score`,
                                                  status: founder.founder_fit_score >= 8 ? 'excellent' : founder.founder_fit_score >= 6 ? 'good' : 'average'
                                                } : undefined}
                                              >
                                                <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-help">
                                                  <div className="flex items-start justify-between mb-2">
                                                    <h4 className="font-medium text-gray-900">{founder.full_name || 'Unknown'}</h4>
                                                    {founder.founder_fit_score && (
                                                      <span className={`text-sm font-medium ${getScoreColor(founder.founder_fit_score)}`}>
                                                        {founder.founder_fit_score.toFixed(1)}/10
                                                      </span>
                                                    )}
                                                  </div>
                                                  {founder.domain_experience_yrs && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                      {founder.domain_experience_yrs} years domain experience
                                                    </p>
                                                  )}
                                                  {founder.notable_achievements && (
                                                    <p className="text-sm text-gray-700 mb-2">{founder.notable_achievements}</p>
                                                  )}
                                                  {founder.technical_skills && founder.technical_skills.length > 0 && (
                                                    <div className="flex flex-wrap gap-1">
                                                      {founder.technical_skills.slice(0, 3).map((skill, skillIndex) => (
                                                        <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                                          {skill}
                                                        </span>
                                                      ))}
                                                      {founder.technical_skills.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                                          +{founder.technical_skills.length - 3} more
                                                        </span>
                                                      )}
                                                    </div>
                                                  )}
                                                </div>
                                              </InsightTooltip>
                                            </motion.div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </GlowingCard>
                                </motion.div>
                              )}
                            </TabsContent>
                          )}

                          {/* KPI Analysis Tab */}
                          {activeTab === 'kpi-analysis' && (
                            <TabsContent value="kpi-analysis" className="space-y-8 mt-0">
                              <motion.div variants={itemVariants}>
                                <KPIAnalysis 
                                  companyId={company.id} 
                                  companyName={company.name}
                                  industry={company.industry_name}
                                  stage={company.startup_stage}
                                />
                              </motion.div>
                            </TabsContent>
                          )}

                          {/* Financial Model Tab */}
                          {activeTab === 'financial' && (
                            <TabsContent value="financial" className="space-y-8 mt-0">
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Financial Metrics */}
                                <motion.div variants={itemVariants}>
                                  <DataVisualization
                                    title="Financial Performance"
                                    data={performanceData}
                                    type="metric"
                                    showTrends={true}
                                    showBenchmarks={true}
                                  />
                                </motion.div>

                                {/* Metric Comparison */}
                                <motion.div variants={itemVariants}>
                                  <MetricComparison
                                    title="Financial vs Benchmarks"
                                    metrics={comparisonMetrics}
                                    timeframe="vs Last Month"
                                    showBenchmarks={true}
                                    showTargets={true}
                                  />
                                </motion.div>
                              </div>

                              {/* Detailed Financial Data */}
                              {financialModel && (
                                <motion.div variants={itemVariants}>
                                  <GlowingCard glowColor="emerald" intensity="medium">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center">
                                          <DollarSign className="w-5 h-5 text-emerald-600 mr-2" />
                                          Financial Model Details
                                          <Badge variant="success" className="ml-2">
                                            <CheckCircle className="w-3 h-3 mr-1" />
                                            Validated
                                          </Badge>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                          <div className="bg-emerald-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-emerald-600">
                                              <AnimatedCounter value={financialModel.monthly_revenue_usd || 0} prefix="$" duration={2} />
                                            </div>
                                            <div className="text-sm text-emerald-700">Monthly Revenue</div>
                                          </div>
                                          <div className="bg-red-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-red-600">
                                              <AnimatedCounter value={financialModel.burn_rate_usd || 0} prefix="$" duration={2.2} />
                                            </div>
                                            <div className="text-sm text-red-700">Monthly Burn Rate</div>
                                          </div>
                                          <div className="bg-blue-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                              <AnimatedCounter value={financialModel.ltv_cac_ratio || 0} suffix=":1" decimals={1} duration={2.4} />
                                            </div>
                                            <div className="text-sm text-blue-700">LTV/CAC Ratio</div>
                                          </div>
                                          <div className="bg-purple-50 rounded-lg p-4 text-center">
                                            <div className="text-2xl font-bold text-purple-600">
                                              <AnimatedCounter value={financialModel.runway_months || 0} suffix=" mo" duration={2.6} />
                                            </div>
                                            <div className="text-sm text-purple-700">Runway</div>
                                          </div>
                                        </div>
                                        {financialModel.revenue_model_notes && (
                                          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                            <h4 className="font-medium text-gray-900 mb-2">Revenue Model Notes</h4>
                                            <p className="text-gray-700 text-sm">{financialModel.revenue_model_notes}</p>
                                          </div>
                                        )}
                                      </CardContent>
                                    </Card>
                                  </GlowingCard>
                                </motion.div>
                              )}
                            </TabsContent>
                          )}

                          {/* Pitch Deck Tab */}
                          {activeTab === 'pitch' && (
                            <TabsContent value="pitch" className="space-y-8 mt-0">
                              {pitchDeck ? (
                                <motion.div variants={itemVariants}>
                                  <GlowingCard glowColor="blue" intensity="medium">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center">
                                          <FileText className="w-5 h-5 text-blue-600 mr-2" />
                                          Pitch Deck Analysis
                                          {pitchDeck.deck_quality_score && (
                                            <Badge variant="info" className="ml-2">
                                              <Star className="w-3 h-3 mr-1" />
                                              {pitchDeck.deck_quality_score.toFixed(1)}/10
                                            </Badge>
                                          )}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-6">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-red-50 rounded-lg p-4">
                                              <h4 className="font-medium text-red-900 mb-2 flex items-center">
                                                <AlertTriangle className="w-4 h-4 mr-2" />
                                                Core Problem
                                              </h4>
                                              <p className="text-red-800 text-sm">{pitchDeck.core_problem || 'Not specified'}</p>
                                            </div>
                                            <div className="bg-emerald-50 rounded-lg p-4">
                                              <h4 className="font-medium text-emerald-900 mb-2 flex items-center">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Core Solution
                                              </h4>
                                              <p className="text-emerald-800 text-sm">{pitchDeck.core_solution || 'Not specified'}</p>
                                            </div>
                                          </div>
                                          
                                          <div className="bg-blue-50 rounded-lg p-4">
                                            <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                                              <Target className="w-4 h-4 mr-2" />
                                              Target Customer Segment
                                            </h4>
                                            <p className="text-blue-800 text-sm">{pitchDeck.customer_segment || 'Not specified'}</p>
                                          </div>
                                          
                                          {pitchDeck.product_summary_md && (
                                            <div className="bg-purple-50 rounded-lg p-4">
                                              <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                                                <Building2 className="w-4 h-4 mr-2" />
                                                Product Summary
                                              </h4>
                                              <div className="prose prose-sm max-w-none text-purple-800">
                                                <pre className="whitespace-pre-wrap text-sm">{pitchDeck.product_summary_md}</pre>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </GlowingCard>
                                </motion.div>
                              ) : (
                                <motion.div variants={itemVariants}>
                                  <div className="text-center py-12">
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Pitch Deck Data</h3>
                                    <p className="text-gray-600">Upload a pitch deck to see detailed analysis here.</p>
                                  </div>
                                </motion.div>
                              )}
                            </TabsContent>
                          )}

                          {/* Market Size Tab */}
                          {activeTab === 'market' && (
                            <TabsContent value="market" className="space-y-8 mt-0">
                              {financialModel?.tam_sam_som_json ? (
                                <motion.div variants={itemVariants}>
                                  <GlowingCard glowColor="emerald" intensity="medium">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center">
                                          <Globe className="w-5 h-5 text-emerald-600 mr-2" />
                                          Market Size Analysis
                                          <Badge variant="success" className="ml-2">
                                            <Brain className="w-3 h-3 mr-1" />
                                            AI Analyzed
                                          </Badge>
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                          <div className="bg-blue-50 rounded-lg p-6 text-center">
                                            <PieChart className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                              <AnimatedCounter value={financialModel.tam_sam_som_json.tam / 1000000000} suffix="B" prefix="$" decimals={1} duration={2} />
                                            </div>
                                            <div className="text-sm text-blue-700 font-medium">Total Addressable Market</div>
                                            <div className="text-xs text-blue-600 mt-1">Maximum market opportunity</div>
                                          </div>
                                          <div className="bg-purple-50 rounded-lg p-6 text-center">
                                            <Target className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                                            <div className="text-3xl font-bold text-purple-600 mb-2">
                                              <AnimatedCounter value={financialModel.tam_sam_som_json.sam / 1000000000} suffix="B" prefix="$" decimals={1} duration={2.2} />
                                            </div>
                                            <div className="text-sm text-purple-700 font-medium">Serviceable Addressable Market</div>
                                            <div className="text-xs text-purple-600 mt-1">Realistic target market</div>
                                          </div>
                                          <div className="bg-emerald-50 rounded-lg p-6 text-center">
                                            <TrendingUp className="w-8 h-8 text-emerald-600 mx-auto mb-3" />
                                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                                              <AnimatedCounter value={financialModel.tam_sam_som_json.som / 1000000} suffix="M" prefix="$" decimals={0} duration={2.4} />
                                            </div>
                                            <div className="text-sm text-emerald-700 font-medium">Serviceable Obtainable Market</div>
                                            <div className="text-xs text-emerald-600 mt-1">Near-term opportunity</div>
                                          </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-6">
                                          <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                                            <Brain className="w-4 h-4 text-blue-600 mr-2" />
                                            Market Insights
                                          </h4>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                              <span className="font-medium text-gray-700">Market Penetration:</span>
                                              <span className="text-gray-600 ml-2">
                                                {((financialModel.tam_sam_som_json.som / financialModel.tam_sam_som_json.sam) * 100).toFixed(1)}% of SAM
                                              </span>
                                            </div>
                                            <div>
                                              <span className="font-medium text-gray-700">Growth Potential:</span>
                                              <span className="text-emerald-600 ml-2 font-medium">High</span>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </GlowingCard>
                                </motion.div>
                              ) : (
                                <motion.div variants={itemVariants}>
                                  <div className="text-center py-12">
                                    <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Market Data</h3>
                                    <p className="text-gray-600">Market size analysis will appear here when available.</p>
                                  </div>
                                </motion.div>
                              )}
                            </TabsContent>
                          )}

                          {/* VC Matching Tab */}
                          {activeTab === 'vc-matching' && (
                            <TabsContent value="vc-matching" className="space-y-8 mt-0">
                              {vcFitReport ? (
                                <motion.div variants={itemVariants}>
                                  <GlowingCard glowColor="purple" intensity="medium">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="flex items-center">
                                          <Users className="w-5 h-5 text-purple-600 mr-2" />
                                          VC Matching Analysis
                                          {vcFitReport.funding_probability && (
                                            <Badge variant="info" className="ml-2">
                                              <TrendingUp className="w-3 h-3 mr-1" />
                                              {vcFitReport.funding_probability.toFixed(0)}% Probability
                                            </Badge>
                                          )}
                                        </CardTitle>
                                      </CardHeader>
                                      <CardContent>
                                        <div className="space-y-6">
                                          {vcFitReport.matched_vcs_json?.matches && (
                                            <div>
                                              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                                <Award className="w-4 h-4 text-purple-600 mr-2" />
                                                Matched VCs
                                              </h4>
                                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {vcFitReport.matched_vcs_json.matches.map((vc: any, index: number) => (
                                                  <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                  >
                                                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                      <div className="flex items-center justify-between mb-2">
                                                        <h5 className="font-medium text-gray-900">{vc.name}</h5>
                                                        <span className="text-sm font-medium text-purple-600">{vc.fit_score}% match</span>
                                                      </div>
                                                      <p className="text-sm text-gray-600 mb-2">{vc.focus}</p>
                                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                                        <motion.div
                                                          className="bg-purple-500 h-2 rounded-full"
                                                          initial={{ width: 0 }}
                                                          animate={{ width: `${vc.fit_score}%` }}
                                                          transition={{ duration: 1, delay: index * 0.2 }}
                                                        />
                                                      </div>
                                                    </div>
                                                  </motion.div>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                          
                                          {vcFitReport.requirements_to_improve && vcFitReport.requirements_to_improve.length > 0 && (
                                            <div className="bg-orange-50 rounded-lg p-4">
                                              <h4 className="font-medium text-orange-900 mb-3 flex items-center">
                                                <Target className="w-4 h-4 mr-2" />
                                                Areas for Improvement
                                              </h4>
                                              <ul className="space-y-2">
                                                {vcFitReport.requirements_to_improve.map((requirement, index) => (
                                                  <li key={index} className="flex items-start text-sm text-orange-800">
                                                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                                                    {requirement}
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          )}

                                          {vcFitReport.funding_probability && (
                                            <div className="bg-emerald-50 rounded-lg p-4">
                                              <h4 className="font-medium text-emerald-900 mb-2 flex items-center">
                                                <TrendingUp className="w-4 h-4 mr-2" />
                                                Funding Probability
                                              </h4>
                                              <div className="flex items-center space-x-4">
                                                <div className="text-3xl font-bold text-emerald-600">
                                                  <AnimatedCounter value={vcFitReport.funding_probability} suffix="%" duration={2} />
                                                </div>
                                                <div className="flex-1">
                                                  <Progress value={vcFitReport.funding_probability} className="h-3" />
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </GlowingCard>
                                </motion.div>
                              ) : (
                                <motion.div variants={itemVariants}>
                                  <div className="text-center py-12">
                                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No VC Matching Data</h3>
                                    <p className="text-gray-600">VC matching analysis will appear here when available.</p>
                                  </div>
                                </motion.div>
                              )}
                            </TabsContent>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </GlowingCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;