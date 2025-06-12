import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import GlowingCard from '../components/advanced/GlowingCard';
import AnimatedCounter from '../components/advanced/AnimatedCounter';
import ParticleBackground from '../components/advanced/ParticleBackground';
import MorphingButton from '../components/advanced/MorphingButton';
import ProgressiveBlur from '../components/advanced/ProgressiveBlur';
import LiveKPIChart from '../components/LiveKPIChart';
import KPIAnalysis from '../components/KPIAnalysis';
import InsightTooltip from '../components/InsightTooltip';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, TrendingUp, Users, BarChart3, FileText, Target, Loader2, AlertTriangle, Star, Globe, Zap, Brain, Award, Rocket } from 'lucide-react';

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
    if (id) {
      fetchCompanyData(id);
    }
  }, [id]);

  const fetchCompanyData = async (companyId: string) => {
    try {
      setLoading(true);
      setError('');

      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyError) throw companyError;
      setCompany(companyData);

      // Fetch all related data
      const [financialData, pitchData, gtmData, vcData, foundersData] = await Promise.allSettled([
        supabase.from('financial_models').select('*').eq('company_id', companyId),
        supabase.from('pitch_decks').select('*').eq('company_id', companyId),
        supabase.from('go_to_market').select('*').eq('company_id', companyId),
        supabase.from('vc_fit_reports').select('*').eq('company_id', companyId),
        supabase.from('founders').select('*').eq('company_id', companyId)
      ]);

      if (financialData.status === 'fulfilled') setFinancialModel(financialData.value.data?.[0] || null);
      if (pitchData.status === 'fulfilled') setPitchDeck(pitchData.value.data?.[0] || null);
      if (gtmData.status === 'fulfilled') setGoToMarket(gtmData.value.data?.[0] || null);
      if (vcData.status === 'fulfilled') setVcFitReport(vcData.value.data?.[0] || null);
      if (foundersData.status === 'fulfilled') setFounders(foundersData.value.data || []);

    } catch (err) {
      console.error('Error fetching company data:', err);
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2, color: 'blue' },
    { id: 'kpi-analysis', label: 'KPI Analysis', icon: BarChart3, color: 'emerald' },
    { id: 'financial', label: 'Financial Model', icon: DollarSign, color: 'purple' },
    { id: 'pitch', label: 'Pitch Deck', icon: FileText, color: 'orange' },
    { id: 'market', label: 'Market Size', icon: Globe, color: 'pink' },
    { id: 'vc-matching', label: 'VC Matching', icon: Users, color: 'indigo' },
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
            <Link
              to="/companies"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Companies
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="blue" intensity="high">
              <ProgressiveBlur intensity={10} direction="bottom">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 mr-4">{company.name}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStageColor(company.startup_stage)}`}>
                          {company.startup_stage || 'Unknown Stage'}
                        </span>
                        {company.gpt_pitch_score && (
                          <Badge variant="success" className="ml-2">
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
                            insight="Company age indicates maturity and experience level"
                          >
                            <div className="flex items-center text-gray-600 cursor-help">
                              <Calendar className="w-4 h-4 mr-2" />
                              <span className="text-sm">Founded {company.incorporation_year}</span>
                            </div>
                          </InsightTooltip>
                        )}
                        
                        <InsightTooltip
                          title="AI Assessment"
                          description="Overall AI-powered evaluation score"
                          insight="Score based on pitch quality, market opportunity, and team strength"
                        >
                          <div className="flex items-center text-gray-600 cursor-help">
                            <Brain className="w-4 h-4 mr-2" />
                            <span className={`text-sm font-medium ${getScoreColor(company.gpt_pitch_score)}`}>
                              AI Score: {company.gpt_pitch_score?.toFixed(1) || 'N/A'}/10
                            </span>
                          </div>
                        </InsightTooltip>
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
                            insight="Target valuation should align with market comparables and growth trajectory"
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
                            insight="Funding goal should provide 18-24 months runway for next milestones"
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
                </div>
              </ProgressiveBlur>
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
                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 p-1">
                      {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                          <TabsTrigger
                            key={tab.id}
                            value={tab.id}
                            className="flex items-center space-x-2 py-3 px-4 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600"
                          >
                            <Icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                          </TabsTrigger>
                        );
                      })}
                    </TabsList>
                  </div>
                </div>
              </Tabs>
            </GlowingCard>
          </motion.div>
        </motion.div>

        {/* Enhanced Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Key Metrics */}
                <GlowingCard glowColor="emerald" intensity="medium">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <BarChart3 className="w-6 h-6 text-emerald-600 mr-2" />
                      Key Metrics
                      <Badge variant="info" className="ml-2">
                        <Zap className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                    </h3>
                    <LiveKPIChart companyId={company.id} companyName={company.name} />
                  </div>
                </GlowingCard>

                {/* Team */}
                {founders.length > 0 && (
                  <GlowingCard glowColor="blue" intensity="medium">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                        <Users className="w-6 h-6 text-blue-600 mr-2" />
                        Founding Team
                        <Badge variant="success" className="ml-2">
                          <Award className="w-3 h-3 mr-1" />
                          {founders.length} Founder{founders.length > 1 ? 's' : ''}
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
                              title={founder.full_name || 'Founder'}
                              description={`${founder.domain_experience_yrs || 0} years experience`}
                              insight={founder.notable_achievements || "Experienced founder with domain expertise"}
                              benchmark={founder.founder_fit_score ? {
                                value: founder.founder_fit_score,
                                label: `${founder.founder_fit_score.toFixed(1)}/10 Fit Score`,
                                status: founder.founder_fit_score >= 8 ? 'excellent' : founder.founder_fit_score >= 6 ? 'good' : 'average'
                              } : undefined}
                            >
                              <div className="border border-gray-200 rounded-lg p-4 cursor-help hover:border-blue-300 transition-colors">
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
            )}

            {activeTab === 'kpi-analysis' && (
              <GlowingCard glowColor="emerald" intensity="high">
                <KPIAnalysis 
                  companyId={company.id} 
                  companyName={company.name}
                  industry={company.industry_name}
                  stage={company.startup_stage}
                />
              </GlowingCard>
            )}

            {activeTab === 'financial' && (
              <GlowingCard glowColor="purple" intensity="medium">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <DollarSign className="w-6 h-6 text-purple-600 mr-2" />
                    Financial Model Analysis
                    <Badge variant="info" className="ml-2">
                      <Brain className="w-3 h-3 mr-1" />
                      AI Analyzed
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
                        insight="Burn rate should provide sufficient runway to reach next milestones"
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
                        insight="Ratio should be 3:1 minimum, 5:1+ is excellent for SaaS"
                      >
                        <div className="bg-blue-50 rounded-lg p-4 cursor-help hover:bg-blue-100 transition-colors">
                          <div className="text-2xl font-bold text-blue-600">
                            {financialModel.ltv_cac_ratio !== null && financialModel.ltv_cac_ratio !== undefined 
                              ? <><AnimatedCounter value={financialModel.ltv_cac_ratio} decimals={1} duration={1.8} />:1</>
                              : 'N/A'}
                          </div>
                          <div className="text-sm text-blue-700">LTV/CAC Ratio</div>
                        </div>
                      </InsightTooltip>
                      
                      <InsightTooltip
                        title="Runway"
                        description="Months of cash runway remaining"
                        insight="18+ months runway is ideal for fundraising and growth"
                      >
                        <div className="bg-purple-50 rounded-lg p-4 cursor-help hover:bg-purple-100 transition-colors">
                          <div className="text-2xl font-bold text-purple-600">
                            {financialModel.runway_months !== null && financialModel.runway_months !== undefined 
                              ? <><AnimatedCounter value={financialModel.runway_months} decimals={0} duration={1.5} /> mo</>
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
                      <MorphingButton
                        variant="outline"
                        className="mt-4"
                        successText="Coming Soon!"
                        onClick={async () => {
                          await new Promise(resolve => setTimeout(resolve, 1500));
                        }}
                      >
                        <Rocket className="w-4 h-4 mr-2" />
                        Upload Financial Model
                      </MorphingButton>
                    </div>
                  )}
                </div>
              </GlowingCard>
            )}

            {/* Additional tab content for pitch, market, and vc-matching would follow similar patterns */}
            {activeTab === 'pitch' && (
              <GlowingCard glowColor="orange" intensity="medium">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <FileText className="w-6 h-6 text-orange-600 mr-2" />
                    Pitch Deck Analysis
                    <Badge variant="warning" className="ml-2">
                      <Star className="w-3 h-3 mr-1" />
                      AI Insights
                    </Badge>
                  </h3>
                  {pitchDeck ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InsightTooltip
                          title="Core Problem"
                          description="The main problem this startup is solving"
                          insight="Clear problem definition is crucial for investor understanding"
                        >
                          <div className="cursor-help">
                            <h4 className="font-medium text-gray-900 mb-2">Core Problem</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{pitchDeck.core_problem || 'Not specified'}</p>
                          </div>
                        </InsightTooltip>
                        
                        <InsightTooltip
                          title="Core Solution"
                          description="How this startup solves the identified problem"
                          insight="Solution should directly address the core problem with clear value proposition"
                        >
                          <div className="cursor-help">
                            <h4 className="font-medium text-gray-900 mb-2">Core Solution</h4>
                            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{pitchDeck.core_solution || 'Not specified'}</p>
                          </div>
                        </InsightTooltip>
                      </div>
                      
                      <InsightTooltip
                        title="Target Customer"
                        description="Primary customer segment being targeted"
                        insight="Well-defined customer segment indicates market focus and go-to-market clarity"
                      >
                        <div className="cursor-help">
                          <h4 className="font-medium text-gray-900 mb-2">Target Customer Segment</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{pitchDeck.customer_segment || 'Not specified'}</p>
                        </div>
                      </InsightTooltip>
                      
                      {pitchDeck.product_summary_md && (
                        <InsightTooltip
                          title="Product Summary"
                          description="Detailed product description and features"
                          insight="Comprehensive product summary helps investors understand the offering"
                        >
                          <div className="cursor-help">
                            <h4 className="font-medium text-gray-900 mb-2">Product Summary</h4>
                            <div className="prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                              <pre className="whitespace-pre-wrap text-gray-700 text-sm">{pitchDeck.product_summary_md}</pre>
                            </div>
                          </div>
                        </InsightTooltip>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No pitch deck data available</p>
                      <MorphingButton
                        variant="outline"
                        successText="Upload Started!"
                        onClick={async () => {
                          await new Promise(resolve => setTimeout(resolve, 1500));
                          window.location.href = '/upload';
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Pitch Deck
                      </MorphingButton>
                    </div>
                  )}
                </div>
              </GlowingCard>
            )}

            {activeTab === 'market' && (
              <GlowingCard glowColor="pink" intensity="medium">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Globe className="w-6 h-6 text-pink-600 mr-2" />
                    Market Size Analysis
                    <Badge variant="info" className="ml-2">
                      <Target className="w-3 h-3 mr-1" />
                      TAM/SAM/SOM
                    </Badge>
                  </h3>
                  {financialModel?.tam_sam_som_json ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InsightTooltip
                          title="Total Addressable Market"
                          description="The total market demand for the product/service"
                          insight="TAM represents the maximum revenue opportunity if 100% market share was achieved"
                        >
                          <div className="bg-blue-50 rounded-lg p-6 text-center cursor-help hover:bg-blue-100 transition-colors">
                            <div className="text-3xl font-bold text-blue-600 mb-2">
                              <AnimatedCounter 
                                value={financialModel.tam_sam_som_json.tam / 1000000000}
                                prefix="$"
                                suffix="B"
                                decimals={1}
                                duration={2.5}
                              />
                            </div>
                            <div className="text-sm text-blue-700 font-medium">Total Addressable Market</div>
                          </div>
                        </InsightTooltip>
                        
                        <InsightTooltip
                          title="Serviceable Addressable Market"
                          description="The portion of TAM that can be realistically targeted"
                          insight="SAM represents the market segment that aligns with your business model"
                        >
                          <div className="bg-purple-50 rounded-lg p-6 text-center cursor-help hover:bg-purple-100 transition-colors">
                            <div className="text-3xl font-bold text-purple-600 mb-2">
                              <AnimatedCounter 
                                value={financialModel.tam_sam_som_json.sam / 1000000000}
                                prefix="$"
                                suffix="B"
                                decimals={1}
                                duration={2.7}
                              />
                            </div>
                            <div className="text-sm text-purple-700 font-medium">Serviceable Addressable Market</div>
                          </div>
                        </InsightTooltip>
                        
                        <InsightTooltip
                          title="Serviceable Obtainable Market"
                          description="The portion of SAM that can realistically be captured"
                          insight="SOM represents your realistic market share potential in the near term"
                        >
                          <div className="bg-emerald-50 rounded-lg p-6 text-center cursor-help hover:bg-emerald-100 transition-colors">
                            <div className="text-3xl font-bold text-emerald-600 mb-2">
                              <AnimatedCounter 
                                value={financialModel.tam_sam_som_json.som / 1000000}
                                prefix="$"
                                suffix="M"
                                decimals={0}
                                duration={2.3}
                              />
                            </div>
                            <div className="text-sm text-emerald-700 font-medium">Serviceable Obtainable Market</div>
                          </div>
                        </InsightTooltip>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No market size data available</p>
                      <MorphingButton
                        variant="outline"
                        successText="Analysis Started!"
                        onClick={async () => {
                          await new Promise(resolve => setTimeout(resolve, 1500));
                        }}
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Generate Market Analysis
                      </MorphingButton>
                    </div>
                  )}
                </div>
              </GlowingCard>
            )}

            {activeTab === 'vc-matching' && (
              <GlowingCard glowColor="indigo" intensity="medium">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Users className="w-6 h-6 text-indigo-600 mr-2" />
                    VC Matching Analysis
                    <Badge variant="warning" className="ml-2">
                      <Rocket className="w-3 h-3 mr-1" />
                      Coming Soon
                    </Badge>
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
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <InsightTooltip
                                  title={vc.name}
                                  description={`${vc.fit_score}% match based on focus and stage`}
                                  insight="High match scores indicate strong alignment with VC investment thesis"
                                >
                                  <div className="border border-gray-200 rounded-lg p-4 cursor-help hover:border-indigo-300 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium text-gray-900">{vc.name}</h5>
                                      <span className="text-sm font-medium text-indigo-600">
                                        <AnimatedCounter value={vc.fit_score} suffix="%" duration={1.5} />
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
                      <p className="text-gray-600 mb-4">No VC matching data available</p>
                      <MorphingButton
                        variant="outline"
                        successText="Matching Started!"
                        onClick={async () => {
                          await new Promise(resolve => setTimeout(resolve, 1500));
                        }}
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        Find VC Matches
                      </MorphingButton>
                    </div>
                  )}
                </div>
              </GlowingCard>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyDetailPage;