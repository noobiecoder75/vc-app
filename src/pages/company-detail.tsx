import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import GlowingCard from '../components/advanced/GlowingCard';
import AnimatedCounter from '../components/advanced/AnimatedCounter';
import LiveKPIChart from '../components/LiveKPIChart';
import KPIAnalysis from '../components/KPIAnalysis';
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
  Activity,
  Award,
  Brain,
  Sparkles
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

      if (companyError) {
        console.error('❌ Company fetch error:', companyError);
        throw companyError;
      }
      
      console.log('✅ Company data loaded:', companyData);
      setCompany(companyData);

      // Fetch financial model data
      const { data: financialData, error: financialError } = await supabase
        .from('financial_models')
        .select('*')
        .eq('company_id', companyId);

      if (financialError) {
        console.warn('⚠️ Financial model fetch error:', financialError);
      } else {
        console.log('✅ Financial data loaded:', financialData);
        setFinancialModel(financialData?.[0] || null);
      }

      // Fetch pitch deck data
      const { data: pitchData, error: pitchError } = await supabase
        .from('pitch_decks')
        .select('*')
        .eq('company_id', companyId);

      if (pitchError) {
        console.warn('⚠️ Pitch deck fetch error:', pitchError);
      } else {
        console.log('✅ Pitch deck data loaded:', pitchData);
        setPitchDeck(pitchData?.[0] || null);
      }

      // Fetch go-to-market data
      const { data: gtmData, error: gtmError } = await supabase
        .from('go_to_market')
        .select('*')
        .eq('company_id', companyId);

      if (gtmError) {
        console.warn('⚠️ GTM fetch error:', gtmError);
      } else {
        console.log('✅ GTM data loaded:', gtmData);
        setGoToMarket(gtmData?.[0] || null);
      }

      // Fetch VC fit report data
      const { data: vcData, error: vcError } = await supabase
        .from('vc_fit_reports')
        .select('*')
        .eq('company_id', companyId);

      if (vcError) {
        console.warn('⚠️ VC fit report fetch error:', vcError);
      } else {
        console.log('✅ VC fit data loaded:', vcData);
        setVcFitReport(vcData?.[0] || null);
      }

      // Fetch founders data
      const { data: foundersData, error: foundersError } = await supabase
        .from('founders')
        .select('*')
        .eq('company_id', companyId);

      if (foundersError) {
        console.warn('⚠️ Founders fetch error:', foundersError);
      } else {
        console.log('✅ Founders data loaded:', foundersData);
        setFounders(foundersData || []);
      }

    } catch (err) {
      console.error('💥 Error fetching company data:', err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-600">Loading company details...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
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
                        <Badge className={`border ${getStageColor(company.startup_stage)}`}>
                          {company.startup_stage || 'Unknown Stage'}
                        </Badge>
                        {company.gpt_pitch_score && (
                          <Badge variant="outline" className="ml-2">
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
                          <InsightTooltip
                            title="Target Valuation"
                            description="Company's valuation goal"
                            insight="This represents the company's funding round target"
                          >
                            <div className="text-center p-4 bg-blue-50 rounded-lg cursor-help hover:bg-blue-100 transition-colors">
                              <div className="text-2xl font-bold text-blue-600">
                                <AnimatedCounter 
                                  value={company.valuation_target_usd / 1000000} 
                                  prefix="$"
                                  suffix="M"
                                  decimals={1}
                                  duration={2}
                                />
                              </div>
                              <div className="text-sm text-blue-700">Target Valuation</div>
                            </div>
                          </InsightTooltip>
                        )}
                        
                        {company.funding_goal_usd && (
                          <InsightTooltip
                            title="Funding Goal"
                            description="Amount seeking to raise"
                            insight="Current fundraising target for this round"
                          >
                            <div className="text-center p-4 bg-purple-50 rounded-lg cursor-help hover:bg-purple-100 transition-colors">
                              <div className="text-2xl font-bold text-purple-600">
                                <AnimatedCounter 
                                  value={company.funding_goal_usd / 1000000} 
                                  prefix="$"
                                  suffix="M"
                                  decimals={1}
                                  duration={2.2}
                                />
                              </div>
                              <div className="text-sm text-purple-700">Funding Goal</div>
                            </div>
                          </InsightTooltip>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </GlowingCard>
          </motion.div>
        </motion.div>

        {/* ✅ FIXED: Simplified Tabs Container - Removed problematic wrappers */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative z-10"
        >
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg">
              <Tabs defaultValue="overview" className="w-full">
                <div className="border-b border-gray-200 px-6 pt-6">
                  <TabsList className="grid w-full grid-cols-6 bg-gray-100 h-12">
                    <TabsTrigger 
                      value="overview" 
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 cursor-pointer"
                    >
                      <Building2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Overview</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="kpi-analysis"
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 cursor-pointer"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">KPI Analysis</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="financial"
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4" />
                      <span className="hidden sm:inline">Financial</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="pitch"
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Pitch Deck</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="market"
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 cursor-pointer"
                    >
                      <Globe className="w-4 h-4" />
                      <span className="hidden sm:inline">Market</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="vc-matching"
                      className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:text-blue-600 cursor-pointer"
                    >
                      <Users className="w-4 h-4" />
                      <span className="hidden sm:inline">VC Match</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                  <div className="p-6">
                    {/* ✅ Overview Tab */}
                    <TabsContent value="overview" className="mt-0">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Live KPI Chart */}
                          <Card className="shadow-md">
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Activity className="w-5 h-5 text-emerald-600 mr-2" />
                                Live KPI Dashboard
                                <Badge className="ml-2 bg-green-100 text-green-800">
                                  <Zap className="w-3 h-3 mr-1" />
                                  Real-time
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <LiveKPIChart companyId={company.id} companyName={company.name} />
                            </CardContent>
                          </Card>

                          {/* Team Information */}
                          {founders.length > 0 && (
                            <Card className="shadow-md">
                              <CardHeader>
                                <CardTitle className="flex items-center">
                                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                                  Founding Team
                                  <Badge className="ml-2 bg-blue-100 text-blue-800">
                                    <AnimatedCounter value={founders.length} duration={1} />
                                  </Badge>
                                </CardTitle>
                              </CardHeader>
                                <CardContent>
                                  <div className="space-y-4">
                                    {founders.map((founder, index) => (
                                      <motion.div 
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                      >
                                        <div className="flex items-start justify-between mb-2">
                                          <h4 className="font-medium text-gray-900">{founder.full_name || 'Unknown'}</h4>
                                          {founder.founder_fit_score && (
                                            <Badge variant="outline">
                                              <Star className="w-3 h-3 mr-1" />
                                              {founder.founder_fit_score.toFixed(1)}/10
                                            </Badge>
                                          )}
                                        </div>
                                        {founder.domain_experience_yrs && (
                                          <p className="text-sm text-gray-600 mb-2">
                                            <AnimatedCounter value={founder.domain_experience_yrs} duration={1.5} /> years domain experience
                                          </p>
                                        )}
                                        {founder.notable_achievements && (
                                          <p className="text-sm text-gray-700 mb-2">{founder.notable_achievements}</p>
                                        )}
                                        {founder.technical_skills && founder.technical_skills.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                            {founder.technical_skills.slice(0, 3).map((skill, skillIndex) => (
                                              <Badge key={skillIndex} variant="outline" className="text-xs">
                                                {skill}
                                              </Badge>
                                            ))}
                                            {founder.technical_skills.length > 3 && (
                                              <Badge variant="outline" className="text-xs">
                                                +{founder.technical_skills.length - 3} more
                                              </Badge>
                                            )}
                                          </div>
                                        )}
                                      </motion.div>
                                    ))}
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                        </div>
                      </motion.div>
                    </TabsContent>

                    {/* ✅ KPI Analysis Tab */}
                    <TabsContent value="kpi-analysis" className="mt-0">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <KPIAnalysis 
                          companyId={company.id} 
                          companyName={company.name}
                          industry={company.industry_name}
                          stage={company.startup_stage}
                        />
                      </motion.div>
                    </TabsContent>

                    {/* ✅ Financial Tab */}
                    <TabsContent value="financial" className="mt-0">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <GlowingCard glowColor="emerald" intensity="medium">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <DollarSign className="w-5 h-5 text-emerald-600 mr-2" />
                                Financial Model Analysis
                                <Badge variant="success" className="ml-2">
                                  <Brain className="w-3 h-3 mr-1" />
                                  AI Insights
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {financialModel ? (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <InsightTooltip
                                      title="Monthly Revenue"
                                      description="Current monthly recurring revenue"
                                      insight="Strong MRR indicates product-market fit"
                                    >
                                      <div className="bg-emerald-50 rounded-lg p-4 cursor-help hover:bg-emerald-100 transition-colors">
                                        <div className="text-2xl font-bold text-emerald-600">
                                          <AnimatedCounter 
                                            value={financialModel.monthly_revenue_usd || 0}
                                            prefix="$"
                                            duration={2}
                                          />
                                        </div>
                                        <div className="text-sm text-emerald-700">Monthly Revenue</div>
                                      </div>
                                    </InsightTooltip>
                                    
                                    <InsightTooltip
                                      title="Burn Rate"
                                      description="Monthly cash burn rate"
                                      insight="Lower burn rate extends runway"
                                    >
                                      <div className="bg-red-50 rounded-lg p-4 cursor-help hover:bg-red-100 transition-colors">
                                        <div className="text-2xl font-bold text-red-600">
                                          <AnimatedCounter 
                                            value={financialModel.burn_rate_usd || 0}
                                            prefix="$"
                                            duration={2.2}
                                          />
                                        </div>
                                        <div className="text-sm text-red-700">Monthly Burn Rate</div>
                                      </div>
                                    </InsightTooltip>
                                    
                                    <InsightTooltip
                                      title="LTV/CAC Ratio"
                                      description="Customer lifetime value to acquisition cost ratio"
                                      insight="Ratio >3:1 indicates healthy unit economics"
                                    >
                                      <div className="bg-blue-50 rounded-lg p-4 cursor-help hover:bg-blue-100 transition-colors">
                                        <div className="text-2xl font-bold text-blue-600">
                                          <AnimatedCounter 
                                            value={financialModel.ltv_cac_ratio || 0}
                                            suffix=":1"
                                            decimals={1}
                                            duration={2.4}
                                          />
                                        </div>
                                        <div className="text-sm text-blue-700">LTV/CAC Ratio</div>
                                      </div>
                                    </InsightTooltip>
                                    
                                    <InsightTooltip
                                      title="Runway"
                                      description="Months of cash remaining at current burn rate"
                                      insight="18+ months runway is ideal for fundraising"
                                    >
                                      <div className="bg-purple-50 rounded-lg p-4 cursor-help hover:bg-purple-100 transition-colors">
                                        <div className="text-2xl font-bold text-purple-600">
                                          <AnimatedCounter 
                                            value={financialModel.runway_months || 0}
                                            suffix=" mo"
                                            decimals={0}
                                            duration={2.6}
                                          />
                                        </div>
                                        <div className="text-sm text-purple-700">Runway</div>
                                      </div>
                                    </InsightTooltip>
                                  </div>

                                  {financialModel.revenue_model_notes && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                      <h4 className="font-medium text-gray-900 mb-2">Revenue Model Notes</h4>
                                      <p className="text-gray-700 text-sm">{financialModel.revenue_model_notes}</p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-600">No financial model data available</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </GlowingCard>
                      </motion.div>
                    </TabsContent>

                    {/* ✅ Pitch Deck Tab */}
                    <TabsContent value="pitch" className="mt-0">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <GlowingCard glowColor="purple" intensity="medium">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                                Pitch Deck Analysis
                                <Badge variant="info" className="ml-2">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Analyzed
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {pitchDeck ? (
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
                                        <Target className="w-4 h-4 mr-2" />
                                        Core Solution
                                      </h4>
                                      <p className="text-emerald-800 text-sm">{pitchDeck.core_solution || 'Not specified'}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-medium text-blue-900 mb-2 flex items-center">
                                      <Users className="w-4 h-4 mr-2" />
                                      Target Customer Segment
                                    </h4>
                                    <p className="text-blue-800 text-sm">{pitchDeck.customer_segment || 'Not specified'}</p>
                                  </div>
                                  
                                  {pitchDeck.product_summary_md && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                      <h4 className="font-medium text-gray-900 mb-2">Product Summary</h4>
                                      <div className="prose prose-sm max-w-none text-gray-700">
                                        <pre className="whitespace-pre-wrap text-sm">{pitchDeck.product_summary_md}</pre>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-600">No pitch deck data available</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </GlowingCard>
                      </motion.div>
                    </TabsContent>

                    {/* ✅ Market Size Tab */}
                    <TabsContent value="market" className="mt-0">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <GlowingCard glowColor="orange" intensity="medium">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Globe className="w-5 h-5 text-orange-600 mr-2" />
                                Market Size Analysis
                                <Badge variant="warning" className="ml-2">
                                  <Award className="w-3 h-3 mr-1" />
                                  TAM/SAM/SOM
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {financialModel?.tam_sam_som_json ? (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InsightTooltip
                                      title="Total Addressable Market"
                                      description="The total market demand for your product"
                                      insight="TAM represents the maximum revenue opportunity"
                                    >
                                      <div className="bg-blue-50 rounded-lg p-6 text-center cursor-help hover:bg-blue-100 transition-colors">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">
                                          <AnimatedCounter 
                                            value={financialModel.tam_sam_som_json.tam / 1000000000}
                                            prefix="$"
                                            suffix="B"
                                            decimals={1}
                                            duration={2}
                                          />
                                        </div>
                                        <div className="text-sm text-blue-700 font-medium">Total Addressable Market</div>
                                      </div>
                                    </InsightTooltip>
                                    
                                    <InsightTooltip
                                      title="Serviceable Addressable Market"
                                      description="The portion of TAM you can realistically target"
                                      insight="SAM is your realistic market opportunity"
                                    >
                                      <div className="bg-purple-50 rounded-lg p-6 text-center cursor-help hover:bg-purple-100 transition-colors">
                                        <div className="text-3xl font-bold text-purple-600 mb-2">
                                          <AnimatedCounter 
                                            value={financialModel.tam_sam_som_json.sam / 1000000000}
                                            prefix="$"
                                            suffix="B"
                                            decimals={1}
                                            duration={2.2}
                                          />
                                        </div>
                                        <div className="text-sm text-purple-700 font-medium">Serviceable Addressable Market</div>
                                      </div>
                                    </InsightTooltip>
                                    
                                    <InsightTooltip
                                      title="Serviceable Obtainable Market"
                                      description="The portion of SAM you can capture short-term"
                                      insight="SOM is your immediate market opportunity"
                                    >
                                      <div className="bg-emerald-50 rounded-lg p-6 text-center cursor-help hover:bg-emerald-100 transition-colors">
                                        <div className="text-3xl font-bold text-emerald-600 mb-2">
                                          <AnimatedCounter 
                                            value={financialModel.tam_sam_som_json.som / 1000000}
                                            prefix="$"
                                            suffix="M"
                                            decimals={0}
                                            duration={2.4}
                                          />
                                        </div>
                                        <div className="text-sm text-emerald-700 font-medium">Serviceable Obtainable Market</div>
                                      </div>
                                    </InsightTooltip>
                                  </div>

                                  <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-lg p-6">
                                    <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                      <Brain className="w-5 h-5 text-blue-600 mr-2" />
                                      Market Opportunity Insights
                                    </h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                      <div>
                                        <span className="font-medium text-gray-700">Market Penetration:</span>
                                        <span className="ml-2 text-gray-600">
                                          {((financialModel.tam_sam_som_json.som / financialModel.tam_sam_som_json.sam) * 100).toFixed(1)}% of SAM
                                        </span>
                                      </div>
                                      <div>
                                        <span className="font-medium text-gray-700">Growth Potential:</span>
                                        <span className="ml-2 text-emerald-600 font-medium">High</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-600">No market size data available</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </GlowingCard>
                      </motion.div>
                    </TabsContent>

                    {/* ✅ VC Matching Tab */}
                    <TabsContent value="vc-matching" className="mt-0">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <GlowingCard glowColor="emerald" intensity="medium">
                          <Card>
                            <CardHeader>
                              <CardTitle className="flex items-center">
                                <Users className="w-5 h-5 text-emerald-600 mr-2" />
                                VC Matching Analysis
                                <Badge variant="success" className="ml-2">
                                  <Target className="w-3 h-3 mr-1" />
                                  AI Matched
                                </Badge>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              {vcFitReport ? (
                                <div className="space-y-6">
                                  {vcFitReport.matched_vcs_json?.matches && (
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                                        <Star className="w-4 h-4 text-yellow-500 mr-2" />
                                        Top VC Matches
                                      </h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {vcFitReport.matched_vcs_json.matches.map((vc: any, index: number) => (
                                          <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                          >
                                            <div className="flex items-center justify-between mb-2">
                                              <h5 className="font-medium text-gray-900">{vc.name}</h5>
                                              <Badge variant="success">
                                                <AnimatedCounter value={vc.fit_score} suffix="%" duration={1.5} />
                                              </Badge>
                                            </div>
                                            <p className="text-sm text-gray-600">{vc.focus}</p>
                                            <div className="mt-2">
                                              <Progress value={vc.fit_score} className="h-2" />
                                            </div>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {vcFitReport.requirements_to_improve && vcFitReport.requirements_to_improve.length > 0 && (
                                    <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                                      <h4 className="font-medium text-amber-900 mb-4 flex items-center">
                                        <Target className="w-4 h-4 mr-2" />
                                        Areas for Improvement
                                      </h4>
                                      <ul className="space-y-2">
                                        {vcFitReport.requirements_to_improve.map((requirement, index) => (
                                          <motion.li 
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start text-sm text-amber-800"
                                          >
                                            <span className="w-2 h-2 bg-amber-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                                            {requirement}
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {vcFitReport.funding_probability && (
                                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
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
                              ) : (
                                <div className="text-center py-8">
                                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-600">No VC matching data available</p>
                                </div>
                              )}
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
    </div>
  );
};

export default CompanyDetailPage;