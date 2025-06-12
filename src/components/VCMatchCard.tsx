import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';
import InsightTooltip from './InsightTooltip';
import { Users, MapPin, DollarSign, Star, TrendingUp, Building2, Calendar, Award } from 'lucide-react';
import { getVCInsight } from '../lib/utils';

interface VCData {
  name: string;
  focus: string;
  location: string;
  checkSize: string;
  stage: string;
  matchScore: number;
  portfolio?: string[];
  recentInvestments?: number;
  avgDealSize?: string;
  founded?: number;
  logoUrl?: string;
}

const VCMatchCard = () => {
  const vcMatches: VCData[] = [
    {
      name: "Sequoia Capital",
      focus: "Enterprise SaaS, FinTech",
      location: "Menlo Park, CA",
      checkSize: "$1M - $25M",
      stage: "Series A-B",
      matchScore: 95,
      portfolio: ["Apple", "Google", "WhatsApp", "Stripe"],
      recentInvestments: 12,
      avgDealSize: "$8.5M",
      founded: 1972
    },
    {
      name: "Andreessen Horowitz",
      focus: "B2B Software, AI/ML",
      location: "Menlo Park, CA", 
      checkSize: "$500K - $15M",
      stage: "Seed - Series A",
      matchScore: 88,
      portfolio: ["Facebook", "Twitter", "Airbnb", "Coinbase"],
      recentInvestments: 18,
      avgDealSize: "$5.2M",
      founded: 2009
    },
    {
      name: "First Round Capital",
      focus: "Early Stage Tech",
      location: "San Francisco, CA",
      checkSize: "$100K - $3M", 
      stage: "Pre-seed - Seed",
      matchScore: 82,
      portfolio: ["Uber", "Square", "Notion", "Warby Parker"],
      recentInvestments: 25,
      avgDealSize: "$1.8M",
      founded: 2004
    }
  ];

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 80) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getMatchScoreBadge = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 80) return 'info';
    if (score >= 70) return 'warning';
    return 'destructive';
  };

  return (
    <Card className="hover-glow transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-600" />
          <span>VC Matches</span>
        </CardTitle>
        <Badge variant="info" className="text-xs">
          AI-Powered
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {vcMatches.map((vc, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <InsightTooltip
              title={vc.name}
              description={`${vc.focus} • ${vc.stage}`}
              insight={getVCInsight(vc.name, vc.matchScore)}
              benchmark={{
                value: vc.matchScore,
                label: `${vc.matchScore}% Match`,
                status: vc.matchScore >= 90 ? 'excellent' : 
                       vc.matchScore >= 80 ? 'good' : 
                       vc.matchScore >= 70 ? 'average' : 'poor'
              }}
              examples={vc.portfolio ? [`Portfolio: ${vc.portfolio.slice(0, 2).join(', ')}`] : undefined}
              actionable={vc.matchScore >= 85 ? "High priority - reach out immediately" : "Consider for outreach"}
              type={vc.matchScore >= 85 ? 'success' : 'info'}
            >
              <Card className="border border-gray-200 hover:shadow-md transition-all duration-200 cursor-help">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={vc.logoUrl} alt={vc.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">
                          {vc.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-gray-900">{vc.name}</h4>
                        <p className="text-sm text-gray-600">{vc.focus}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={getMatchScoreBadge(vc.matchScore) as any}
                        className="mb-1"
                      >
                        {vc.matchScore}% Match
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">Top Match</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Match Score Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-600">Match Score</span>
                      <span className="text-xs font-medium text-gray-900">{vc.matchScore}%</span>
                    </div>
                    <Progress value={vc.matchScore} className="h-2" />
                  </div>
                  
                  {/* Key Details Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600 truncate">{vc.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{vc.checkSize}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-3 h-3 text-gray-400" />
                      <span className="text-gray-600">{vc.stage}</span>
                    </div>
                    {vc.founded && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">Est. {vc.founded}</span>
                      </div>
                    )}
                  </div>

                  {/* Additional Insights */}
                  {(vc.recentInvestments || vc.avgDealSize) && (
                    <div className="grid grid-cols-2 gap-3 text-xs text-gray-600 mb-3 p-2 bg-gray-50 rounded-lg">
                      {vc.recentInvestments && (
                        <div className="flex items-center space-x-1">
                          <Building2 className="w-3 h-3" />
                          <span>{vc.recentInvestments} recent deals</span>
                        </div>
                      )}
                      {vc.avgDealSize && (
                        <div className="flex items-center space-x-1">
                          <Award className="w-3 h-3" />
                          <span>Avg: {vc.avgDealSize}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Portfolio Preview */}
                  {vc.portfolio && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-600 mb-1">Notable Portfolio:</p>
                      <div className="flex flex-wrap gap-1">
                        {vc.portfolio.slice(0, 3).map((company, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {company}
                          </Badge>
                        ))}
                        {vc.portfolio.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{vc.portfolio.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                  >
                    View Profile & Connect
                  </Button>
                </CardContent>
              </Card>
            </InsightTooltip>
          </motion.div>
        ))}
        
        <Button 
          variant="gradient" 
          className="w-full mt-4"
        >
          <Users className="w-4 h-4 mr-2" />
          Find More Matches
        </Button>
      </CardContent>
    </Card>
  );
};

export default VCMatchCard;