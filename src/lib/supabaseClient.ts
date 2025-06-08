import { createClient } from '@supabase/supabase-js';

// These will be your actual Supabase credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Upload {
  id: string;
  file_name: string;
  file_url: string;
  created_at: string;
}

export interface KPI {
  id: string;
  metric_name: string;
  metric_value: number;
  metric_date: string;
}