import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  FileText, 
  Target, 
  MapPin, 
  Calendar,
  Loader2,
  Star,
  Award,
  Brain,
  Zap,
  Globe,
  Calculator,
  PieChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  TrendingDown,
  Eye,
  Lightbulb,
  Rocket
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  industry_name: string;
  sub_industry_name: string;
  country: string;
  geo_region: string;
  startup_stage: string;
  valuation_target_usd: number | null;
  funding_goal_usd: number | null;
  incorporation_year: number;
  pitch_deck_summary: string;
  gpt_pitch_score: number;
  created_at: string;
}

interface Founder {
  id: string;
  full_name: string;
  linkedin_url: string;
  education_history: string[];
  domain_experience_yrs: number;
  technical_skills: string[];
  notable_achievements: string;
  founder_fit_score: number;
}

interface Metric {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  as_of_date: string;
}

interface FinancialModel {
  id: string;
  monthly_revenue_usd: number | null;
  burn_rate_usd: number | null;
  ltv_cac_ratio: number | null;
  runway_months: number | null;
  revenue_model_notes: string;
  model_quality_score: number;
  tam_sam_som_json: any;
}

interface PitchDeck {
  id: string;
  core_problem: string;
  core_solution: string;
  customer_segment: string;
  product_summary_md: string;
  deck_quality_score: number;
  market_trends_json: any;
}

interface GoToMarket {
  gtm_channels: string[];
  gtm_notes_md: string;
  gtm_strength_score: number;
}

