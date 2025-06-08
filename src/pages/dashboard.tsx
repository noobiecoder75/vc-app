import React from 'react';
import { Link } from 'react-router-dom';
import KPIInput from '../components/KPIInput';
import KPIChart from '../components/KPIChart';
import ValuationProgress from '../components/ValuationProgress';
import VCMatchCard from '../components/VCMatchCard';
import { ArrowLeft, BarChart3, Target, Users, FileText, Star, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Startup Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your progress and manage your fundraising journey</p>
            </div>
            
            <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
              <Star className="w-4 h-4" />
              <span className="text-sm font-medium">Readiness Score: 78%</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-semibold text-gray-900">$25K</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Growth Rate</p>
                <p className="text-2xl font-semibold text-gray-900">12.5%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-semibold text-gray-900">1,250</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Valuation</p>
                <p className="text-2xl font-semibold text-gray-900">$2.5M</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - KPI Input */}
          <div className="lg:col-span-2">
            <KPIInput />
          </div>
          
          {/* Right Column - Valuation Progress */}
          <div>
            <ValuationProgress />
          </div>
        </div>

        {/* Charts and VC Matching */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <KPIChart />
          <VCMatchCard />
        </div>

        {/* Premium Features Preview */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-semibold mb-2">Unlock Premium Features</h2>
              <p className="opacity-90 mb-4">
                Get access to pitch deck builder, advanced analytics, and direct VC connections
              </p>
              <ul className="space-y-2 text-sm opacity-90">
                <li className="flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  AI-Powered Pitch Deck Builder
                </li>
                <li className="flex items-center">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Advanced Analytics & Forecasting
                </li>
                <li className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Direct VC Introductions
                </li>
              </ul>
            </div>
            
            <div className="text-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Upgrade to Pro
              </button>
              <p className="text-sm opacity-75 mt-2">Starting at $29/month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;