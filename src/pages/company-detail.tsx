import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import GlowingCard from '../components/advanced/GlowingCard';
import AnimatedCounter from '../components/advanced/AnimatedCounter';
import MorphingButton from '../components/advanced/MorphingButton';
import ParticleBackground from '../components/advanced/ParticleBackground';
import InsightTooltip from '../components/InsightTooltip';
import LiveKPIChart from '../components/LiveKPIChart';
import KPIAnalysis from '../components/KPIAnalysis';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
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
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [financialModel, setFinancialModel] = useState<FinancialModel | null>(null);
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null);
  const [goToMarket, setGoToMarket] = useState<GoToMarket | null>(null);
  const [vcFitReport, setVcFitReport] = useState<VCFitReport | null>(null);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'kpi-analysis' | 'financial' | 'pitch' | 'market' | 'vc-matching'>('overview');

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
    console.log('🔍 CompanyDetailPage mounted with ID:', id);
    if (id) {
      fetchCompanyData(id);
    } else {
      console.error('❌ No company ID provided in URL params');
      setError('No company ID provided');
      setLoading(false);
    }
  }, [id]);

  const fetchCompanyData = async (companyId: string) => {
    try {
      setLoading(true);
      setError('');

      console.log(`🔍 Fetching data for company ID: ${companyId}`);

      // Fetch company data first
      console.log('📊 Fetching company basic info...');
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyError) {
        console.error('❌ Company fetch error:', companyError);
        throw new Error(`Company not found: ${companyError.message}`);
      }

      if (!companyData) {
        console.error('❌ No company data returned');
        throw new Error('Company not found');
      }

      console.log('✅ Company data loaded:', companyData);
      setCompany(companyData);

      // Fetch related data in parallel (non-blocking)
      console.log('📊 Fetching related data...');
      const fetchPromises = [
        supabase.from('financial_models').select('*').eq('company_id', companyId),
        supabase.from('pitch_decks').select('*').eq('company_id', companyId),
        supabase.from('go_to_market').select('*').eq('company_id', companyId),
        supabase.from('vc_fit_reports').select('*').eq('company_id', companyId),
        supabase.from('founders').select('*').eq('company_id', companyId)
      ];

      const [
        { data: financialData, error: financialError },
        { data: pitchData, error: pitchError },
        { data: gtmData, error: gtmError },
        { data: vcData, error: vcError },
        { data: foundersData, error: foundersError }
      ] = await Promise.all(fetchPromises);

      // Set data (ignore errors for optional data)
      if (financialError) {
        console.warn('⚠️ Financial model fetch warning:', financialError);
      } else {
        console.log('✅ Financial data loaded:', financialData);
        setFinancialModel(financialData?.[0] || null);
      }

      if (pitchError) {
        console.warn('⚠️ Pitch deck fetch warning:', pitchError);
      } else {
        console.log('✅ Pitch deck data loaded:', pitchData);
        setPitchDeck(pitchData?.[0] || null);
      }

      if (gtmError) {
        console.warn('⚠️ GTM fetch warning:', gtmError);
      } else {
        console.log('✅ GTM data loaded:', gtmData);
        setGoToMarket(gtmData?.[0] || null);
      }

      if (vcError) {
        console.warn('⚠️ VC fit report fetch warning:', vcError);
      } else {
        console.log('✅ VC fit data loaded:', vcData);
        setVcFitReport(vcData?.[0] || null);
      }

      if (foundersError) {
        console.warn('⚠️ Founders fetch warning:', foundersError);
      } else {
        console.log('✅ Founders data loaded:', foundersData);
        setFounders(foundersData || []);
      }

      console.log('🎉 All company data loaded successfully');

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

  const handleBackToCompanies = async () => {
    console.log('🔙 Navigating back to companies page');
    navigate('/companies');
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'kpi-analysis', label: 'KPI Analysis', icon: BarChart3 },
    { id: 'financial', label: 'Financial Model', icon: DollarSign },
    { id: 'pitch', label: 'Pitch Deck', icon: FileText },
    { id: 'market', label: 'Market Size', icon: Globe },
    { id: 'vc-matching', label: 'VC Matching', icon: Users },
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
          {id && (
            <p className="text-sm text-gray-500 mt-2">Company ID: {id}</p>
          )}
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
          {id && (
            <p className="text-sm text-gray-500 mb-4">Attempted to load company ID: {id}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <MorphingButton
              onClick={handleBackToCompanies}
              successText="Redirecting..."
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </MorphingButton>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ParticleBackground particleCount={25} color="#3B82F6" speed={0.3} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <MorphingButton
              variant="outline"
              className="mb-4"
              onClick={handleBackToCompanies}
              successText="Going back..."
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Companies
            </MorphingButton>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="blue" intensity="high">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <h1 className="text-3xl font-bold text-gray-900 mr-4">{company.name}</h1>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStageColor(company.startup_stage)}`}>
                        {company.startup_stage || 'Unknown Stage'}
                      </span>
                      {company.gpt_pitch_score !== null && company.gpt_pitch_score !== undefined && (
                        <Badge variant="outline" className="ml-2">
                          <Star className="w-3 h-3 mr-1" />
                          <AnimatedCounter value={company.gpt_pitch_score} decimals={1} duration={2} />
                          /10
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      {company.industry_name && (
                        <InsightTooltip
                          title="Industry"
                          description={`Operating in ${company.industry_name} sector`}
                          insight="Industry classification helps with benchmarking and VC matching"
                        >
                          <div className="flex items-center text-gray-600 cursor-help">
                            <Building2 className="w-4 h-4 mr-2" />
                            <span className="text-sm">{company.industry_name}</span>
                          </div>
                        </InsightTooltip>
                      )}
                      
                      {company.country && (
                        <InsightTooltip
                          title="Location"
                          description={`Based in ${company.country}`}
                          insight="Geographic location affects market access and regulatory environment"
                        >
                          <div className="flex items-center text-gray-600 cursor-help">
                            <MapPin className="w-4 h-4 mr-2" />
                            <span className="text-sm">{company.country}</span>
                          </div>
                        </InsightTooltip>
                      )}
                      
                      {company.incorporation_year && (
                        <InsightTooltip
                          title="Founded"
                          description={`Incorporated in ${company.incorporation_year}`}
                          insight="Company age indicates experience and market validation time"
                        >
                          <div className="flex items-center text-gray-600 cursor-help">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="text-sm">Founded {company.incorporation_year}</span>
                          </div>
                        </InsightTooltip>
                      )}
                      
                      {company.gpt_pitch_score !== null && company.gpt_pitch_score !== undefined && (
                        <InsightTooltip
                          title="AI Pitch Score"
                          description="AI-generated assessment of pitch quality"
                          insight={`Score of ${company.gpt_pitch_score.toFixed(1)}/10 indicates ${
                            company.gpt_pitch_score >= 8 ? 'excellent' : 
                            company.gpt_pitch_score >= 6 ? 'good' : 'needs improvement'
                          } pitch quality`}
                          benchmark={{
                            value: company.gpt_pitch_score * 10,
                            label: `${company.gpt_pitch_score.toFixed(1)}/10`,
                            status: company.gpt_pitch_score >= 8 ? 'excellent' : 
                                   company.gpt_pitch_score >= 6 ? 'good' : 'average'
                          }}
                        >
                          <div className="flex items-center text-gray-600 cursor-help">
                            <Brain className="w-4 h-4 mr-2" />
                            <span className={`text-sm font-medium ${getScoreColor(company.gpt_pitch_score)}`}>
                              AI Score: {company.gpt_pitch_score.toFixed(1)}/10
                            </span>
                          </div>
                        </InsightTooltip>
                      )}
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
                          insight="Target valuation indicates growth ambitions and market opportunity"
                        >
                          <div className="text-center p-4 bg-blue-50 rounded-lg cursor-help hover:bg-blue-100 transition-colors">
                            <div className="text-2xl font-bold text-blue-600">
                              {formatCurrency(company.valuation_target_usd)}
                            </div>
                            <div className="text-sm text-blue-700">Target Valuation</div>
                          </div>
                        </InsightTooltip>
                      )}
                      
                      {company.funding_goal_usd && (
                        <InsightTooltip
                          title="Funding Goal"
                          description="Amount seeking to raise"
                          insight="Funding goal reflects capital needs for growth and expansion"
                        >
                          <div className="text-center p-4 bg-purple-50 rounded-lg cursor-help hover:bg-purple-100 transition-colors">
                            <div className="text-2xl font-bold text-purple-600">
                              {formatCurrency(company.funding_goal_usd)}
                            </div>
                            <div className="text-sm text-purple-700">Funding Goal</div>
                          </div>
                        </InsightTooltip>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GlowingCard>
          </motion.div>
        </motion.div>

        {/* Enhanced Navigation Tabs */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="purple" intensity="medium">
              <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
                <div className="bg-white rounded-xl shadow-lg">
                  <div className="border-b border-gray-200">
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-transparent p-1">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 transition-all duration-200"
                          >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TabsContent value="overview" className="mt-0">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Live KPI Chart */}
                            <GlowingCard glowColor="emerald" intensity="medium">
                              <div className="bg-white rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                  <Activity className="w-5 h-5 text-emerald-600 mr-2" />
                                  Live KPI Dashboard
                                  <Badge variant="success" className="ml-2">
                                    <Zap className="w-3 h-3 mr-1" />
                                    Real-time
                                  </Badge>
                                </h3>
                                <LiveKPIChart companyId={company.id} companyName={company.name} />
                              </div>
                            </GlowingCard>

                            {/* Team Information */}
                            {founders.length > 0 && (
                              <GlowingCard glowColor="blue" intensity="medium">
                                <div className="bg-white rounded-lg p-6">
                                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                    <Users className="w-5 h-5 text-blue-600 mr-2" />
                                    Founding Team
                                    <Badge variant="info" className="ml-2">
                                      <Award className="w-3 h-3 mr-1" />
                                      {founders.length} Founder{founders.length !== 1 ? 's' : ''}
                                    </Badge>
                                  </h3>
                                  <div className="space-y-4">
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
                                            value: founder.founder_fit_score * 10,
                                            label: `${founder.founder_fit_score.toFixed(1)}/10 Fit Score`,
                                            status: founder.founder_fit_score >= 8 ? 'excellent' : 
                                                   founder.founder_fit_score >= 6 ? 'good' : 'average'
                                          } : undefined}
                                        >
                                          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-help">
                                            <div className="flex items-start justify-between mb-2">
                                              <h4 className="font-medium text-gray-900">{founder.full_name || 'Unknown'}</h4>
                                              {founder.founder_fit_score !== null && founder.founder_fit_score !== undefined && (
                                                <span className={`text-sm font-medium ${getScoreColor(founder.founder_fit_score)}`}>
                                                  <AnimatedCounter value={founder.founder_fit_score} decimals={1} duration={1.5} />
                                                  /10
                                                </span>
                                              )}
                                            </div>
                                            {founder.domain_experience_yrs && (
                                              <p className="text-sm text-gray-600 mb-2">
                                                <AnimatedCounter value={founder.domain_experience_yrs} duration={1.2} /> years domain experience
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
                                </div>
                              </GlowingCard>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="kpi-analysis" className="mt-0">
                          <KPIAnalysis 
                            companyId={company.id} 
                            companyName={company.name}
                            industry={company.industry_name}
                            stage={company.startup_stage}
                          />
                        </TabsContent>

                        <TabsContent value="financial" className="mt-0">
                          <GlowingCard glowColor="emerald" intensity="medium">
                            <div className="bg-white rounded-lg p-6">
                              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <DollarSign className="w-5 h-5 text-emerald-600 mr-2" />
                                Financial Model Analysis
                                <Badge variant="success" className="ml-2">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI-Analyzed
                                </Badge>
                              </h3>
                              {financialModel ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                  <InsightTooltip
                                    title="Monthly Revenue"
                                    description="Current monthly recurring revenue"
                                    insight="Strong MRR indicates product-market fit and scalable business model"
                                  >
                                    <div className="bg-emerald-50 rounded-lg p-4 cursor-help hover:bg-emerald-100 transition-colors">
                                      <div className="text-2xl font-bold text-emerald-600">
                                        {formatCurrency(financialModel.monthly_revenue_usd)}
                                      </div>
                                      <div className="text-sm text-emerald-700">Monthly Revenue</div>
                                    </div>
                                  </InsightTooltip>
                                  
                                  <InsightTooltip
                                    title="Burn Rate"
                                    description="Monthly cash burn rate"
                                    insight="Burn rate determines runway and funding needs"
                                  >
                                    <div className="bg-red-50 rounded-lg p-4 cursor-help hover:bg-red-100 transition-colors">
                                      <div className="text-2xl font-bold text-red-600">
                                        {formatCurrency(financialModel.burn_rate_usd)}
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
                                        {financialModel.ltv_cac_ratio !== null && financialModel.ltv_cac_ratio !== undefined 
                                          ? <><AnimatedCounter value={financialModel.ltv_cac_ratio} decimals={1} duration={1.5} />:1</>
                                          : 'N/A'}
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
                                        {financialModel.runway_months !== null && financialModel.runway_months !== undefined 
                                          ? <><AnimatedCounter value={financialModel.runway_months} decimals={0} duration={1.8} /> months</>
                                          : 'N/A'}
                                      </div>
                                      <div className="text-sm text-purple-700">Runway</div>
                                    </div>
                                  </InsightTooltip>
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-600">No financial model data available</p>
                                  <p className="text-sm text-gray-500 mt-2">Upload financial documents to see detailed analysis</p>
                                </div>
                              )}
                            </div>
                          </GlowingCard>
                        </TabsContent>

                        <TabsContent value="pitch" className="mt-0">
                          <GlowingCard glowColor="purple" intensity="medium">
                            <div className="bg-white rounded-lg p-6">
                              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                                Pitch Deck Analysis
                                {pitchDeck?.deck_quality_score && (
                                  <Badge variant="info" className="ml-2">
                                    <Star className="w-3 h-3 mr-1" />
                                    {pitchDeck.deck_quality_score.toFixed(1)}/10
                                  </Badge>
                                )}
                              </h3>
                              {pitchDeck ? (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InsightTooltip
                                      title="Core Problem"
                                      description="The main problem being solved"
                                      insight="Clear problem definition is crucial for investor understanding"
                                    >
                                      <div className="bg-red-50 rounded-lg p-4 cursor-help">
                                        <h4 className="font-medium text-red-900 mb-2">Core Problem</h4>
                                        <p className="text-red-800">{pitchDeck.core_problem || 'Not specified'}</p>
                                      </div>
                                    </InsightTooltip>
                                    
                                    <InsightTooltip
                                      title="Core Solution"
                                      description="The proposed solution"
                                      insight="Solution should directly address the identified problem"
                                    >
                                      <div className="bg-emerald-50 rounded-lg p-4 cursor-help">
                                        <h4 className="font-medium text-emerald-900 mb-2">Core Solution</h4>
                                        <p className="text-emerald-800">{pitchDeck.core_solution || 'Not specified'}</p>
                                      </div>
                                    </InsightTooltip>
                                  </div>
                                  
                                  <InsightTooltip
                                    title="Target Customer"
                                    description="Primary customer segment"
                                    insight="Well-defined customer segment indicates market focus"
                                  >
                                    <div className="bg-blue-50 rounded-lg p-4 cursor-help">
                                      <h4 className="font-medium text-blue-900 mb-2">Target Customer Segment</h4>
                                      <p className="text-blue-800">{pitchDeck.customer_segment || 'Not specified'}</p>
                                    </div>
                                  </InsightTooltip>
                                  
                                  {pitchDeck.product_summary_md && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                      <h4 className="font-medium text-gray-900 mb-2">Product Summary</h4>
                                      <div className="prose prose-sm max-w-none text-gray-700">
                                        <pre className="whitespace-pre-wrap">{pitchDeck.product_summary_md}</pre>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-600">No pitch deck data available</p>
                                  <p className="text-sm text-gray-500 mt-2">Upload your pitch deck to see detailed analysis</p>
                                </div>
                              )}
                            </div>
                          </GlowingCard>
                        </TabsContent>

                        <TabsContent value="market" className="mt-0">
                          <GlowingCard glowColor="orange" intensity="medium">
                            <div className="bg-white rounded-lg p-6">
                              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <Globe className="w-5 h-5 text-orange-600 mr-2" />
                                Market Size Analysis
                                <Badge variant="warning" className="ml-2">
                                  <Target className="w-3 h-3 mr-1" />
                                  TAM/SAM/SOM
                                </Badge>
                              </h3>
                              {financialModel?.tam_sam_som_json ? (
                                <div className="space-y-6">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InsightTooltip
                                      title="Total Addressable Market"
                                      description="The total market demand for the product"
                                      insight="TAM represents the maximum revenue opportunity"
                                    >
                                      <div className="bg-blue-50 rounded-lg p-6 text-center cursor-help hover:bg-blue-100 transition-colors">
                                        <div className="text-3xl font-bold text-blue-600 mb-2">
                                          {formatCurrency(financialModel.tam_sam_som_json.tam)}
                                        </div>
                                        <div className="text-sm text-blue-700 font-medium">Total Addressable Market</div>
                                      </div>
                                    </InsightTooltip>
                                    
                                    <InsightTooltip
                                      title="Serviceable Addressable Market"
                                      description="The portion of TAM that can be served"
                                      insight="SAM represents the realistic market opportunity"
                                    >
                                      <div className="bg-purple-50 rounded-lg p-6 text-center cursor-help hover:bg-purple-100 transition-colors">
                                        <div className="text-3xl font-bold text-purple-600 mb-2">
                                          {formatCurrency(financialModel.tam_sam_som_json.sam)}
                                        </div>
                                        <div className="text-sm text-purple-700 font-medium">Serviceable Addressable Market</div>
                                      </div>
                                    </InsightTooltip>
                                    
                                    <InsightTooltip
                                      title="Serviceable Obtainable Market"
                                      description="The portion of SAM that can realistically be captured"
                                      insight="SOM represents the near-term market opportunity"
                                    >
                                      <div className="bg-emerald-50 rounded-lg p-6 text-center cursor-help hover:bg-emerald-100 transition-colors">
                                        <div className="text-3xl font-bold text-emerald-600 mb-2">
                                          {formatCurrency(financialModel.tam_sam_som_json.som)}
                                        </div>
                                        <div className="text-sm text-emerald-700 font-medium">Serviceable Obtainable Market</div>
                                      </div>
                                    </InsightTooltip>
                                  </div>
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-600">No market size data available</p>
                                  <p className="text-sm text-gray-500 mt-2">Upload market research to see TAM/SAM/SOM analysis</p>
                                </div>
                              )}
                            </div>
                          </GlowingCard>
                        </TabsContent>

                        <TabsContent value="vc-matching" className="mt-0">
                          <GlowingCard glowColor="pink" intensity="medium">
                            <div className="bg-white rounded-lg p-6">
                              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                                <Users className="w-5 h-5 text-pink-600 mr-2" />
                                VC Matching Analysis
                                {vcFitReport?.funding_probability && (
                                  <Badge variant="info" className="ml-2">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {(vcFitReport.funding_probability * 100).toFixed(0)}% Probability
                                  </Badge>
                                )}
                              </h3>
                              {vcFitReport ? (
                                <div className="space-y-6">
                                  {vcFitReport.matched_vcs_json?.matches && (
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-4">Matched VCs</h4>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {vcFitReport.matched_vcs_json.matches.map((vc: any, index: number) => (
                                          <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                          >
                                            <InsightTooltip
                                              title={vc.name}
                                              description={vc.focus}
                                              insight={`${vc.fit_score}% match based on industry, stage, and investment criteria`}
                                              benchmark={{
                                                value: vc.fit_score,
                                                label: `${vc.fit_score}% Match`,
                                                status: vc.fit_score >= 80 ? 'excellent' : vc.fit_score >= 60 ? 'good' : 'average'
                                              }}
                                            >
                                              <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-help">
                                                <div className="flex items-center justify-between mb-2">
                                                  <h5 className="font-medium text-gray-900">{vc.name}</h5>
                                                  <span className="text-sm font-medium text-blue-600">
                                                    <AnimatedCounter value={vc.fit_score} duration={1.5} />% match
                                                  </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{vc.focus}</p>
                                              </div>
                                            </InsightTooltip>
                                          </motion.div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {vcFitReport.requirements_to_improve && vcFitReport.requirements_to_improve.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-gray-900 mb-4">Areas for Improvement</h4>
                                      <ul className="space-y-2">
                                        {vcFitReport.requirements_to_improve.map((requirement, index) => (
                                          <motion.li 
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start"
                                          >
                                            <Target className="w-4 h-4 text-orange-500 mr-2 mt-0.5" />
                                            <span className="text-sm text-gray-700">{requirement}</span>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-8">
                                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                  <p className="text-gray-600">No VC matching data available</p>
                                  <p className="text-sm text-gray-500 mt-2">Complete your profile to get matched with relevant investors</p>
                                </div>
                              )}
                            </div>
                          </GlowingCard>
                        </TabsContent>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </Tabs>
            </GlowingCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;