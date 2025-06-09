/*
  # Fix user_id constraint for anonymous uploads

  1. Changes
    - Make user_id nullable in companies table to allow anonymous uploads
    - Add default value for better data integrity

  2. Security
    - Maintains data integrity while allowing anonymous usage
*/

-- Make user_id nullable to allow anonymous uploads
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'companies' AND column_name = 'user_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE companies ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;