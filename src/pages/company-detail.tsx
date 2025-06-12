import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Building2, MapPin, Calendar, DollarSign, TrendingUp, Users, BarChart3, FileText, Target, Loader2, AlertTriangle, Star, Globe, Zap } from 'lucide-react';
import LiveKPIChart from '../components/LiveKPIChart';
import KPIAnalysis from '../components/KPIAnalysis';

interface Company {
  id: string;
  name: string;
  industry_name: string;
  sub_industry_name: string;
  startup_stage: string;
  country: string;
  geo_region: string;
  valuation_target_usd: number | null;
  funding_goal_usd: number | null;
  incorporation_year: number;
  pitch_deck_summary: string;
  gpt_pitch_score: number;
  created_at: string;
}

interface FinancialModel {
  monthly_revenue_usd: number;
  burn_rate_usd: number;
  ltv_cac_ratio: number;
  runway_months: number;
  revenue_model_notes: string;
  tam_sam_som_json: any;
  model_quality_score: number;
}

interface PitchDeck {
  core_problem: string;
  core_solution: string;
  customer_segment: string;
  product_summary_md: string;
  market_trends_json: any;
  deck_quality_score: number;
}

interface GoToMarket {
  gtm_channels: string[];
  gtm_notes_md: string;
  gtm_strength_score: number;
}

interface VCFitReport {
  matched_vcs_json: any;
  similar_startup_cases: string[];
  requirements_to_improve: string[];
  fit_score_breakdown: any;
  investor_synopsis_md: string;
  funding_probability: number;
}

interface Founder {
  full_name: string;
  linkedin_url: string;
  education_history: string[];
  domain_experience_yrs: number;
  technical_skills: string[];
  notable_achievements: string;
  founder_fit_score: number;
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

      // Fetch financial model data
      const { data: financialData, error: financialError } = await supabase
        .from('financial_models')
        .select('*')
        .eq('company_id', companyId);

      if (financialError) {
        console.warn('Financial model fetch error:', financialError);
      } else {
        setFinancialModel(financialData?.[0] || null);
      }

      // Fetch pitch deck data
      const { data: pitchData, error: pitchError } = await supabase
        .from('pitch_decks')
        .select('*')
        .eq('company_id', companyId);

      if (pitchError) {
        console.warn('Pitch deck fetch error:', pitchError);
      } else {
        setPitchDeck(pitchData?.[0] || null);
      }

      // Fetch go-to-market data
      const { data: gtmData, error: gtmError } = await supabase
        .from('go_to_market')
        .select('*')
        .eq('company_id', companyId);

      if (gtmError) {
        console.warn('GTM fetch error:', gtmError);
      } else {
        setGoToMarket(gtmData?.[0] || null);
      }

      // Fetch VC fit report data
      const { data: vcData, error: vcError } = await supabase
        .from('vc_fit_reports')
        .select('*')
        .eq('company_id', companyId);

      if (vcError) {
        console.warn('VC fit report fetch error:', vcError);
      } else {
        setVcFitReport(vcData?.[0] || null);
      }

      // Fetch founders data
      const { data: foundersData, error: foundersError } = await supabase
        .from('founders')
        .select('*')
        .eq('company_id', companyId);

      if (foundersError) {
        console.warn('Founders fetch error:', foundersError);
      } else {
        setFounders(foundersData || []);
      }

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

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'pre-seed':
        return 'bg-gray-100 text-gray-800';
      case 'seed':
        return 'bg-green-100 text-green-800';
      case 'series a':
        return 'bg-blue-100 text-blue-800';
      case 'series b':
        return 'bg-purple-100 text-purple-800';
      case 'series c':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/companies"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Companies
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 mr-4">{company.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStageColor(company.startup_stage)}`}>
                    {company.startup_stage || 'Unknown Stage'}
                  </span>
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
                  
