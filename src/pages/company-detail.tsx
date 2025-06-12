import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { 
  ArrowLeft, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  BarChart3, 
  FileText, 
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  TrendingDown,
  Calendar,
  MapPin,
  Star,
  Zap,
  Brain,
  Globe,
  PieChart,
  Activity,
  Award,
  Rocket,
  Shield,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';

interface CompanyData {
  id: string;
  name: string;
  industry_name: string;
  sub_industry_name: string;
  country: string;
  startup_stage: string;
  valuation_target_usd: number;
  funding_goal_usd: number;
  incorporation_year: number;
  pitch_deck_summary: string;
  gpt_pitch_score: number;
  created_at: string;
  founders: any[];
  financial_model: any;
  pitch_deck: any;
  metrics: any[];
  go_to_market: any;
  vc_fit_report: any;
}

const CompanyDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (id) {
      fetchCompanyData(id);
    }
  }, [id]);

  const fetchCompanyData = async (companyId: string) => {
    try {
      setLoading(true);
      
      // Fetch company data
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .single();

      if (companyError) throw companyError;

      // Fetch related data
      const [foundersRes, financialRes, pitchRes, metricsRes, gtmRes, vcRes] = await Promise.all([
        supabase.from('founders').select('*').eq('company_id', companyId),
        supabase.from('financial_models').select('*').eq('company_id', companyId).single(),
        supabase.from('pitch_decks').select('*').eq('company_id', companyId).single(),
        supabase.from('metrics').select('*').eq('company_id', companyId),
        supabase.from('go_to_market').select('*').eq('company_id', companyId).single(),
        supabase.from('vc_fit_reports').select('*').eq('company_id', companyId).single()
      ]);

      setCompany({
        ...companyData,
        founders: foundersRes.data || [],
        financial_model: financialRes.data,
        pitch_deck: pitchRes.data,
        metrics: metricsRes.data || [],
        go_to_market: gtmRes.data,
        vc_fit_report: vcRes.data
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch company data');
      console.error('Error fetching company data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '$0';
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getIndustryBenchmarks = (industry: string, stage: string) => {
    const benchmarks: Record<string, Record<string, any>> = {
      'SaaS': {
        'Series A': {
          mrr: { median: 100000, p75: 200000, p90: 500000 },
          cac: { median: 500, p75: 800, p90: 1200 },
          ltv_cac: { median: 3.5, p75: 5.0, p90: 8.0 },
          churn: { median: 5.0, p75: 3.0, p90: 2.0 },
          nrr: { median: 110, p75: 120, p90: 130 },
          growth_rate: { median: 10, p75: 15, p90: 20 }
        },
        'Seed': {
          mrr: { median: 25000, p75: 50000, p90: 100000 },
          cac: { median: 300, p75: 500, p90: 800 },
          ltv_cac: { median: 3.0, p75: 4.0, p90: 6.0 },
          churn: { median: 8.0, p75: 5.0, p90: 3.0 },
          growth_rate: { median: 15, p75: 25, p90: 40 }
        }
      },
      'HealthTech': {
        'Series B': {
          mrr: { median: 300000, p75: 600000, p90: 1000000 },
          cac: { median: 200, p75: 400, p90: 600 },
          ltv_cac: { median: 5.0, p75: 7.0, p90: 10.0 },
          patients: { median: 10000, p75: 20000, p90: 50000 },
          satisfaction: { median: 4.2, p75: 4.5, p90: 4.8 }
        }
      },
      'CleanTech': {
        'Seed': {
          revenue: { median: 20000, p75: 40000, p90: 80000 },
          installations: { median: 50, p75: 100, p90: 200 },
          efficiency_improvement: { median: 25, p75: 35, p90: 45 }
        }
      },
      'FinTech': {
        'Pre-seed': {
          users: { median: 5000, p75: 15000, p90: 30000 },
          transaction_volume: { median: 100000, p75: 300000, p90: 600000 },
          success_rate: { median: 97, p75: 98.5, p90: 99.5 }
        }
      },
      'EdTech': {
        'Series A': {
          students: { median: 20000, p75: 50000, p90: 100000 },
          completion_rate: { median: 65, p75: 75, p90: 85 },
          engagement: { median: 3.8, p75: 4.2, p90: 4.6 }
        }
      }
    };

    return benchmarks[industry]?.[stage] || {};
  };

  const getVCInsights = (industry: string, stage: string) => {
    const insights: Record<string, Record<string, any>> = {
      'SaaS': {
        'Series A': {
          funding_examples: [
            { company: 'Slack', stage: 'Series A', metrics: '$1M ARR, 15K daily users', year: 2013, amount: '$17M' },
            { company: 'Zoom', stage: 'Series A', metrics: '$1M ARR, strong enterprise traction', year: 2012, amount: '$6M' },
            { company: 'Notion', stage: 'Series A', metrics: '1M users, viral growth', year: 2019, amount: '$10M' }
          ],
          key_metrics: ['Monthly Recurring Revenue (MRR)', 'Customer Acquisition Cost (CAC)', 'Lifetime Value (LTV)', 'Net Revenue Retention (NRR)', 'Monthly Growth Rate', 'Churn Rate'],
          critical_thresholds: {
            mrr: '$100K+ MRR for Series A',
            ltv_cac: '3:1 minimum ratio',
            growth: '10%+ monthly growth',
            retention: '90%+ gross retention'
          }
        }
      },
      'HealthTech': {
        'Series B': {
          funding_examples: [
            { company: 'Teladoc', stage: 'Series B', metrics: '100K+ consultations, major health system partnerships', year: 2011, amount: '$30M' },
            { company: 'Ro (Roman)', stage: 'Series B', metrics: '500K+ patients, $100M+ revenue run rate', year: 2019, amount: '$85M' },
            { company: 'Headspace', stage: 'Series B', metrics: '2M+ subscribers, strong retention', year: 2017, amount: '$36.7M' }
          ],
          key_metrics: ['Active Patients', 'Patient Satisfaction Score', 'Provider Utilization', 'Clinical Outcomes', 'Regulatory Compliance Score', 'Revenue per Patient'],
          critical_thresholds: {
            patients: '10K+ active patients',
            satisfaction: '4.5+ rating',
            compliance: 'Full HIPAA compliance',
            outcomes: 'Measurable clinical improvements'
          }
        }
      },
      'CleanTech': {
        'Seed': {
          funding_examples: [
            { company: 'Sunrun', stage: 'Seed', metrics: 'Proven technology, pilot installations', year: 2007, amount: '$16M' },
            { company: 'Tesla Energy', stage: 'Early', metrics: 'Battery technology breakthrough', year: 2015, amount: '$1.6B' },
            { company: 'Enphase', stage: 'Seed', metrics: 'Microinverter technology, early customers', year: 2007, amount: '$4M' }
          ],
          key_metrics: ['Technology Efficiency Improvement', 'Cost Reduction vs Alternatives', 'Pilot Installation Success', 'Manufacturing Scalability', 'Regulatory Approvals', 'Customer Acquisition'],
          critical_thresholds: {
            efficiency: '20%+ improvement over existing',
            cost: 'Path to cost parity',
            pilots: 'Successful pilot deployments',
            scalability: 'Clear manufacturing roadmap'
          }
        }
      },
      'FinTech': {
        'Pre-seed': {
          funding_examples: [
            { company: 'Stripe', stage: 'Seed', metrics: '100+ merchants, $1M+ processed', year: 2011, amount: '$2M' },
            { company: 'Square', stage: 'Series A', metrics: '10K+ merchants, mobile payments traction', year: 2009, amount: '$10M' },
            { company: 'Revolut', stage: 'Seed', metrics: '10K+ users, international transfers', year: 2015, amount: '$2M' }
          ],
          key_metrics: ['Active Users', 'Transaction Volume', 'Transaction Success Rate', 'User Acquisition Cost', 'Revenue per User', 'Regulatory Compliance'],
          critical_thresholds: {
            users: '5K+ active users',
            volume: '$100K+ monthly volume',
            success_rate: '98%+ transaction success',
            compliance: 'Financial services compliance'
          }
        }
      },
      'EdTech': {
        'Series A': {
          funding_examples: [
            { company: 'Coursera', stage: 'Series A', metrics: '1M+ learners, university partnerships', year: 2012, amount: '$16M' },
            { company: 'Udemy', stage: 'Series A', metrics: '500K+ students, 2K+ courses', year: 2012, amount: '$12M' },
            { company: 'Duolingo', stage: 'Series A', metrics: '3M+ users, strong engagement', year: 2012, amount: '$15M' }
          ],
          key_metrics: ['Active Students', 'Course Completion Rate', 'Student Engagement Score', 'Revenue per Student', 'Content Quality Score', 'Teacher/Institution Adoption'],
          critical_thresholds: {
            students: '20K+ active students',
            completion: '70%+ completion rate',
            engagement: '4.0+ engagement score',
            adoption: 'Institutional partnerships'
          }
        }
      }
    };

    return insights[industry]?.[stage] || { funding_examples: [], key_metrics: [], critical_thresholds: {} };
  };

  const getVCMatches = (industry: string, stage: string) => {
    const vcDatabase: Record<string, any[]> = {
      'SaaS': [
        {
          name: 'Andreessen Horowitz',
          focus: 'Enterprise SaaS, AI/ML',
          stages: ['Seed', 'Series A', 'Series B'],
          checkSize: '$1M - $50M',
          portfolio: ['Slack', 'Notion', 'Databricks'],
          fit_score: 95,
          why_good_fit: 'Strong enterprise SaaS focus, proven track record with similar companies',
          recent_investments: 'Led Notion Series A ($10M), Databricks Series F ($400M)',
          partner_focus: 'Martin Casado (enterprise), David Ulevitch (SaaS infrastructure)'
        },
        {
          name: 'Sequoia Capital',
          focus: 'B2B Software, Analytics',
          stages: ['Series A', 'Series B', 'Growth'],
          checkSize: '$5M - $100M',
          portfolio: ['Zoom', 'Dropbox', 'ServiceNow'],
          fit_score: 92,
          why_good_fit: 'Deep expertise in B2B analytics, strong network for enterprise sales',
          recent_investments: 'Zoom Series A ($6M), ServiceNow growth rounds',
          partner_focus: 'Pat Grady (enterprise software), Carl Eschenbach (go-to-market)'
        }
      ],
      'HealthTech': [
        {
          name: 'General Catalyst',
          focus: 'Healthcare Technology, Digital Health',
          stages: ['Seed', 'Series A', 'Series B'],
          checkSize: '$2M - $75M',
          portfolio: ['Livongo', 'Mindstrong', 'Komodo Health'],
          fit_score: 96,
          why_good_fit: 'Leading healthcare investor, strong regulatory expertise',
          recent_investments: 'Livongo Series B ($52.5M), Komodo Health Series A ($12M)',
          partner_focus: 'Hemant Taneja (healthcare transformation), Katherine Andersen (digital health)'
        },
        {
          name: 'GV (Google Ventures)',
          focus: 'Digital Health, AI in Healthcare',
          stages: ['Series A', 'Series B'],
          checkSize: '$5M - $50M',
          portfolio: ['Flatiron Health', 'Foundation Medicine', 'Verily'],
          fit_score: 89,
          why_good_fit: 'Strong AI/ML capabilities, healthcare data expertise',
          recent_investments: 'Flatiron Health Series B ($130M), Foundation Medicine growth',
          partner_focus: 'Krishna Yeshwant (digital health), Andy Wheeler (healthcare AI)'
        }
      ],
      'CleanTech': [
        {
          name: 'Breakthrough Energy Ventures',
          focus: 'Climate Solutions, Energy Innovation',
          stages: ['Seed', 'Series A'],
          checkSize: '$1M - $20M',
          portfolio: ['Commonwealth Fusion', 'Form Energy', 'Pivot Bio'],
          fit_score: 94,
          why_good_fit: 'Dedicated climate fund, patient capital for deep tech',
          recent_investments: 'Form Energy Series B ($240M), Commonwealth Fusion Series A ($84M)',
          partner_focus: 'Carmichael Roberts (energy storage), Eric Toone (breakthrough technologies)'
        }
      ],
      'FinTech': [
        {
          name: 'Ribbit Capital',
          focus: 'Financial Services, Payments',
          stages: ['Seed', 'Series A', 'Series B'],
          checkSize: '$500K - $30M',
          portfolio: ['Robinhood', 'Credit Karma', 'Coinbase'],
          fit_score: 88,
          why_good_fit: 'Fintech specialists, strong regulatory network',
          recent_investments: 'Robinhood Series B ($110M), Credit Karma growth rounds',
          partner_focus: 'Micky Malka (consumer fintech), Nick Shalek (infrastructure)'
        }
      ],
      'EdTech': [
        {
          name: 'Reach Capital',
          focus: 'Education Technology, Learning Platforms',
          stages: ['Seed', 'Series A'],
          checkSize: '$1M - $15M',
          portfolio: ['Outschool', 'Newsela', 'ClassDojo'],
          fit_score: 91,
          why_good_fit: 'Education-focused fund, strong K-12 and higher ed network',
          recent_investments: 'Outschool Series A ($8.2M), Newsela Series B ($15M)',
          partner_focus: 'Jennifer Carolan (K-12 innovation), Shauntel Garvey (workforce development)'
        }
      ]
    };

    return vcDatabase[industry]?.filter(vc => vc.stages.includes(stage)) || [];
  };

  const calculateBottomUpMarket = (company: CompanyData) => {
    const industry = company.industry_name;
    const financial = company.financial_model;
    
    // Industry-specific bottom-up calculations
    const marketData: Record<string, any> = {
      'SaaS': {
        segment: 'Mid-market enterprises (500-5000 employees)',
        avg_price: financial?.monthly_revenue_usd ? Math.round(financial.monthly_revenue_usd / 50) : 2500,
        total_units: 45000,
        penetration: 8,
        current_plan_capacity: 500,
        three_year_target: 2500
      },
      'HealthTech': {
        segment: 'Healthcare systems & specialty clinics',
        avg_price: financial?.monthly_revenue_usd ? Math.round(financial.monthly_revenue_usd / 100) : 4500,
        total_units: 12000,
        penetration: 12,
        current_plan_capacity: 200,
        three_year_target: 800
      },
      'CleanTech': {
        segment: 'Commercial & residential solar installations',
        avg_price: 15000,
        total_units: 25000,
        penetration: 5,
        current_plan_capacity: 100,
        three_year_target: 1000
      },
      'FinTech': {
        segment: 'Unbanked individuals in emerging markets',
        avg_price: 12,
        total_units: 2500000,
        penetration: 3,
        current_plan_capacity: 50000,
        three_year_target: 500000
      },
      'EdTech': {
        segment: 'K-12 schools & higher education institutions',
        avg_price: 2100,
        total_units: 35000,
        penetration: 15,
        current_plan_capacity: 300,
        three_year_target: 1500
      }
    };

    const data = marketData[industry] || marketData['SaaS'];
    const bottomUpTAM = data.total_units * data.avg_price * 12; // Annual
    const sam = bottomUpTAM * (data.penetration / 100);
    const currentCapacitySOM = data.current_plan_capacity * data.avg_price * 12;
    const threeYearSOM = data.three_year_target * data.avg_price * 12;

    return {
      ...data,
      bottomUpTAM,
      sam,
      currentCapacitySOM,
      threeYearSOM
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company analysis...</p>
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
          <p className="text-red-600">{error}</p>
          <Link to="/companies" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  const benchmarks = getIndustryBenchmarks(company.industry_name, company.startup_stage);
  const vcInsights = getVCInsights(company.industry_name, company.startup_stage);
  const vcMatches = getVCMatches(company.industry_name, company.startup_stage);
  const marketData = calculateBottomUpMarket(company);

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: Eye },
    { id: 'kpis', label: 'KPI Analysis', icon: BarChart3 },
    { id: 'financial', label: 'Financial Deep Dive', icon: DollarSign },
    { id: 'market', label: 'Market Sizing', icon: Globe },
    { id: 'pitch', label: 'Pitch Analysis', icon: FileText },
    { id: 'vcs', label: 'VC Intelligence', icon: Users }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Executive Summary */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Brain className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Executive Summary</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Overview</h3>
                <p className="text-gray-700 leading-relaxed">
                  {company.pitch_deck?.core_problem && company.pitch_deck?.core_solution ? (
                    `${company.name} addresses ${company.pitch_deck.core_problem.toLowerCase()} by ${company.pitch_deck.core_solution.toLowerCase()}`
                  ) : (
                    company.pitch_deck_summary || `${company.name} is a ${company.startup_stage} ${company.industry_name} company focused on innovative solutions in the ${company.sub_industry_name || company.industry_name} space.`
                  )}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Strengths</h3>
                <div className="space-y-2">
                  {company.founders.length > 0 && (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Strong founding team with {company.founders.reduce((sum, f) => sum + (f.domain_experience_yrs || 0), 0)} years combined experience</span>
                    </div>
                  )}
                  {company.financial_model?.ltv_cac_ratio && company.financial_model.ltv_cac_ratio > 3 && (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Healthy unit economics with {company.financial_model.ltv_cac_ratio.toFixed(1)}:1 LTV/CAC ratio</span>
                    </div>
                  )}
                  {company.financial_model?.monthly_revenue_usd && company.financial_model.monthly_revenue_usd > 0 && (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span>Revenue traction with {formatCurrency(company.financial_model.monthly_revenue_usd)} MRR</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Action Items for Funding Success</h3>
                <div className="space-y-2">
                  {company.financial_model?.runway_months && company.financial_model.runway_months < 12 && (
                    <div className="flex items-center text-amber-700">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span>Extend runway beyond 12 months (currently {company.financial_model.runway_months} months)</span>
                    </div>
                  )}
                  {(!company.financial_model?.ltv_cac_ratio || company.financial_model.ltv_cac_ratio < 3) && (
                    <div className="flex items-center text-amber-700">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span>Improve unit economics to achieve 3:1+ LTV/CAC ratio</span>
                    </div>
                  )}
                  <div className="flex items-center text-blue-700">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    <span>Strengthen {vcInsights.key_metrics?.[0] || 'key metrics'} to meet Series A benchmarks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Readiness</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Team Strength</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Market Opportunity</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Traction</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                    <span className="text-sm font-medium">72%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Financials</span>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                    <span className="text-sm font-medium">68%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(company.financial_model?.monthly_revenue_usd)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">LTV/CAC Ratio</p>
              <p className="text-2xl font-bold text-gray-900">
                {company.financial_model?.ltv_cac_ratio?.toFixed(1) || 'N/A'}:1
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Runway</p>
              <p className="text-2xl font-bold text-gray-900">
                {company.financial_model?.runway_months || 'N/A'} mo
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Target className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Funding Goal</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(company.funding_goal_usd)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderKPIs = () => (
    <div className="space-y-8">
      {/* Industry Benchmarking */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">KPI Analysis & Industry Benchmarks</h2>
        </div>

        {/* Key Metrics for VCs */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Metrics for {company.startup_stage} {company.industry_name} Companies</h3>
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vcInsights.key_metrics.map((metric, index) => (
                <div key={index} className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm text-blue-800">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funding Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">When Similar Companies Got Funded</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {vcInsights.funding_examples.map((example, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Award className="w-4 h-4 text-yellow-600 mr-2" />
                  <span className="font-semibold text-gray-900">{example.company}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">{example.stage} • {example.year}</p>
                <p className="text-sm text-gray-700 mb-2">{example.metrics}</p>
                <p className="text-sm font-semibold text-green-600">{example.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current Performance vs Benchmarks */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Metric</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Your Value</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Industry Median</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Top 25%</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Performance</th>
              </tr>
            </thead>
            <tbody>
              {company.metrics.map((metric, index) => {
                const benchmarkKey = metric.metric_name.toLowerCase().replace(/[^a-z]/g, '_');
                const benchmark = benchmarks[benchmarkKey];
                const value = metric.metric_value;
                
                let performance = 'average';
                let icon = <Minus className="w-4 h-4 text-gray-500" />;
                
                if (benchmark) {
                  if (value >= benchmark.p75) {
                    performance = 'excellent';
                    icon = <ArrowUp className="w-4 h-4 text-green-500" />;
                  } else if (value >= benchmark.median) {
                    performance = 'good';
                    icon = <ArrowUp className="w-4 h-4 text-blue-500" />;
                  } else {
                    performance = 'below';
                    icon = <ArrowDown className="w-4 h-4 text-red-500" />;
                  }
                }

                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 text-gray-900">{metric.metric_name}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {metric.metric_unit === 'USD' ? formatCurrency(value) : 
                       metric.metric_unit === '%' ? `${value.toFixed(1)}%` :
                       value.toLocaleString()}{metric.metric_unit && !['USD', '%'].includes(metric.metric_unit) ? ` ${metric.metric_unit}` : ''}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {benchmark ? (
                        benchmark.median.toLocaleString()
                      ) : 'N/A'}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {benchmark ? (
                        benchmark.p75.toLocaleString()
                      ) : 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        {icon}
                        <span className={`ml-2 text-sm font-medium ${
                          performance === 'excellent' ? 'text-green-600' :
                          performance === 'good' ? 'text-blue-600' :
                          performance === 'below' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {performance === 'excellent' ? 'Top 25%' :
                           performance === 'good' ? 'Above Median' :
                           performance === 'below' ? 'Below Median' : 'No Data'}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Critical Thresholds */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Critical Thresholds for Next Funding Round</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(vcInsights.critical_thresholds).map(([key, threshold], index) => (
              <div key={index} className="flex items-center">
                <Target className="w-4 h-4 text-yellow-600 mr-2" />
                <span className="text-sm text-gray-700">{threshold}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancial = () => (
    <div className="space-y-8">
      {/* Unit Economics Deep Dive */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <DollarSign className="w-6 h-6 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Financial Model Deep Dive</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Unit Economics */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Economics Analysis</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Customer Lifetime Value (LTV)</span>
                  <span className="font-semibold text-gray-900">
                    {company.financial_model?.ltv_cac_ratio && company.financial_model?.monthly_revenue_usd ? 
                      formatCurrency((company.financial_model.monthly_revenue_usd / 50) * company.financial_model.ltv_cac_ratio) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Customer Acquisition Cost (CAC)</span>
                  <span className="font-semibold text-gray-900">
                    {company.financial_model?.ltv_cac_ratio && company.financial_model?.monthly_revenue_usd ? 
                      formatCurrency((company.financial_model.monthly_revenue_usd / 50)) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">LTV/CAC Ratio</span>
                  <span className={`font-semibold ${
                    company.financial_model?.ltv_cac_ratio && company.financial_model.ltv_cac_ratio >= 3 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {company.financial_model?.ltv_cac_ratio?.toFixed(1) || 'N/A'}:1
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Unit Economics Health Check</h4>
                <div className="space-y-2">
                  {company.financial_model?.ltv_cac_ratio && company.financial_model.ltv_cac_ratio >= 3 ? (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Healthy LTV/CAC ratio (3:1+ target)</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-700">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="text-sm">LTV/CAC ratio needs improvement (target: 3:1+)</span>
                    </div>
                  )}
                  
                  {company.financial_model?.runway_months && company.financial_model.runway_months >= 18 ? (
                    <div className="flex items-center text-green-700">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Sufficient runway for next milestone</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-amber-700">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      <span className="text-sm">Consider extending runway (18+ months recommended)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Cash Flow Analysis */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash Flow Analysis</h3>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Monthly Revenue</span>
                  <span className="font-semibold text-green-600">
                    +{formatCurrency(company.financial_model?.monthly_revenue_usd)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Monthly Burn Rate</span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(company.financial_model?.burn_rate_usd)}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 pt-2">
                  <span className="text-gray-600">Net Cash Flow</span>
                  <span className={`font-semibold ${
                    (company.financial_model?.monthly_revenue_usd || 0) - (company.financial_model?.burn_rate_usd || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency((company.financial_model?.monthly_revenue_usd || 0) - (company.financial_model?.burn_rate_usd || 0))}
                  </span>
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Break-Even Analysis</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Time to Break-Even</span>
                    <span className="font-semibold text-purple-900">
                      {company.financial_model?.monthly_revenue_usd && company.financial_model?.burn_rate_usd ? 
                        `${Math.ceil((company.financial_model.burn_rate_usd - company.financial_model.monthly_revenue_usd) / (company.financial_model.monthly_revenue_usd * 0.15))} months` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Revenue Needed</span>
                    <span className="font-semibold text-purple-900">
                      {formatCurrency(company.financial_model?.burn_rate_usd)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Model Analysis */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Model Quality Assessment</h3>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Rocket className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Scalability</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-gray-600">Strong potential for scale</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Predictability</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
                <p className="text-sm text-gray-600">Recurring revenue model</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Growth Potential</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                </div>
                <p className="text-sm text-gray-600">Expanding market opportunity</p>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Insights */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Financial Insights & Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <Lightbulb className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Revenue Growth Strategy</p>
                <p className="text-sm text-gray-700">
                  {company.financial_model?.revenue_model_notes || 
                   `Focus on expanding ${company.industry_name} market penetration through strategic partnerships and product enhancement.`}
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Target className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Optimization Opportunities</p>
                <p className="text-sm text-gray-700">
                  Improve customer acquisition efficiency by focusing on highest-converting channels and reducing CAC by 20-30%.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="w-5 h-5 text-purple-600 mr-3 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Funding Timeline</p>
                <p className="text-sm text-gray-700">
                  With current burn rate, initiate fundraising process in {Math.max(1, (company.financial_model?.runway_months || 12) - 6)} months to maintain 6+ month buffer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketSizing = () => (
    <div className="space-y-8">
      {/* Bottom-Up Market Sizing */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Globe className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Market Opportunity Analysis</h2>
        </div>

        {/* Bottom-Up Approach */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">📊 Market Opportunity Snapshot (Bottom-Up Approach)</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b">Metric</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 border-b">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Target Customer Segment</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{marketData.segment}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Avg. Price per Customer</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{formatCurrency(marketData.avg_price)}/mo</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Total Addressable Units</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{marketData.total_units.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Total Bottom-Up TAM</td>
                  <td className="py-3 px-4 font-semibold text-blue-600">{formatCurrency(marketData.bottomUpTAM)}/year</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Adoption Assumption</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{marketData.penetration}%</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Serviceable Market (SAM)</td>
                  <td className="py-3 px-4 font-semibold text-purple-600">{formatCurrency(marketData.sam)} (TAM × adoption %)</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-700">Current Capacity SOM</td>
                  <td className="py-3 px-4 font-semibold text-green-600">{formatCurrency(marketData.currentCapacitySOM)} (Current plan)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-700">3-Year Target SOM</td>
                  <td className="py-3 px-4 font-semibold text-orange-600">{formatCurrency(marketData.threeYearSOM)} (3-year revenue plan)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Market Penetration Strategy */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Penetration Strategy</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Target className="w-6 h-6 text-blue-600 mr-2" />
                <h4 className="font-semibold text-blue-900">Year 1 Target</h4>
              </div>
              <p className="text-2xl font-bold text-blue-600 mb-2">
                {((marketData.current_plan_capacity / 3) * marketData.avg_price * 12 / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-blue-700">
                {Math.round(marketData.current_plan_capacity / 3)} customers
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <TrendingUp className="w-6 h-6 text-purple-600 mr-2" />
                <h4 className="font-semibold text-purple-900">Year 2 Target</h4>
              </div>
              <p className="text-2xl font-bold text-purple-600 mb-2">
                {((marketData.current_plan_capacity * 0.7) * marketData.avg_price * 12 / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-purple-700">
                {Math.round(marketData.current_plan_capacity * 0.7)} customers
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Rocket className="w-6 h-6 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-900">Year 3 Target</h4>
              </div>
              <p className="text-2xl font-bold text-green-600 mb-2">
                {(marketData.threeYearSOM / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-green-700">
                {marketData.three_year_target.toLocaleString()} customers
              </p>
            </div>
          </div>
        </div>

        {/* Top-Down Market Analysis */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top-Down Market Validation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Industry Market Size</h4>
              <p className="text-sm text-gray-700 mb-4">
                The global {company.industry_name.toLowerCase()} market is valued at approximately{' '}
                {company.industry_name === 'SaaS' ? '$195B' :
                 company.industry_name === 'HealthTech' ? '$75B' :
                 company.industry_name === 'CleanTech' ? '$150B' :
                 company.industry_name === 'FinTech' ? '$200B' :
                 company.industry_name === 'EdTech' ? '$40B' : '$100B'} and growing at{' '}
                {company.industry_name === 'SaaS' ? '18%' :
                 company.industry_name === 'HealthTech' ? '25%' :
                 company.industry_name === 'CleanTech' ? '22%' :
                 company.industry_name === 'FinTech' ? '15%' :
                 company.industry_name === 'EdTech' ? '16%' : '20%'} CAGR.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Addressable Market</span>
                  <span className="font-semibold">
                    {company.industry_name === 'SaaS' ? '$195B' :
                     company.industry_name === 'HealthTech' ? '$75B' :
                     company.industry_name === 'CleanTech' ? '$150B' :
                     company.industry_name === 'FinTech' ? '$200B' :
                     company.industry_name === 'EdTech' ? '$40B' : '$100B'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Serviceable Addressable Market</span>
                  <span className="font-semibold">{formatCurrency(marketData.sam)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Market Share Target (3-year)</span>
                  <span className="font-semibold">
                    {((marketData.threeYearSOM / marketData.sam) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Market Dynamics</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <ArrowUp className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Growth Drivers</p>
                    <p className="text-xs text-gray-600">
                      {company.industry_name === 'SaaS' ? 'Digital transformation, remote work adoption' :
                       company.industry_name === 'HealthTech' ? 'Aging population, healthcare digitization' :
                       company.industry_name === 'CleanTech' ? 'Climate regulations, energy costs' :
                       company.industry_name === 'FinTech' ? 'Financial inclusion, mobile adoption' :
                       company.industry_name === 'EdTech' ? 'Online learning, skill development' : 'Technology adoption'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Activity className="w-4 h-4 text-blue-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Market Maturity</p>
                    <p className="text-xs text-gray-600">
                      {company.startup_stage === 'Pre-seed' || company.startup_stage === 'Seed' ? 'Early adoption phase' :
                       'Growing market with established players'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Globe className="w-4 h-4 text-purple-500 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Geographic Expansion</p>
                    <p className="text-xs text-gray-600">
                      Strong potential for international expansion in {company.geo_region || 'target regions'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPitchAnalysis = () => (
    <div className="space-y-8">
      {/* Pitch Deck Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Pitch Deck Deep Analysis</h2>
        </div>

        {/* Problem-Solution Fit */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem-Solution Analysis</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                <h4 className="font-semibold text-red-900">Problem Statement</h4>
              </div>
              <p className="text-gray-700 mb-4">
                {company.pitch_deck?.core_problem || 'Problem statement needs to be more clearly defined in pitch materials.'}
              </p>
              <div className="flex items-center">
                <div className="w-full bg-red-200 rounded-full h-2 mr-3">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: company.pitch_deck?.core_problem ? '85%' : '40%' }}></div>
                </div>
                <span className="text-sm font-medium text-red-700">
                  {company.pitch_deck?.core_problem ? 'Strong' : 'Needs Work'}
                </span>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <h4 className="font-semibold text-green-900">Solution Approach</h4>
              </div>
              <p className="text-gray-700 mb-4">
                {company.pitch_deck?.core_solution || 'Solution description should be enhanced with more specific details and differentiation.'}
              </p>
              <div className="flex items-center">
                <div className="w-full bg-green-200 rounded-full h-2 mr-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: company.pitch_deck?.core_solution ? '78%' : '35%' }}></div>
                </div>
                <span className="text-sm font-medium text-green-700">
                  {company.pitch_deck?.core_solution ? 'Good' : 'Needs Work'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Market Timing & Trends */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Market Timing & Trends Analysis</h3>
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Market Timing</h4>
                <p className="text-sm text-gray-700">
                  {company.industry_name === 'SaaS' ? 'Perfect timing with digital transformation acceleration' :
                   company.industry_name === 'HealthTech' ? 'Ideal timing post-pandemic healthcare digitization' :
                   company.industry_name === 'CleanTech' ? 'Excellent timing with climate focus and regulations' :
                   company.industry_name === 'FinTech' ? 'Strong timing with financial inclusion initiatives' :
                   company.industry_name === 'EdTech' ? 'Good timing with online learning adoption' : 'Market timing appears favorable'}
                </p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Excellent</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Industry Trends</h4>
                <p className="text-sm text-gray-700">
                  Strong tailwinds from industry growth and technological advancement supporting the business model.
                </p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Favorable</span>
                </div>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Competitive Landscape</h4>
                <p className="text-sm text-gray-700">
                  Differentiated positioning with clear competitive advantages and barriers to entry.
                </p>
                <div className="mt-2">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Competitive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Segment Analysis */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Segment Insights</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Target Customer Profile</h4>
                <p className="text-gray-700 mb-4">
                  {company.pitch_deck?.customer_segment || 
                   `Primary focus on ${marketData.segment.toLowerCase()} with specific pain points around ${company.industry_name.toLowerCase()} solutions.`}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="text-sm text-gray-700">Market Size: {marketData.total_units.toLocaleString()} potential customers</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-gray-700">ARPU: {formatCurrency(marketData.avg_price)}/month</span>
                  </div>
                  <div className="flex items-center">
                    <Target className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm text-gray-700">Addressable: {marketData.penetration}% adoption potential</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Customer Acquisition Strategy</h4>
                <div className="space-y-3">
                  {company.go_to_market?.gtm_channels?.map((channel, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-700">{channel}</span>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-600 italic">Go-to-market channels need to be defined</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Summary */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Product & Technology Assessment</h3>
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
            <div className="prose max-w-none">
              {company.pitch_deck?.product_summary_md ? (
                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: company.pitch_deck.product_summary_md.replace(/\n/g, '<br>') }} />
              ) : (
                <p className="text-gray-700">
                  {company.name} leverages cutting-edge technology in the {company.industry_name} space to deliver innovative solutions. 
                  The product architecture is designed for scalability and addresses key market needs with a differentiated approach.
                </p>
              )}
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">8.5/10</div>
                <div className="text-sm text-gray-600">Technical Innovation</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">7.8/10</div>
                <div className="text-sm text-gray-600">Market Fit</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">8.2/10</div>
                <div className="text-sm text-gray-600">Scalability</div>
              </div>
            </div>
          </div>
        </div>

        {/* AI-Powered Recommendations */}
        <div className="bg-yellow-50 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <Brain className="w-5 h-5 text-yellow-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">AI-Powered Pitch Recommendations</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                <ThumbsUp className="w-4 h-4 mr-2" />
                Strengths to Emphasize
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Strong founding team with relevant experience</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Large addressable market with clear growth trajectory</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Differentiated technology approach</span>
                </li>
                {company.financial_model?.ltv_cac_ratio && company.financial_model.ltv_cac_ratio > 3 && (
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">Proven unit economics and business model</span>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-red-900 mb-3 flex items-center">
                <ThumbsDown className="w-4 h-4 mr-2" />
                Areas to Strengthen
              </h4>
              <ul className="space-y-2">
                {(!company.pitch_deck?.core_problem || company.pitch_deck.core_problem.length < 50) && (
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">Strengthen problem statement with specific pain points</span>
                  </li>
                )}
                {(!company.financial_model?.ltv_cac_ratio || company.financial_model.ltv_cac_ratio < 3) && (
                  <li className="flex items-start">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                    <span className="text-sm text-gray-700">Improve unit economics demonstration</span>
                  </li>
                )}
                <li className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Add more competitive differentiation details</span>
                </li>
                <li className="flex items-start">
                  <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Include customer testimonials and case studies</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderVCIntelligence = () => (
    <div className="space-y-8">
      {/* VC Matching Intelligence */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Users className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">VC Intelligence & Matching</h2>
        </div>

        {/* Top VC Matches */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Strategic VC Matches for {company.industry_name} {company.startup_stage}</h3>
          
          <div className="space-y-6">
            {vcMatches.map((vc, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="text-xl font-semibold text-gray-900 mr-3">{vc.name}</h4>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium text-gray-700">{vc.fit_score}% match</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-3">{vc.focus}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Check Size</span>
                        <p className="text-sm text-gray-900">{vc.checkSize}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Stages</span>
                        <p className="text-sm text-gray-900">{vc.stages.join(', ')}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Portfolio</span>
                        <p className="text-sm text-gray-900">{vc.portfolio.slice(0, 2).join(', ')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      vc.fit_score >= 90 ? 'bg-green-100' :
                      vc.fit_score >= 80 ? 'bg-blue-100' : 'bg-yellow-100'
                    }`}>
                      <span className={`text-2xl font-bold ${
                        vc.fit_score >= 90 ? 'text-green-600' :
                        vc.fit_score >= 80 ? 'text-blue-600' : 'text-yellow-600'
                      }`}>
                        {vc.fit_score}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Why This is a Great Fit</h5>
                  <p className="text-sm text-gray-700">{vc.why_good_fit}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Recent Investments</h5>
                    <p className="text-sm text-gray-700">{vc.recent_investments}</p>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Key Partners</h5>
                    <p className="text-sm text-gray-700">{vc.partner_focus}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      vc.fit_score >= 90 ? 'bg-green-100 text-green-800' :
                      vc.fit_score >= 80 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vc.fit_score >= 90 ? 'Excellent Match' :
                       vc.fit_score >= 80 ? 'Strong Match' : 'Good Match'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {vc.stages.includes(company.startup_stage) ? '✓ Stage Match' : '⚠ Stage Mismatch'}
                    </span>
                  </div>
                  
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    View Full Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Readiness Assessment */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Readiness Assessment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Team Strength</h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-sm text-gray-600">Strong founding team</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Traction</h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '72%' }}></div>
              </div>
              <p className="text-sm text-gray-600">Good early traction</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <Globe className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Market Size</h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
              </div>
              <p className="text-sm text-gray-600">Large addressable market</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Financials</h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <p className="text-sm text-gray-600">Improving unit economics</p>
            </div>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="mt-8 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Strategic Fundraising Recommendations</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Immediate Actions (Next 30 Days)</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Rocket className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Prepare detailed financial projections and unit economics</span>
                </li>
                <li className="flex items-start">
                  <FileText className="w-4 h-4 text-purple-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Strengthen pitch deck with customer testimonials</span>
                </li>
                <li className="flex items-start">
                  <Users className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Research and warm introductions to target VCs</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Medium-term Goals (3-6 Months)</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Target className="w-4 h-4 text-orange-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Achieve key milestone metrics for {company.startup_stage}</span>
                </li>
                <li className="flex items-start">
                  <TrendingUp className="w-4 h-4 text-blue-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Demonstrate consistent growth and market traction</span>
                </li>
                <li className="flex items-start">
                  <Shield className="w-4 h-4 text-purple-600 mr-2 mt-0.5" />
                  <span className="text-sm text-gray-700">Build strategic partnerships and competitive moats</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Building2 className="w-8 h-8 mr-3 text-blue-600" />
                {company.name}
              </h1>
              <div className="flex items-center space-x-4 mt-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {company.startup_stage}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                  {company.industry_name}
                </span>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{company.country}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="text-sm">Founded {company.incorporation_year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
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
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'kpis' && renderKPIs()}
          {activeTab === 'financial' && renderFinancial()}
          {activeTab === 'market' && renderMarketSizing()}
          {activeTab === 'pitch' && renderPitchAnalysis()}
          {activeTab === 'vcs' && renderVCIntelligence()}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;