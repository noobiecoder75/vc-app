import React from 'react';
import { Users, MapPin, DollarSign, Star } from 'lucide-react';

interface VCData {
  name: string;
  focus: string;
  location: string;
  checkSize: string;
  stage: string;
  matchScore: number;
}

const VCMatchCard = () => {
  const vcMatches: VCData[] = [
    {
      name: "Sequoia Capital",
      focus: "Enterprise SaaS, FinTech",
      location: "Menlo Park, CA",
      checkSize: "$1M - $25M",
      stage: "Series A-B",
      matchScore: 95
    },
    {
      name: "Andreessen Horowitz",
      focus: "B2B Software, AI/ML",
      location: "Menlo Park, CA",
      checkSize: "$500K - $15M",
      stage: "Seed - Series A",
      matchScore: 88
    },
    {
      name: "First Round Capital",
      focus: "Early Stage Tech",
      location: "San Francisco, CA",
      checkSize: "$100K - $3M",
      stage: "Pre-seed - Seed",
      matchScore: 82
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">VC Matches</h3>
        <Users className="w-6 h-6 text-blue-600" />
      </div>
      
      <div className="space-y-4">
        {vcMatches.map((vc, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{vc.name}</h4>
                <p className="text-sm text-gray-600">{vc.focus}</p>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">{vc.matchScore}%</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{vc.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{vc.checkSize}</span>
              </div>
              <div className="text-gray-600">{vc.stage}</div>
            </div>
            
            <button className="mt-3 w-full bg-blue-50 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
              View Profile
            </button>
          </div>
        ))}
      </div>
      
      <button className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
        Find More Matches
      </button>
    </div>
  );
};

export default VCMatchCard;