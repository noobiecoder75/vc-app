import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Building2, Users, DollarSign, TrendingUp, MapPin, Calendar, ArrowRight, Loader2, Upload } from 'lucide-react';

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
  created_at: string;
}

const CompaniesPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
      console.error('Error fetching companies:', err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Companies</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={fetchCompanies}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Companies Found</h2>
          <p className="text-gray-600 mb-4">Upload some startup ideas to see them here.</p>
          <Link
            to="/upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Idea
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Building2 className="w-8 h-8 mr-3 text-blue-600" />
                Startup Companies
              </h1>
              <p className="text-gray-600 mt-1">
                Browse and analyze {companies.length} startup{companies.length !== 1 ? 's' : ''} with comprehensive KPI data
              </p>
            </div>
            
            <Link
              to="/upload"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add New Company
            </Link>
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100 group"
            >
              {/* Company Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {company.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStageColor(company.startup_stage)}`}>
                      {company.startup_stage || 'Unknown Stage'}
                    </span>
                    {company.industry_name && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                        {company.industry_name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="space-y-3 mb-6">
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

                {company.valuation_target_usd && (
                  <div className="flex items-center text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Target: {formatCurrency(company.valuation_target_usd)}
                  </div>
                )}

                {company.funding_goal_usd && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Seeking: {formatCurrency(company.funding_goal_usd)}
                  </div>
                )}
              </div>

              {/* Pitch Summary */}
              {company.pitch_deck_summary && (
                <div className="mb-6">
                  <p className="text-gray-600 text-sm line-clamp-3">
                    {company.pitch_deck_summary}
                  </p>
                </div>
              )}

              {/* View Details Button */}
              <Link
                to={`/company/${company.id}`}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium group"
              >
                View KPI Dashboard
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Portfolio Overview</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {companies.length}
              </div>
              <div className="text-sm text-gray-600">Total Companies</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(companies.reduce((sum, c) => sum + (c.valuation_target_usd ?? 0), 0))}
              </div>
              <div className="text-sm text-gray-600">Total Target Valuation</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(companies.reduce((sum, c) => sum + (c.funding_goal_usd ?? 0), 0))}
              </div>
              <div className="text-sm text-gray-600">Total Funding Sought</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {new Set(companies.map(c => c.industry_name).filter(Boolean)).size}
              </div>
              <div className="text-sm text-gray-600">Industries</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompaniesPage;