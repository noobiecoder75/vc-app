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
import { Separator } from '../components/ui/separator';
import GlowingCard from '../components/advanced/GlowingCard';
import ParticleBackground from '../components/advanced/ParticleBackground';
import MorphingButton from '../components/advanced/MorphingButton';
import { ArrowLeft, Mail, Lock, User, Sparkles, Zap, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  // Helper function to get valid redirect path
  const getValidRedirectPath = (redirect: string): string => {
    const validPaths = ['dashboard', 'pricing', 'companies', 'upload'];
    return validPaths.includes(redirect) ? redirect : 'dashboard';
  };

  // Redirect authenticated users
  useEffect(() => {
    if (user && !authLoading) {
      console.log('👤 User authenticated, redirecting...');
      const validPath = getValidRedirectPath(redirectTo);
      
      // Handle special case for pricing with plan selection
      if (validPath === 'pricing') {
        const selectedPlan = localStorage.getItem('selectedPlan');
        if (selectedPlan) {
          navigate('/pricing?auth=success');
          return;
        }
      }
      
      navigate(`/${validPath}`);
    }
  }, [user, authLoading, navigate, redirectTo]);

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

  const handleGoogleSignIn = async () => {
    console.log('🔘 Google sign-in initiated');
    
    setGoogleLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔄 Starting Google OAuth...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      console.log('📊 Google OAuth response:', { data, error });

      if (error) {
        console.error('❌ Google OAuth error:', error);
        throw error;
      }

      // Set success message while redirecting
      setSuccess('Redirecting to Google...');
      
      // The redirect will happen automatically via Supabase
    } catch (error: any) {
      console.error('💥 Google sign-in error:', error);
      
      // Provide more specific error messages
      if (error.message?.includes('Invalid login credentials')) {
        setError('Unable to sign in with Google. Please check your Google account settings.');
      } else if (error.message?.includes('OAuth provider not enabled')) {
        setError('Google sign-in is not enabled. Please contact support.');
      } else {
        setError(error.message || 'Failed to sign in with Google. Please try again or use email/password.');
      }
      
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const validPath = getValidRedirectPath(redirectTo);
      
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
          setSuccess('Account created successfully! Redirecting...');
          setTimeout(() => {
            navigate(`/${validPath}`);
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
          navigate(`/${validPath}`);
        }, 1000);
      }
    } catch (error: any) {
      console.error('❌ Email auth error:', error);
      
      // Provide user-friendly error messages
      if (error.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (error.message?.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in.');
      } else if (error.message?.includes('User already registered')) {
        setError('An account with this email already exists. Please sign in instead.');
      } else {
        setError(error.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading state during auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <ParticleBackground particleCount={20} color="#3B82F6" speed={0.2} />
        <div className="text-center relative z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

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
              <CardContent className="space-y-6">
                {/* Google Sign In Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full py-3 border-2 hover:bg-gray-50 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || loading}
                >
                  {googleLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-3" />
                      Connecting to Google...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      {/* Google Logo SVG */}
                      <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </div>
                  )}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with email</span>
                  </div>
                </div>

                {/* Email/Password Form */}
                <form onSubmit={handleEmailAuth} className="space-y-4">
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
                    disabled={loading || googleLoading}
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

                <div className="text-center">
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
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
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