                  {company.gpt_pitch_score && (
                    <div className="flex items-center text-gray-600">
                      <Star className="w-4 h-4 mr-2" />
                      <span className={`text-sm font-medium ${getScoreColor(company.gpt_pitch_score)}`}>
                        Pitch Score: {company.gpt_pitch_score.toFixed(1)}/10
                      </span>
                    </div>
                  )}
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
                        {formatCurrency(company.valuation_target_usd)}
                      </div>
                      <div className="text-sm text-blue-700">Target Valuation</div>
                    </div>
                  )}
                  
                  {company.funding_goal_usd && (
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(company.funding_goal_usd)}
                      </div>
                      <div className="text-sm text-purple-700">Funding Goal</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
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
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Key Metrics */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Key Metrics</h3>
                <LiveKPIChart companyId={company.id} companyName={company.name} />
              </div>

              {/* Team */}
              {founders.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Founding Team</h3>
                  <div className="space-y-4">
                    {founders.map((founder, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{founder.full_name}</h4>
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
                          <p className="text-sm text-gray-700">{founder.notable_achievements}</p>
                        )}
                        {founder.technical_skills && founder.technical_skills.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {founder.technical_skills.slice(0, 3).map((skill, skillIndex) => (
                              <span key={skillIndex} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'kpi-analysis' && (
            <KPIAnalysis 
              companyId={company.id} 
              companyName={company.name}
              industry={company.industry_name}
              stage={company.startup_stage}
            />
          )}

          {activeTab === 'financial' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Financial Model Analysis</h3>
              {financialModel ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(financialModel.monthly_revenue_usd)}
                    </div>
                    <div className="text-sm text-green-700">Monthly Revenue</div>
                  </div>
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-600">
                      {formatCurrency(financialModel.burn_rate_usd)}
                    </div>
                    <div className="text-sm text-red-700">Monthly Burn Rate</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {financialModel.ltv_cac_ratio.toFixed(1)}:1
                    </div>
                    <div className="text-sm text-blue-700">LTV/CAC Ratio</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {financialModel.runway_months.toFixed(0)} months
                    </div>
                    <div className="text-sm text-purple-700">Runway</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No financial model data available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pitch' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Pitch Deck Analysis</h3>
              {pitchDeck ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Core Problem</h4>
                      <p className="text-gray-700">{pitchDeck.core_problem}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Core Solution</h4>
                      <p className="text-gray-700">{pitchDeck.core_solution}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Target Customer Segment</h4>
                    <p className="text-gray-700">{pitchDeck.customer_segment}</p>
                  </div>
                  {pitchDeck.product_summary_md && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Product Summary</h4>
                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap text-gray-700">{pitchDeck.product_summary_md}</pre>
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
            </div>
          )}

          {activeTab === 'market' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Market Size Analysis</h3>
              {financialModel?.tam_sam_som_json ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {formatCurrency(financialModel.tam_sam_som_json.tam)}
                      </div>
                      <div className="text-sm text-blue-700 font-medium">Total Addressable Market</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {formatCurrency(financialModel.tam_sam_som_json.sam)}
                      </div>
                      <div className="text-sm text-purple-700 font-medium">Serviceable Addressable Market</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-6 text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {formatCurrency(financialModel.tam_sam_som_json.som)}
                      </div>
                      <div className="text-sm text-green-700 font-medium">Serviceable Obtainable Market</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No market size data available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vc-matching' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">VC Matching Analysis</h3>
              {vcFitReport ? (
                <div className="space-y-6">
                  {vcFitReport.matched_vcs_json?.matches && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Matched VCs</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vcFitReport.matched_vcs_json.matches.map((vc: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-gray-900">{vc.name}</h5>
                              <span className="text-sm font-medium text-blue-600">{vc.fit_score}% match</span>
                            </div>
                            <p className="text-sm text-gray-600">{vc.focus}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {vcFitReport.requirements_to_improve && vcFitReport.requirements_to_improve.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Areas for Improvement</h4>
                      <ul className="space-y-2">
                        {vcFitReport.requirements_to_improve.map((requirement, index) => (
                          <li key={index} className="flex items-start">
                            <Target className="w-4 h-4 text-orange-500 mr-2 mt-0.5" />
                            <span className="text-sm text-gray-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No VC matching data available</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;