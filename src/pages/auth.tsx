import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import GlowingCard from '../components/advanced/GlowingCard';
import ParticleBackground from '../components/advanced/ParticleBackground';
import MorphingButton from '../components/advanced/MorphingButton';
import { ArrowLeft, Mail, Lock, User, Sparkles, Zap, CheckCircle, AlertTriangle } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const redirectTo = searchParams.get('redirect') || 'dashboard';

  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      const selectedPlan = localStorage.getItem('selectedPlan');
      if (selectedPlan && redirectTo === 'pricing') {
        navigate('/pricing');
      } else {
        navigate(`/${redirectTo}`);
      }
    }
  }, [user, navigate, redirectTo]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (isSignUp) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
            }
          }
        });

        if (error) throw error;

        if (data.user && !data.session) {
          setSuccess('Please check your email for a confirmation link to complete your registration.');
        } else {
          // Auto sign in successful
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => {
            const selectedPlan = localStorage.getItem('selectedPlan');
            if (selectedPlan && redirectTo === 'pricing') {
              navigate('/pricing');
            } else {
              navigate(`/${redirectTo}`);
            }
          }, 1000);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        setSuccess('Signed in successfully! Redirecting...');
        setTimeout(() => {
          const selectedPlan = localStorage.getItem('selectedPlan');
          if (selectedPlan && redirectTo === 'pricing') {
            navigate('/pricing');
          } else {
            navigate(`/${redirectTo}`);
          }
        }, 1000);
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <ParticleBackground particleCount={30} color="#3B82F6" speed={0.3} />
      
      <div className="max-w-md mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Link
              to={redirectTo === 'pricing' ? '/pricing' : '/'}
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back
            </Link>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Secure Authentication</span>
              <Badge variant="success" className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Protected
              </Badge>
            </div>
          </motion.div>
          
          <motion.h1 
            className="text-3xl font-bold text-gray-900 mb-2"
            variants={itemVariants}
          >
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </motion.h1>
          <motion.p 
            className="text-gray-600"
            variants={itemVariants}
          >
            {isSignUp 
              ? 'Join thousands of successful founders' 
              : 'Sign in to your VC Ready account'
            }
          </motion.p>
        </motion.div>

        {/* Auth Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <GlowingCard glowColor="blue" intensity="medium">
            <Card>
              <CardHeader>
                <CardTitle className="text-center flex items-center justify-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                  <Badge variant="info" className="ml-2">
                    <Zap className="w-3 h-3 mr-1" />
                    Fast
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {isSignUp && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="you@example.com"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="••••••••"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  {isSignUp && (
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start">
                      <AlertTriangle className="w-4 h-4 text-red-600 mr-2 mt-0.5" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
                      <p className="text-green-700 text-sm">{success}</p>
                    </div>
                  )}

                  <MorphingButton
                    type="submit"
                    variant="gradient"
                    className="w-full py-3 hover-glow"
                    disabled={loading}
                    successText={isSignUp ? "Account created!" : "Welcome back!"}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        {isSignUp ? 'Creating Account...' : 'Signing In...'}
                      </div>
                    ) : (
                      isSignUp ? 'Create Account' : 'Sign In'
                    )}
                  </MorphingButton>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(!isSignUp);
                      setError('');
                      setSuccess('');
                      setFormData({
                        email: formData.email,
                        password: '',
                        confirmPassword: '',
                        firstName: '',
                        lastName: ''
                      });
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  >
                    {isSignUp 
                      ? 'Already have an account? Sign In' 
                      : "Don't have an account? Sign Up"
                    }
                  </button>
                </div>

                {redirectTo === 'pricing' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 text-sm text-center">
                      <Zap className="w-4 h-4 inline mr-1" />
                      You'll be redirected to complete your plan selection after signing in.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </GlowingCard>
        </motion.div>

        {/* Trust indicators */}
        <motion.div 
          className="mt-8 flex justify-center items-center space-x-6 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
            <span>Secure & Encrypted</span>
          </div>
          <div className="flex items-center text-sm">
            <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
            <span>GDPR Compliant</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;