/*
  # VC Ready Database Schema

  Complete database schema for the VC Ready application with comprehensive tables
  for startup data management, founder information, and VC matching.

  1. New Tables
    - `companies` - Core startup company information including valuation targets and funding goals
    - `founders` - Founder profiles with experience, education, and achievements
    - `pitch_decks` - Pitch deck uploads with extracted content and analysis
    - `financial_models` - Financial data and key metrics for startups
    - `vc_fit_reports` - VC matching results and fit analysis
    - `go_to_market` - Go-to-market strategy information
    - `metrics` - Time-series metrics tracking
    - `uploads_queue` - File upload processing queue
    - `chat_logs` - User interaction and chat history

  2. Security
    - No RLS policies applied as requested
    - Standard foreign key constraints for data integrity

  3. Features
    - UUID primary keys with automatic generation
    - Proper timestamp tracking
    - JSONB fields for flexible data storage
    - Comprehensive foreign key relationships
*/

-- companies table
CREATE TABLE IF NOT EXISTS companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  industry_name text,
  sub_industry_name text,
  country text,
  geo_region text,
  startup_stage text,
  valuation_target_usd numeric,
  funding_goal_usd numeric,
  incorporation_year int,
  pitch_deck_summary text,
  gpt_pitch_score float,
  created_at timestamp with time zone DEFAULT now()
);

-- founders table
CREATE TABLE IF NOT EXISTS founders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  full_name text NOT NULL,
  linkedin_url text,
  education_history text[],
  past_exits jsonb,
  domain_experience_yrs float,
  technical_skills text[],
  founder_fit_score float,
  notable_achievements text
);

-- pitch_decks table
CREATE TABLE IF NOT EXISTS pitch_decks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  file_url text,
  upload_timestamp timestamp with time zone DEFAULT now(),
  slide_text_blocks jsonb,
  core_problem text,
  core_solution text,
  customer_segment text,
  market_trends_json jsonb,
  product_summary_md text,
  deck_quality_score float
);

-- financial_models table
CREATE TABLE IF NOT EXISTS financial_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  file_url text,
  monthly_revenue_usd numeric,
  burn_rate_usd numeric,
  ltv_cac_ratio float,
  runway_months float,
  revenue_model_notes text,
  tam_sam_som_json jsonb,
  model_quality_score float
);

-- vc_fit_reports table
CREATE TABLE IF NOT EXISTS vc_fit_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  matched_vcs_json jsonb,
  similar_startup_cases text[],
  requirements_to_improve text[],
  fit_score_breakdown jsonb,
  investor_synopsis_md text,
  funding_probability float
);

-- go_to_market table
CREATE TABLE IF NOT EXISTS go_to_market (
  company_id uuid REFERENCES companies(id) PRIMARY KEY,
  gtm_channels text[],
  gtm_notes_md text,
  gtm_strength_score float
);

-- metrics table (time‑series)
CREATE TABLE IF NOT EXISTS metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id),
  metric_name text,
  metric_value float,
  metric_unit text,
  as_of_date date
);

-- uploads_queue table
CREATE TABLE IF NOT EXISTS uploads_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_url text,
  input_type text,
  company_id uuid REFERENCES companies(id),
  status text CHECK (status IN ('pending','processing','done')),
  parsed_json jsonb,
  raw_text text
);

-- chat_logs table
CREATE TABLE IF NOT EXISTS chat_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  timestamp timestamp with time zone DEFAULT now(),
  user_message text,
  gpt_response text,
  context_type text,
  reference_id uuid
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_founders_company_id ON founders(company_id);
CREATE INDEX IF NOT EXISTS idx_pitch_decks_company_id ON pitch_decks(company_id);
CREATE INDEX IF NOT EXISTS idx_financial_models_company_id ON financial_models(company_id);
CREATE INDEX IF NOT EXISTS idx_vc_fit_reports_company_id ON vc_fit_reports(company_id);
CREATE INDEX IF NOT EXISTS idx_metrics_company_id ON metrics(company_id);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(as_of_date);
CREATE INDEX IF NOT EXISTS idx_uploads_queue_company_id ON uploads_queue(company_id);
CREATE INDEX IF NOT EXISTS idx_uploads_queue_status ON uploads_queue(status);
CREATE INDEX IF NOT EXISTS idx_chat_logs_user_id ON chat_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_timestamp ON chat_logs(timestamp);