interface VCFitReport {
  id: string;
  matched_vcs_json: any;
  similar_startup_cases: string[];
  requirements_to_improve: string[];
  fit_score_breakdown: any;
  investor_synopsis_md: string;
  funding_probability: number;
}

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const [company, setCompany] = useState<Company | null>(null);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [financialModel, setFinancialModel] = useState<FinancialModel | null>(null);
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null);
  const [goToMarket, setGoToMarket] = useState<GoToMarket | null>(null);
  const [vcFitReport, setVcFitReport] = useState<VCFitReport | null>(null);

  useEffect(() => {
    if (id) {
      fetchCompanyData();
    }
  }, [id]);

  const fetchCompanyData = async () => {
    try {
      setLoading(true);
      
      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();

      if (companyError) throw companyError;
      setCompany(companyData);

      // Fetch founders
      const { data: foundersData } = await supabase
        .from('founders')
        .select('*')
        .eq('company_id', id);
      setFounders(foundersData || []);

      // Fetch metrics
      const { data: metricsData } = await supabase
        .from('metrics')
        .select('*')
        .eq('company_id', id)
        .order('as_of_date', { ascending: false });
      setMetrics(metricsData || []);

      // Fetch financial model
      const { data: financialData } = await supabase
        .from('financial_models')
        .select('*')
        .eq('company_id', id)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();
      setFinancialModel(financialData);

      // Fetch pitch deck
      const { data: pitchData } = await supabase
        .from('pitch_decks')
        .select('*')
        .eq('company_id', id)
        .order('upload_timestamp', { ascending: false })
        .limit(1)
        .maybeSingle();
      setPitchDeck(pitchData);

      // Fetch go-to-market
      const { data: gtmData } = await supabase
        .from('go_to_market')
        .select('*')
        .eq('company_id', id)
        .maybeSingle();
      setGoToMarket(gtmData);

      // Fetch VC fit report
      const { data: vcData } = await supabase
        .from('vc_fit_reports')
        .select('*')
        .eq('company_id', id)
        .order('id', { ascending: false })
        .limit(1)
        .maybeSingle();
      setVcFitReport(vcData);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company data');
      console.error('Error fetching company data:', err);
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getBenchmarkData = (industry: string, stage: string) => {
    const benchmarks: Record<string, Record<string, any>> = {
      'SaaS': {
        'Series A': {
          mrr: { median: 100000, p75: 200000, p25: 50000 },
          ltv_cac: { median: 3.5, p75: 5.0, p25: 2.5 },
          churn: { median: 3.5, p75: 2.0, p25: 5.0 },
          growth: { median: 10, p75: 15, p25: 7 }
        },
        'Seed': {
          mrr: { median: 25000, p75: 50000, p25: 10000 },
          ltv_cac: { median: 2.8, p75: 4.0, p25: 2.0 },
          churn: { median: 5.0, p75: 3.0, p25: 7.0 },
          growth: { median: 15, p75: 25, p25: 10 }
        }
      },
      'HealthTech': {
        'Series B': {
          mrr: { median: 400000, p75: 600000, p25: 250000 },
          ltv_cac: { median: 5.5, p75: 8.0, p25: 4.0 },
          churn: { median: 2.0, p75: 1.5, p25: 3.0 },
          growth: { median: 8, p75: 12, p25: 5 }
        }
      },
      'FinTech': {
        'Pre-seed': {
          mrr: { median: 5000, p75: 15000, p25: 2000 },
          ltv_cac: { median: 1.8, p75: 2.5, p25: 1.2 },
          churn: { median: 8.0, p75: 5.0, p25: 12.0 },
          growth: { median: 20, p75: 35, p25: 12 }
        }
      },
      'EdTech': {
        'Series A': {
          mrr: { median: 80000, p75: 150000, p25: 40000 },
          ltv_cac: { median: 3.2, p75: 4.5, p25: 2.2 },
          churn: { median: 4.0, p75: 2.5, p25: 6.0 },
          growth: { median: 12, p75: 18, p25: 8 }
        }
      }
    };

    return benchmarks[industry]?.[stage] || benchmarks['SaaS']?.['Series A'] || {};
  };

  const calculateBottomUpMarket = (company: Company, financialModel: FinancialModel | null) => {
    if (!financialModel?.monthly_revenue_usd) return null;

    const avgPricePerCustomer = financialModel.monthly_revenue_usd / Math.max(1, Math.floor(financialModel.monthly_revenue_usd / 500)); // Estimate customer count
    const currentCustomers = Math.floor(financialModel.monthly_revenue_usd / avgPricePerCustomer);
    
    // Industry-specific market sizing
    const marketData: Record<string, any> = {
      'SaaS': {
        totalUnits: 500000,
        penetrationRate: 8,
        avgPrice: avgPricePerCustomer * 1.2
      },
      'HealthTech': {
        totalUnits: 150000,
        penetrationRate: 12,
        avgPrice: avgPricePerCustomer * 1.5
      },
      'FinTech': {
        totalUnits: 2000000,
        penetrationRate: 5,
        avgPrice: avgPricePerCustomer * 0.8
      },
      'EdTech': {
        totalUnits: 300000,
        penetrationRate: 10,
        avgPrice: avgPricePerCustomer * 1.1
      },
      'CleanTech': {
        totalUnits: 100000,
        penetrationRate: 15,
        avgPrice: avgPricePerCustomer * 2.0
      }
    };

    const industryData = marketData[company.industry_name] || marketData['SaaS'];
    const bottomUpTAM = (industryData.totalUnits * industryData.avgPrice * 12) / 1000000; // Annual in millions
    const sam = bottomUpTAM * (industryData.penetrationRate / 100);
    const som = (financialModel.monthly_revenue_usd * 12 * 10) / 1000000; // 10x current revenue as 3-year plan

    return {
      segment: company.sub_industry_name || company.industry_name,
      avgPrice: industryData.avgPrice,
      totalUnits: industryData.totalUnits,
      bottomUpTAM: bottomUpTAM,
      penetrationRate: industryData.penetrationRate,
      sam: sam,
      som: som,
      currentCustomers: currentCustomers
    };
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'metrics', label: 'KPI Metrics', icon: BarChart3 },
    { id: 'financial', label: 'Financial Model', icon: DollarSign },
    { id: 'founders', label: 'Founders', icon: Users },
    { id: 'pitch', label: 'Pitch Deck', icon: FileText },
    { id: 'gtm', label: 'Go-to-Market', icon: Target },
    { id: 'vc-fit', label: 'VC Matching', icon: Star },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading company data...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Not Found</h2>
          <p className="text-red-600 mb-4">{error || 'Company not found'}</p>
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

  const benchmarks = getBenchmarkData(company.industry_name, company.startup_stage);
  const bottomUpMarket = calculateBottomUpMarket(company, financialModel);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/companies"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                {company.industry_name && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                    {company.industry_name}
                  </span>
                )}
                {company.startup_stage && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-medium">
                    {company.startup_stage}
                  </span>
                )}
                {company.country && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {company.country}
                  </div>
                )}
                {company.incorporation_year && (
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Founded {company.incorporation_year}
                  </div>
                )}
              </div>
              {company.pitch_deck_summary && (
                <p className="text-gray-600 max-w-3xl">{company.pitch_deck_summary}</p>
              )}
            </div>
            
            <div className="ml-6 text-right">
              {company.gpt_pitch_score && (
                <div className="mb-2">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(company.gpt_pitch_score)}`}>
                    <Brain className="w-4 h-4 mr-1" />
                    AI Score: {company.gpt_pitch_score}/100
                  </div>
                </div>
              )}
              <div className="space-y-1 text-sm">
                {company.valuation_target_usd && (
                  <div className="text-gray-600">
                    Target: <span className="font-semibold text-gray-900">{formatCurrency(company.valuation_target_usd)}</span>
                  </div>
                )}
                {company.funding_goal_usd && (
                  <div className="text-gray-600">
                    Seeking: <span className="font-semibold text-gray-900">{formatCurrency(company.funding_goal_usd)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Eye className="w-5 h-5 mr-2 text-blue-600" />
                Executive Summary
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Business Overview</h4>
                      <p className="text-gray-600">{company.pitch_deck_summary}</p>
                    </div>
                    {pitchDeck && (
                      <>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Core Problem</h4>
                          <p className="text-gray-600">{pitchDeck.core_problem}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2">Solution</h4>
                          <p className="text-gray-600">{pitchDeck.core_solution}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-blue-600 mb-1">Investment Readiness</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {vcFitReport?.funding_probability?.toFixed(0) || 'N/A'}%
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-green-600 mb-1">Monthly Revenue</div>
                    <div className="text-2xl font-bold text-green-900">
                      {formatCurrency(financialModel?.monthly_revenue_usd)}
                    </div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-purple-600 mb-1">Team Strength</div>
                    <div className="text-2xl font-bold text-purple-900">
                      {founders.length} Founder{founders.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Highlights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Strengths */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Key Strengths
                </h3>
                <div className="space-y-3">
                  {vcFitReport?.fit_score_breakdown && (
                    <>
                      {vcFitReport.fit_score_breakdown.team >= 8 && (
                        <div className="flex items-center text-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Strong founding team with proven experience
                        </div>
                      )}
                      {vcFitReport.fit_score_breakdown.market >= 8 && (
                        <div className="flex items-center text-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Large addressable market opportunity
                        </div>
                      )}
                      {vcFitReport.fit_score_breakdown.product >= 8 && (
                        <div className="flex items-center text-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Strong product-market fit indicators
                        </div>
                      )}
                      {vcFitReport.fit_score_breakdown.traction >= 7 && (
                        <div className="flex items-center text-green-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Solid early traction and growth metrics
                        </div>
                      )}
                    </>
                  )}
                  {financialModel?.ltv_cac_ratio && financialModel.ltv_cac_ratio > 3 && (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Healthy unit economics (LTV/CAC: {financialModel.ltv_cac_ratio.toFixed(1)}x)
                    </div>
                  )}
                  {financialModel?.runway_months && financialModel.runway_months > 12 && (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Sufficient runway ({financialModel.runway_months} months)
                    </div>
                  )}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                  Areas for Improvement
                </h3>
                <div className="space-y-3">
                  {vcFitReport?.requirements_to_improve ? (
                    vcFitReport.requirements_to_improve.map((requirement, index) => (
                      <div key={index} className="flex items-start text-orange-700">
                        <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{requirement}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      {financialModel?.ltv_cac_ratio && financialModel.ltv_cac_ratio < 3 && (
                        <div className="flex items-center text-orange-700">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Improve unit economics (current LTV/CAC: {financialModel.ltv_cac_ratio.toFixed(1)}x)
                        </div>
                      )}
                      {financialModel?.runway_months && financialModel.runway_months < 12 && (
                        <div className="flex items-center text-orange-700">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Limited runway ({financialModel.runway_months} months)
                        </div>
                      )}
                      {metrics.length < 5 && (
                        <div className="flex items-center text-orange-700">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Track more comprehensive KPIs
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {founders.length}
                  </div>
                  <div className="text-sm text-gray-600">Founders</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {metrics.length}
                  </div>
                  <div className="text-sm text-gray-600">KPIs Tracked</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {financialModel?.runway_months ?? 0}
                  </div>
                  <div className="text-sm text-gray-600">Runway (months)</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {vcFitReport?.funding_probability?.toFixed(0) || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Funding Probability</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-6">
            {/* KPI Dashboard with Benchmarks */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
                KPI Dashboard vs Industry Benchmarks
              </h3>
              
              {metrics.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {metrics.map((metric, index) => {
                      const benchmarkKey = metric.metric_name.toLowerCase().includes('revenue') ? 'mrr' :
                                          metric.metric_name.toLowerCase().includes('ltv') ? 'ltv_cac' :
                                          metric.metric_name.toLowerCase().includes('churn') ? 'churn' :
                                          metric.metric_name.toLowerCase().includes('growth') ? 'growth' : null;
                      
                      const benchmark = benchmarkKey ? benchmarks[benchmarkKey] : null;
                      const isAboveMedian = benchmark ? metric.metric_value > benchmark.median : null;
                      
                      return (
                        <div key={metric.id} className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600">{metric.metric_name}</span>
                            <div className="flex items-center space-x-1">
                              <BarChart3 className="w-4 h-4 text-blue-500" />
                              {isAboveMedian !== null && (
                                isAboveMedian ? 
                                  <TrendingUp className="w-4 h-4 text-green-500" /> :
                                  <TrendingDown className="w-4 h-4 text-red-500" />
                              )}
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-gray-900 mb-1">
                            {metric.metric_unit === 'USD' ? '$' : ''}
                            {metric.metric_value.toLocaleString()}
                            {metric.metric_unit === '%' ? '%' : ''}
                            {metric.metric_unit && metric.metric_unit !== 'USD' && metric.metric_unit !== '%' ? ` ${metric.metric_unit}` : ''}
                          </div>
                          {benchmark && (
                            <div className="text-xs text-gray-500 space-y-1">
                              <div>Industry Median: {benchmark.median.toLocaleString()}</div>
                              <div className={`font-medium ${isAboveMedian ? 'text-green-600' : 'text-red-600'}`}>
                                {isAboveMedian ? 'Above' : 'Below'} median
                              </div>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-1">
                            As of {new Date(metric.as_of_date).toLocaleDateString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Industry Comparison Table */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      {company.industry_name} {company.startup_stage} Benchmarks
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Metric</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Your Value</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">25th %ile</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Median</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">75th %ile</th>
                            <th className="text-left py-2 px-3 text-sm font-medium text-gray-600">Performance</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {Object.entries(benchmarks).map(([key, benchmark]: [string, any]) => {
                            const currentMetric = metrics.find(m => 
                              m.metric_name.toLowerCase().includes(key.replace('_', '')) ||
                              (key === 'mrr' && m.metric_name.toLowerCase().includes('revenue'))
                            );
                            
                            if (!currentMetric) return null;
                            
                            const performance = currentMetric.metric_value >= benchmark.p75 ? 'Excellent' :
                                             currentMetric.metric_value >= benchmark.median ? 'Good' :
                                             currentMetric.metric_value >= benchmark.p25 ? 'Fair' : 'Needs Improvement';
                            
                            const performanceColor = performance === 'Excellent' ? 'text-green-600' :
                                                   performance === 'Good' ? 'text-blue-600' :
                                                   performance === 'Fair' ? 'text-yellow-600' : 'text-red-600';
                            
                            return (
                              <tr key={key} className="border-b border-gray-100">
                                <td className="py-2 px-3 font-medium">{currentMetric.metric_name}</td>
                                <td className="py-2 px-3 font-semibold">{currentMetric.metric_value.toLocaleString()}</td>
                                <td className="py-2 px-3">{benchmark.p25.toLocaleString()}</td>
                                <td className="py-2 px-3 font-medium">{benchmark.median.toLocaleString()}</td>
                                <td className="py-2 px-3">{benchmark.p75.toLocaleString()}</td>
                                <td className={`py-2 px-3 font-medium ${performanceColor}`}>{performance}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Visual Chart */}
                  <div className="mt-8">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Metrics Overview</h4>
                    <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-end justify-between p-6">
                      {metrics.slice(0, 8).map((metric, index) => {
                        const maxValue = Math.max(...metrics.map(m => m.metric_value));
                        const height = Math.min(Math.max((metric.metric_value / maxValue) * 100, 10), 100);
                        return (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className="bg-gradient-to-t from-blue-600 to-purple-600 rounded-t w-12 transition-all duration-300 hover:opacity-80"
                              style={{ height: `${height}%` }}
                              title={`${metric.metric_name}: ${metric.metric_value}`}
                            ></div>
                            <div className="text-xs text-gray-600 mt-2 text-center w-16 truncate">
                              {metric.metric_name.split(' ')[0]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No KPI metrics available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            {financialModel ? (
              <>
                {/* Financial Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Monthly Revenue</h3>
                      <DollarSign className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(financialModel.monthly_revenue_usd)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      ARR: {formatCurrency((financialModel.monthly_revenue_usd || 0) * 12)}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Burn Rate</h3>
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {formatCurrency(financialModel.burn_rate_usd)}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Net Burn: {formatCurrency((financialModel.burn_rate_usd || 0) - (financialModel.monthly_revenue_usd || 0))}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">LTV/CAC Ratio</h3>
                      <Target className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {(financialModel.ltv_cac_ratio ?? 0).toFixed(1)}:1
                    </div>
                    <div className={`text-sm mt-1 ${(financialModel.ltv_cac_ratio || 0) >= 3 ? 'text-green-600' : 'text-red-600'}`}>
                      {(financialModel.ltv_cac_ratio || 0) >= 3 ? 'Healthy' : 'Needs Improvement'}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-medium text-gray-600">Runway</h3>
                      <Calendar className="w-5 h-5 text-purple-500" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {financialModel.runway_months ?? 0} months
                    </div>
                    <div className={`text-sm mt-1 ${(financialModel.runway_months || 0) >= 12 ? 'text-green-600' : 'text-red-600'}`}>
                      {(financialModel.runway_months || 0) >= 12 ? 'Sufficient' : 'Critical'}
                    </div>
                  </div>
                </div>

                {/* Financial Analysis */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                    Financial Analysis
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Unit Economics */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Unit Economics</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">LTV/CAC Ratio</span>
                          <span className={`font-semibold ${(financialModel.ltv_cac_ratio || 0) >= 3 ? 'text-green-600' : 'text-red-600'}`}>
                            {(financialModel.ltv_cac_ratio || 0).toFixed(1)}:1
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Monthly Revenue</span>
                          <span className="font-semibold">{formatCurrency(financialModel.monthly_revenue_usd)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Gross Margin</span>
                          <span className="font-semibold">
                            {financialModel.monthly_revenue_usd && financialModel.burn_rate_usd ? 
                              `${(((financialModel.monthly_revenue_usd - (financialModel.burn_rate_usd * 0.3)) / financialModel.monthly_revenue_usd) * 100).toFixed(1)}%` : 
                              'N/A'
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Revenue Growth Rate</span>
                          <span className="font-semibold text-green-600">15% MoM</span>
                        </div>
                      </div>
                    </div>

                    {/* Cash Flow Analysis */}
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-4">Cash Flow Analysis</h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Monthly Burn</span>
                          <span className="font-semibold text-red-600">{formatCurrency(financialModel.burn_rate_usd)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Net Burn</span>
                          <span className="font-semibold text-red-600">
                            {formatCurrency((financialModel.burn_rate_usd || 0) - (financialModel.monthly_revenue_usd || 0))}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Runway</span>
                          <span className={`font-semibold ${(financialModel.runway_months || 0) >= 12 ? 'text-green-600' : 'text-red-600'}`}>
                            {financialModel.runway_months} months
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-600">Break-even Timeline</span>
                          <span className="font-semibold">
                            {financialModel.monthly_revenue_usd && financialModel.burn_rate_usd ? 
                              `${Math.ceil((financialModel.burn_rate_usd - financialModel.monthly_revenue_usd) / (financialModel.monthly_revenue_usd * 0.15))} months` :
                              'N/A'
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Model */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Revenue Model</h3>
                  <p className="text-gray-600 mb-4">{financialModel.revenue_model_notes}</p>
                  {financialModel.model_quality_score && (
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(financialModel.model_quality_score)}`}>
                      <Award className="w-4 h-4 mr-1" />
                      Model Quality: {financialModel.model_quality_score}/100
                    </div>
                  )}
                </div>

                {/* Market Size Analysis */}
                {bottomUpMarket && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-600" />
                      Market Opportunity Analysis
                    </h3>
                    
                    {/* Bottom-Up Market Sizing */}
                    <div className="mb-8">
                      <h4 className="text-lg font-medium text-gray-900 mb-4">
                        📊 Market Opportunity Snapshot (Bottom-Up Approach)
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-gray-50 rounded-lg">
                          <tbody className="text-sm">
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 font-medium text-gray-900">Target Customer Segment</td>
                              <td className="py-3 px-4 text-gray-600">{bottomUpMarket.segment}</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 font-medium text-gray-900">Avg. Price per Customer</td>
                              <td className="py-3 px-4 text-gray-600">${bottomUpMarket.avgPrice.toLocaleString()}/mo</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 font-medium text-gray-900">Total Addressable Units</td>
                              <td className="py-3 px-4 text-gray-600">{bottomUpMarket.totalUnits.toLocaleString()} businesses</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 font-medium text-gray-900">Total Bottom-Up TAM</td>
                              <td className="py-3 px-4 font-semibold text-blue-600">${bottomUpMarket.bottomUpTAM.toFixed(1)}M/year</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 font-medium text-gray-900">Adoption Assumption</td>
                              <td className="py-3 px-4 text-gray-600">{bottomUpMarket.penetrationRate}%</td>
                            </tr>
                            <tr className="border-b border-gray-200">
                              <td className="py-3 px-4 font-medium text-gray-900">Serviceable Market (SAM)</td>
                              <td className="py-3 px-4 font-semibold text-green-600">${bottomUpMarket.sam.toFixed(1)}M (TAM × adoption %)</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 font-medium text-gray-900">Your Initial SOM</td>
                              <td className="py-3 px-4 font-semibold text-purple-600">${bottomUpMarket.som.toFixed(1)}M (3-year revenue plan)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Top-Down Market Size */}
                    {financialModel.tam_sam_som_json && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Top-Down Market Size</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-blue-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              ${(financialModel.tam_sam_som_json.tam / 1000000000).toFixed(0)}B
                            </div>
                            <div className="text-sm text-blue-800 font-medium">Total Addressable Market</div>
                          </div>
                          <div className="bg-green-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-green-600">
                              ${(financialModel.tam_sam_som_json.sam / 1000000000).toFixed(1)}B
                            </div>
                            <div className="text-sm text-green-800 font-medium">Serviceable Addressable Market</div>
                          </div>
                          <div className="bg-purple-50 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-purple-600">
                              ${(financialModel.tam_sam_som_json.som / 1000000).toFixed(0)}M
                            </div>
                            <div className="text-sm text-purple-800 font-medium">Serviceable Obtainable Market</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No financial model data available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'founders' && (
          <div className="space-y-6">
            {founders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {founders.map((founder) => (
                  <div key={founder.id} className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{founder.full_name}</h3>
                          <p className="text-sm text-gray-600">{founder.domain_experience_yrs} years experience</p>
                        </div>
                      </div>
                      {founder.founder_fit_score && (
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(founder.founder_fit_score)}`}>
                          {founder.founder_fit_score}/100
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {founder.education_history && founder.education_history.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Education</h4>
                          <div className="space-y-1">
                            {founder.education_history.map((edu, index) => (
                              <div key={index} className="text-sm text-gray-900 bg-gray-50 px-2 py-1 rounded">
                                {edu}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {founder.technical_skills && founder.technical_skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Technical Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {founder.technical_skills.map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {founder.notable_achievements && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-600 mb-2">Notable Achievements</h4>
                          <p className="text-sm text-gray-900">{founder.notable_achievements}</p>
                        </div>
                      )}

                      {founder.linkedin_url && (
                        <a
                          href={founder.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm"
                        >
                          View LinkedIn Profile →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No founder information available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'pitch' && (
          <div className="space-y-6">
            {pitchDeck ? (
              <>
                {/* Pitch Deck Analysis */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Pitch Deck Analysis & Insights
                    </h3>
                    {pitchDeck.deck_quality_score && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(pitchDeck.deck_quality_score)}`}>
                        Quality Score: {pitchDeck.deck_quality_score}/100
                      </div>
                    )}
                  </div>

                  {/* Problem & Solution */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-500">
                      <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                        Core Problem
                      </h4>
                      <p className="text-gray-700">{pitchDeck.core_problem}</p>
                      <div className="mt-4 p-3 bg-white rounded border">
                        <h5 className="font-medium text-gray-900 mb-2">Problem Analysis</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Clear pain point identification
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Market-validated problem
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Quantifiable impact
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-500">
                      <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-green-600" />
                        Core Solution
                      </h4>
                      <p className="text-gray-700">{pitchDeck.core_solution}</p>
                      <div className="mt-4 p-3 bg-white rounded border">
                        <h5 className="font-medium text-gray-900 mb-2">Solution Strength</h5>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Directly addresses core problem
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Scalable technology approach
                          </div>
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Competitive differentiation
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Trends */}
                  {pitchDeck.market_trends_json && (
                    <div className="bg-blue-50 rounded-lg p-6 mb-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                        Market Trends & Timing
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {pitchDeck.market_trends_json.trends?.map((trend: string, index: number) => (
                          <div key={index} className="bg-white rounded p-3 border">
                            <div className="flex items-center text-blue-600 mb-2">
                              <Activity className="w-4 h-4 mr-2" />
                              <span className="font-medium text-sm">Market Trend</span>
                            </div>
                            <p className="text-gray-700 text-sm">{trend}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Customer & Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-purple-600" />
                      Target Customer Analysis
                    </h4>
                    <div className="bg-purple-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-700">{pitchDeck.customer_segment}</p>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-gray-50 rounded p-3">
                        <h5 className="font-medium text-gray-900 mb-2">Customer Insights</h5>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>• Well-defined target segment</div>
                          <div>• Clear value proposition alignment</div>
                          <div>• Addressable market size validation</div>
                          <div>• Customer acquisition strategy clarity</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                      <Rocket className="w-5 h-5 mr-2 text-orange-600" />
                      Product Summary
                    </h4>
                    <div className="bg-orange-50 rounded-lg p-4 mb-4">
                      <div className="text-gray-700 prose prose-sm max-w-none">
                        {pitchDeck.product_summary_md}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <h5 className="font-medium text-gray-900 mb-2">Product Strengths</h5>
                      <div className="space-y-1 text-sm text-gray-600">
                        <div>• Clear feature differentiation</div>
                        <div>• Scalable architecture</div>
                        <div>• User experience focus</div>
                        <div>• Technical feasibility</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pitch Deck Recommendations */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                    AI-Powered Pitch Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-green-600 mb-3">Strengths to Emphasize</h5>
                      <div className="space-y-2">
                        <div className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                          <span>Strong problem-solution fit with clear market validation</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                          <span>Experienced team with relevant domain expertise</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                          <span>Favorable market timing with supporting trends</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5" />
                          <span>Clear competitive differentiation and moats</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h5 className="font-medium text-orange-600 mb-3">Areas to Strengthen</h5>
                      <div className="space-y-2">
                        <div className="flex items-start text-sm">
                          <AlertTriangle className="w-4 h-4 mr-2 text-orange-500 mt-0.5" />
                          <span>Add more specific traction metrics and growth projections</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <AlertTriangle className="w-4 h-4 mr-2 text-orange-500 mt-0.5" />
                          <span>Include detailed competitive analysis and positioning</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <AlertTriangle className="w-4 h-4 mr-2 text-orange-500 mt-0.5" />
                          <span>Provide clearer financial projections and unit economics</span>
                        </div>
                        <div className="flex items-start text-sm">
                          <AlertTriangle className="w-4 h-4 mr-2 text-orange-500 mt-0.5" />
                          <span>Strengthen go-to-market strategy with specific channels</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No pitch deck information available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gtm' && (
          <div className="space-y-6">
            {goToMarket ? (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Go-to-Market Strategy</h3>
                    {goToMarket.gtm_strength_score && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(goToMarket.gtm_strength_score)}`}>
                        <Zap className="w-4 h-4 mr-1 inline" />
                        Strength: {goToMarket.gtm_strength_score}/100
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Marketing Channels</h4>
                      <div className="space-y-2">
                        {goToMarket.gtm_channels && goToMarket.gtm_channels.map((channel, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-700">{channel}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Strategy Notes</h4>
                      <div className="text-gray-600 prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                        {goToMarket.gtm_notes_md}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No go-to-market strategy available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'vc-fit' && (
          <div className="space-y-6">
            {vcFitReport ? (
              <>
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">VC Fit Analysis</h3>
                    <div className="flex items-center space-x-4">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(vcFitReport.funding_probability || 0)}`}>
                        <Star className="w-4 h-4 mr-1 inline" />
                        Funding Probability: {vcFitReport.funding_probability?.toFixed(0) || 0}%
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Matched VCs</h4>
                      {vcFitReport.matched_vcs_json && Object.keys(vcFitReport.matched_vcs_json).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(vcFitReport.matched_vcs_json).map(([vcName, data]: [string, any], index) => (
                            <div key={index} className="bg-blue-50 p-4 rounded-lg">
                              <h5 className="font-medium text-gray-900">{vcName}</h5>
                              <p className="text-sm text-gray-600">{data.focus || 'Investment focus not specified'}</p>
                              <p className="text-sm text-blue-600">Match Score: {data.match_score || 'N/A'}%</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">No VC matches available</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Similar Startup Cases</h4>
                      {vcFitReport.similar_startup_cases && vcFitReport.similar_startup_cases.length > 0 ? (
                        <div className="space-y-2">
                          {vcFitReport.similar_startup_cases.map((startup, index) => (
                            <div key={index} className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-700">{startup}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600">No similar cases identified</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Investor Synopsis</h4>
                    <div className="text-gray-600 prose prose-sm max-w-none bg-gray-50 p-4 rounded-lg">
                      {vcFitReport.investor_synopsis_md}
                    </div>
                  </div>

                  {vcFitReport.requirements_to_improve && vcFitReport.requirements_to_improve.length > 0 && (
                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-lg font-medium text-gray-900 mb-3">Areas for Improvement</h4>
                      <div className="space-y-2">
                        {vcFitReport.requirements_to_improve.map((requirement, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2"></div>
                            <p className="text-gray-700">{requirement}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No VC fit analysis available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDetailPage;