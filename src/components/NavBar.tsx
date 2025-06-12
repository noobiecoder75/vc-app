import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import InsightTooltip from './InsightTooltip';
import { Upload, TrendingUp, Building2, BarChart3, Sparkles, Zap } from 'lucide-react';

const NavBar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      insight: 'Track your startup metrics and KPIs in real-time',
      description: 'Comprehensive analytics dashboard'
    },
    {
      path: '/companies',
      label: 'Companies',
      icon: Building2,
      insight: 'Browse and analyze startup portfolios with detailed insights',
      description: 'Startup portfolio management'
    }
  ];

  return (
    <motion.nav 
      className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <InsightTooltip
            title="VC Ready Platform"
            description="AI-powered startup validation and fundraising platform"
            insight="Helping 500+ startups get VC ready with data-driven insights"
            actionable="Navigate to homepage to learn more"
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div 
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                VC Ready
              </span>
              <Badge variant="success" className="text-xs">
                <Sparkles className="w-3 h-3 mr-1" />
                AI
              </Badge>
            </Link>
          </InsightTooltip>
          
          {/* Navigation Items */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <InsightTooltip
                key={item.path}
                title={item.label}
                description={item.description}
                insight={item.insight}
                actionable={`Click to navigate to ${item.label.toLowerCase()}`}
              >
                <Link
                  to={item.path}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                    isActive(item.path) || location.pathname.startsWith('/company')
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  {isActive(item.path) && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-100 rounded-lg -z-10"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              </InsightTooltip>
            ))}
            
            {/* Upload Button */}
            <InsightTooltip
              title="Upload Your Idea"
              description="Get instant AI-powered validation of your startup concept"
              insight="Most successful startups validate early - don't wait!"
              actionable="Upload documents, pitch decks, or business plans for analysis"
              examples={["Airbnb started with a simple concept validation", "Dropbox began with a demo video"]}
              type="success"
            >
              <Button
                variant="gradient"
                size="sm"
                className="ml-2 hover-glow"
                asChild
              >
                <Link to="/upload">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Idea
                  <Zap className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            </InsightTooltip>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavBar;