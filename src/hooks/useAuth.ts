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

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session ? 'authenticated' : 'not authenticated');
        
        if (mounted) {
          setSession(session);
          setUser(session?.user || null);
          setError(null);

          // Only set loading to false after we've processed the auth change
          if (event !== 'INITIAL_SESSION') {
            setLoading(false);
          }

          // Handle specific auth events
          switch (event) {
            case 'SIGNED_IN':
              console.log('✅ User signed in successfully');
              setLoading(false);
              break;
            case 'SIGNED_OUT':
              console.log('👋 User signed out');
              setLoading(false);
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
              console.log('🏁 Initial session processed');
              setLoading(false);
              break;
            default:
              console.log('📝 Auth event:', event);
              setLoading(false);
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