/*
  # Make database fields nullable for partial information handling

  1. Changes
    - Ensure all optional fields across tables can accept null values
    - Keep essential fields (names, IDs) as required
    - Allow for graceful handling of incomplete startup data

  2. Security
    - Maintains data integrity while allowing flexible data entry
    - Preserves foreign key relationships
*/

-- Make any remaining non-nullable fields nullable where appropriate
-- (Most fields are already nullable, but this ensures consistency)

-- Companies table - make optional business fields nullable
DO $$
BEGIN
  -- These fields should remain NOT NULL: id, name (every company needs a name)
  -- All other fields should be nullable for partial information
  
  -- These are likely already nullable, but ensuring consistency
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'companies' AND column_name = 'industry_name' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE companies ALTER COLUMN industry_name DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'companies' AND column_name = 'sub_industry_name' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE companies ALTER COLUMN sub_industry_name DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'companies' AND column_name = 'pitch_deck_summary' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE companies ALTER COLUMN pitch_deck_summary DROP NOT NULL;
  END IF;
END $$;

-- Founders table - make optional fields nullable
DO $$
BEGIN
  -- Keep full_name as NOT NULL since every founder needs a name
  -- Make other fields nullable for partial information
  
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'founders' AND column_name = 'linkedin_url' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE founders ALTER COLUMN linkedin_url DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'founders' AND column_name = 'notable_achievements' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE founders ALTER COLUMN notable_achievements DROP NOT NULL;
  END IF;
END $$;

-- Pitch decks table - ensure all content fields are nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pitch_decks' AND column_name = 'core_problem' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE pitch_decks ALTER COLUMN core_problem DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pitch_decks' AND column_name = 'core_solution' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE pitch_decks ALTER COLUMN core_solution DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pitch_decks' AND column_name = 'customer_segment' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE pitch_decks ALTER COLUMN customer_segment DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pitch_decks' AND column_name = 'product_summary_md' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE pitch_decks ALTER COLUMN product_summary_md DROP NOT NULL;
  END IF;
END $$;

-- Financial models table - ensure all financial fields are nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'financial_models' AND column_name = 'revenue_model_notes' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE financial_models ALTER COLUMN revenue_model_notes DROP NOT NULL;
  END IF;
END $$;

-- Go to market table - ensure all strategy fields are nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'go_to_market' AND column_name = 'gtm_notes_md' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE go_to_market ALTER COLUMN gtm_notes_md DROP NOT NULL;
  END IF;
END $$;

-- Metrics table - make metric details nullable for flexibility
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'metrics' AND column_name = 'metric_name' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE metrics ALTER COLUMN metric_name DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'metrics' AND column_name = 'metric_unit' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE metrics ALTER COLUMN metric_unit DROP NOT NULL;
  END IF;
END $$;

-- Uploads queue table - ensure processing fields are nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'uploads_queue' AND column_name = 'input_type' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE uploads_queue ALTER COLUMN input_type DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'uploads_queue' AND column_name = 'status' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE uploads_queue ALTER COLUMN status DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'uploads_queue' AND column_name = 'raw_text' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE uploads_queue ALTER COLUMN raw_text DROP NOT NULL;
  END IF;
END $$;

-- Chat logs table - ensure message fields are nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chat_logs' AND column_name = 'user_message' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE chat_logs ALTER COLUMN user_message DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chat_logs' AND column_name = 'gpt_response' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE chat_logs ALTER COLUMN gpt_response DROP NOT NULL;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'chat_logs' AND column_name = 'context_type' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE chat_logs ALTER COLUMN context_type DROP NOT NULL;
  END IF;
END $$;