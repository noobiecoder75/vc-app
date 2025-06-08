import React from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import { ArrowLeft, Lightbulb, FileText, Zap } from 'lucide-react';

const UploadPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upload Your Startup Idea
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your startup concept and get instant AI-powered analysis with market insights, 
            competitive landscape, and validation recommendations.
          </p>
        </div>

        {/* Upload Component */}
        <div className="mb-12">
          <FileUpload />
        </div>

        {/* What You'll Get Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            What You'll Get in Your Free Validation Report
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Market Analysis</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive market size assessment, growth trends, and opportunity identification
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Competitive Landscape</h3>
              <p className="text-gray-600 text-sm">
                Detailed competitor analysis, positioning insights, and differentiation opportunities
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Action Plan</h3>
              <p className="text-gray-600 text-sm">
                Concrete next steps, validation strategies, and recommended resources
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready for More?</h2>
          <p className="mb-6 opacity-90">
            Once you receive your validation report, explore our premium features to track KPIs, 
            build pitch decks, and connect with investors.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold"
          >
            Explore Dashboard
            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;