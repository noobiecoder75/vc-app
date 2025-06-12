import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import GlowingCard from '../components/advanced/GlowingCard';
import AnimatedCounter from '../components/advanced/AnimatedCounter';
import ParticleBackground from '../components/advanced/ParticleBackground';
import MorphingButton from '../components/advanced/MorphingButton';
import InsightTooltip from '../components/InsightTooltip';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Building2, Users, DollarSign, TrendingUp, MapPin, Calendar, ArrowRight, Loader2, Upload, Search, Filter, Star, Award, Zap, Target, BarChart3, Activity } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  industry_name: string;
  startup_stage: string;
  country: string;
  valuation_target_usd: number | null;
  funding_goal_usd: number | null;
  incorporation_year: number;
  pitch_deck_summary: string;
  gpt_pitch_score: number | null;
  created_at: string;
}

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');

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
    fetchCompanies();
  }, []);

  useEffect(() => {
    filterCompanies();
  }, [companies, searchTerm, selectedIndustry, selectedStage]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching companies from database...');
      
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      console.log(`✅ Successfully loaded ${data?.length || 0} companies`);
      setCompanies(data || []);
    } catch (err) {
      console.error('💥 Error fetching companies:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const filterCompanies = () => {
    let filtered = companies;

    if (searchTerm) {
      filtered = filtered.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.pitch_deck_summary?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(company => company.industry_name === selectedIndustry);
    }

    if (selectedStage !== 'all') {
      filtered = filtered.filter(company => company.startup_stage === selectedStage);
    }

    setFilteredCompanies(filtered);
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
    return 'text-red-500';
  };

  const handleCompanyClick = (companyId: string, companyName: string) => {
    console.log(`🔗 User clicked on company: ${companyName} (ID: ${companyId})`);
    console.log(`📍 Navigating to: /company/${companyId}`);
    
    // Add a small delay to ensure the click is registered
    setTimeout(() => {
      window.location.href = `/company/${companyId}`;
    }, 100);
  };

  const industries = [...new Set(companies.map(c => c.industry_name).filter(Boolean))];
  const stages = [...new Set(companies.map(c => c.startup_stage).filter(Boolean))];

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
          <p className="text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        <ParticleBackground particleCount={20} color="#EF4444" speed={0.2} />
        <div className="text-center relative z-10">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Companies</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <MorphingButton
            onClick={fetchCompanies}
            successText="Refreshed!"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Try Again
          </MorphingButton>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center relative overflow-hidden">
        <ParticleBackground particleCount={20} color="#10B981" speed={0.2} />
        <div className="text-center relative z-10">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Companies Found</h2>
          <p className="text-gray-600 mb-4">Upload some startup ideas to see them here.</p>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Idea
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
            <GlowingCard glowColor="blue" intensity="medium">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                  <div className="mb-6 lg:mb-0">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center mb-2">
                      <Building2 className="w-8 h-8 mr-3 text-blue-600" />
                      Startup Portfolio
                      <Badge variant="success" className="ml-3">
                        <Star className="w-3 h-3 mr-1" />
                        <AnimatedCounter value={companies.length} duration={1.5} />
                      </Badge>
                    </h1>
                    <p className="text-gray-600">
                      Browse and analyze startup companies with comprehensive KPI data and insights
                    </p>
                  </div>
                  
                  <InsightTooltip
                    title="Add New Company"
                    description="Upload your startup idea for instant analysis"
                    insight="Join 500+ startups that have used our platform"
                    actionable="Get started with a free validation report"
                  >
                    <MorphingButton
                      variant="gradient"
                      className="hover-glow"
                      successText="Let's Go!"
                      onClick={async () => {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        window.location.href = '/upload';
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add New Company
                    </MorphingButton>
                  </InsightTooltip>
                </div>
              </div>
            </GlowingCard>
          </motion.div>
        </motion.div>

        {/* Enhanced Filters */}
        <motion.div 
          className="mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="purple" intensity="low">
              <div className="bg-white rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search companies, industries, or descriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industries.map(industry => (
                        <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedStage} onValueChange={setSelectedStage}>
                    <SelectTrigger className="w-full md:w-48">
                      <Target className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stages</SelectItem>
                      {stages.map(stage => (
                        <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </GlowingCard>
          </motion.div>
        </motion.div>

        {/* Enhanced Companies Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <AnimatePresence>
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layout
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <InsightTooltip
                  title={company.name}
                  description={`${company.industry_name} • ${company.startup_stage}`}
                  insight={company.pitch_deck_summary || "Innovative startup with strong potential"}
                  benchmark={company.gpt_pitch_score ? {
                    value: company.gpt_pitch_score,
                    label: `${company.gpt_pitch_score.toFixed(1)}/10 Pitch Score`,
                    status: company.gpt_pitch_score >= 8 ? 'excellent' : company.gpt_pitch_score >= 6 ? 'good' : 'average'
                  } : undefined}
                  actionable="Click to view detailed KPI dashboard"
                >
                  <GlowingCard 
                    glowColor={index % 4 === 0 ? 'blue' : index % 4 === 1 ? 'emerald' : index % 4 === 2 ? 'purple' : 'orange'}
                    intensity="low"
                    className="cursor-help group h-full"
                  >
                    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100 h-full flex flex-col">
                      {/* Company Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                            {company.name}
                          </h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStageColor(company.startup_stage)}`}>
                              {company.startup_stage || 'Unknown Stage'}
                            </span>
                            {company.industry_name && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                {company.industry_name}
                              </span>
                            )}
                          </div>
                        </div>
                        {company.gpt_pitch_score && (
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getScoreColor(company.gpt_pitch_score)}`}>
                              <AnimatedCounter value={company.gpt_pitch_score} decimals={1} duration={1.5} />
                            </div>
                            <div className="text-xs text-gray-500">Pitch Score</div>
                          </div>
                        )}
                      </div>

                      {/* Company Details */}
                      <div className="space-y-3 mb-6 flex-grow">
                        {company.country && (
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2" />
                            {company.country}
                          </div>
                        )}
                        
                        {company.incorporation_year && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            Founded {company.incorporation_year}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-3">
                          {company.valuation_target_usd && (
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-blue-600">
                                {formatCurrency(company.valuation_target_usd)}
                              </div>
                              <div className="text-xs text-blue-700">Target</div>
                            </div>
                          )}

                          {company.funding_goal_usd && (
                            <div className="bg-purple-50 rounded-lg p-3 text-center">
                              <div className="text-lg font-bold text-purple-600">
                                {formatCurrency(company.funding_goal_usd)}
                              </div>
                              <div className="text-xs text-purple-700">Seeking</div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pitch Summary */}
                      {company.pitch_deck_summary && (
                        <div className="mb-6">
                          <p className="text-gray-600 text-sm line-clamp-3">
                            {company.pitch_deck_summary}
                          </p>
                        </div>
                      )}

                      {/* Enhanced View Details Button */}
                      <div className="mt-auto">
                        <button
                          onClick={() => handleCompanyClick(company.id, company.name)}
                          className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-all duration-200 font-medium group border border-blue-200 hover:border-blue-300 hover:shadow-md"
                        >
                          <Activity className="w-4 h-4 mr-2" />
                          View KPI Dashboard
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </GlowingCard>
                </InsightTooltip>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Summary Stats */}
        <motion.div 
          className="mt-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <GlowingCard glowColor="emerald" intensity="medium">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <Award className="w-6 h-6 text-emerald-600 mr-2" />
                  Portfolio Overview
                  <Badge variant="info" className="ml-2">
                    <Zap className="w-3 h-3 mr-1" />
                    Live Data
                  </Badge>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <InsightTooltip
                    title="Total Companies"
                    description="Number of startups in our portfolio"
                    insight="Growing portfolio of innovative startups"
                  >
                    <div className="text-center p-4 bg-blue-50 rounded-lg cursor-help hover:bg-blue-100 transition-colors">
                      <div className="text-2xl font-bold text-blue-600">
                        <AnimatedCounter value={companies.length} duration={2} />
                      </div>
                      <div className="text-sm text-blue-700">Total Companies</div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Total Target Valuation"
                    description="Combined valuation targets of all companies"
                    insight="Represents the collective ambition of our portfolio"
                  >
                    <div className="text-center p-4 bg-emerald-50 rounded-lg cursor-help hover:bg-emerald-100 transition-colors">
                      <div className="text-2xl font-bold text-emerald-600">
                        {formatCurrency(companies.reduce((sum, c) => sum + (c.valuation_target_usd ?? 0), 0))}
                      </div>
                      <div className="text-sm text-emerald-700">Total Target Valuation</div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Total Funding Sought"
                    description="Combined funding goals across all companies"
                    insight="Active fundraising opportunities in our portfolio"
                  >
                    <div className="text-center p-4 bg-purple-50 rounded-lg cursor-help hover:bg-purple-100 transition-colors">
                      <div className="text-2xl font-bold text-purple-600">
                        {formatCurrency(companies.reduce((sum, c) => sum + (c.funding_goal_usd ?? 0), 0))}
                      </div>
                      <div className="text-sm text-purple-700">Total Funding Sought</div>
                    </div>
                  </InsightTooltip>
                  
                  <InsightTooltip
                    title="Industries Covered"
                    description="Number of different industries represented"
                    insight="Diversified portfolio across multiple sectors"
                  >
                    <div className="text-center p-4 bg-orange-50 rounded-lg cursor-help hover:bg-orange-100 transition-colors">
                      <div className="text-2xl font-bold text-orange-600">
                        <AnimatedCounter value={industries.length} duration={1.8} />
                      </div>
                      <div className="text-sm text-orange-700">Industries</div>
                    </div>
                  </InsightTooltip>
                </div>
              </div>
            </GlowingCard>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompaniesPage;