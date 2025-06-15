import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('🔍 Getting initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Auth session error:', error);
          setError(error.message);
        } else {
          if (mounted) {
            console.log('✅ Initial session loaded:', session ? 'authenticated' : 'not authenticated');
            setSession(session);
            setUser(session?.user || null);
          }
        }
      } catch (err) {
        console.error('💥 Auth initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Authentication error');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Check for OAuth callback parameters in URL
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const error = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');

      if (error) {
        console.error('❌ OAuth callback error:', error, errorDescription);
        setError(errorDescription || error);
        return;
      }

      if (accessToken) {
        console.log('🔄 Processing OAuth callback...');
        try {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || ''
          });

          if (error) {
            console.error('❌ Error setting session from OAuth:', error);
            setError(error.message);
          } else {
            console.log('✅ OAuth session established successfully');
            setSession(data.session);
            setUser(data.session?.user || null);
            setLoading(false);
            
            // Clean up URL parameters
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);
            return;
          }
        } catch (err) {
          console.error('💥 OAuth session error:', err);
          setError(err instanceof Error ? err.message : 'OAuth session error');
        }
      }
    };

    // Handle OAuth callback first, then get session
    handleOAuthCallback().then(() => {
      if (!window.location.search.includes('access_token')) {
        getInitialSession();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session ? 'authenticated' : 'not authenticated');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
          setLoading(false);
          setError(null);

          // Handle specific auth events
          switch (event) {
            case 'SIGNED_IN':
              console.log('✅ User signed in successfully');
              break;
            case 'SIGNED_OUT':
              console.log('👋 User signed out');
              break;
            case 'TOKEN_REFRESHED':
              console.log('🔄 Token refreshed');
              break;
            case 'USER_UPDATED':
              console.log('👤 User updated');
              break;
            case 'PASSWORD_RECOVERY':
              console.log('🔑 Password recovery initiated');
              break;
            case 'INITIAL_SESSION':
              console.log('🏁 Initial session loaded');
              break;
            default:
              console.log('📝 Auth event:', event);
          }
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Sign out error:', error);
        setError(error.message);
      } else {
        console.log('✅ Signed out successfully');
        // Clear any stored data
        localStorage.removeItem('selectedPlan');
      }
    } catch (err) {
      console.error('💥 Sign out exception:', err);
      setError(err instanceof Error ? err.message : 'Sign out error');
    }
  };

  return {
    user,
    session,
    loading,
    error,
    signOut,
    isAuthenticated: !!user && !!session
  };
}