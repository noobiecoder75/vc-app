import React from 'react';
import { Link } from 'react-router-dom';
import FeatureCard from '../components/FeatureCard';
import { FileText, BarChart3, Presentation as PresentationChart, Users, ArrowRight, CheckCircle } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Get Your Startup{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VC Ready
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Validate your idea. Track KPIs. Build your pitch. Match with VCs.
              Everything you need to secure funding in one powerful platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg"
              >
                Start Free
              </button>
              <Link
                to="/upload"
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200 font-semibold text-lg flex items-center justify-center"
              >
                Upload Your Idea
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>No Credit Card Required</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Free Validation Report</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Secure & Private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Raise Capital
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From idea validation to VC matching, our AI-powered platform guides you through every step of the fundraising journey.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FileText}
              title="Free Validation Report"
              description="Upload your startup idea and get instant AI-powered analysis with market insights, competitive landscape, and validation recommendations."
            />
            
            <FeatureCard
              icon={BarChart3}
              title="KPI Tracker + Valuation Goals"
              description="Monitor key metrics, set valuation targets, and track your progress with intuitive dashboards and automated reporting."
              isPaid={true}
            />
            
            <FeatureCard
              icon={PresentationChart}
              title="Pitch Deck Builder"
              description="Create compelling pitch decks with AI assistance, industry templates, and real-time collaboration features."
              isPaid={true}
              comingSoon={true}
            />
            
            <FeatureCard
              icon={Users}
              title="VC Matching Engine"
              description="Get matched with relevant VCs based on your industry, stage, and funding needs. Access warm introductions and track outreach."
              isPaid={true}
              comingSoon={true}
            />
            
            <FeatureCard
              icon={CheckCircle}
              title="Readiness Score"
              description="Get a comprehensive assessment of your fundraising readiness with actionable recommendations to improve your chances."
              isPaid={true}
              comingSoon={true}
            />
            
            <FeatureCard
              icon={ArrowRight}
              title="Expert Guidance"
              description="Access curated resources, best practices, and expert insights to navigate the fundraising process successfully."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get VC Ready?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of founders who have successfully raised capital with our platform.
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-lg"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">VC Ready</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering startups to successfully raise capital with AI-powered insights and expert guidance.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VC Ready. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;