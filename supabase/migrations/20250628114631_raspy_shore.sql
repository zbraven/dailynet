/*
  # Core Tracking Features Schema

  1. New Tables
    - `mood_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `mood_level` (integer, 1-10)
      - `notes` (text, optional)
      - `created_at` (timestamp)
    
    - `nutrition_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `meal_type` (text) - breakfast, lunch, dinner, snack
      - `food_name` (text)
      - `calories` (decimal)
      - `protein` (decimal)
      - `fat` (decimal)
      - `carbs` (decimal)
      - `serving_size` (text)
      - `created_at` (timestamp)
    
    - `financial_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `type` (text) - income, expense
      - `amount` (decimal)
      - `description` (text)
      - `category` (text)
      - `created_at` (timestamp)
    
    - `financial_categories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `type` (text) - income, expense
      - `color` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
*/

-- Create mood_entries table
CREATE TABLE IF NOT EXISTS mood_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mood_level integer CHECK (mood_level >= 1 AND mood_level <= 10) NOT NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create nutrition_entries table
CREATE TABLE IF NOT EXISTS nutrition_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  meal_type text CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
  food_name text NOT NULL,
  calories decimal DEFAULT 0,
  protein decimal DEFAULT 0,
  fat decimal DEFAULT 0,
  carbs decimal DEFAULT 0,
  serving_size text DEFAULT '1 serving',
  created_at timestamptz DEFAULT now()
);

-- Create financial_entries table
CREATE TABLE IF NOT EXISTS financial_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type text CHECK (type IN ('income', 'expense')) NOT NULL,
  amount decimal NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create financial_categories table
CREATE TABLE IF NOT EXISTS financial_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text CHECK (type IN ('income', 'expense')) NOT NULL,
  color text DEFAULT '#007AFF',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, name, type)
);

-- Enable RLS on all tables
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_categories ENABLE ROW LEVEL SECURITY;

-- Mood entries policies
CREATE POLICY "Users can read own mood entries"
  ON mood_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own mood entries"
  ON mood_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own mood entries"
  ON mood_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own mood entries"
  ON mood_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Nutrition entries policies
CREATE POLICY "Users can read own nutrition entries"
  ON nutrition_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition entries"
  ON nutrition_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition entries"
  ON nutrition_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition entries"
  ON nutrition_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Financial entries policies
CREATE POLICY "Users can read own financial entries"
  ON financial_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial entries"
  ON financial_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial entries"
  ON financial_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial entries"
  ON financial_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Financial categories policies
CREATE POLICY "Users can read own financial categories"
  ON financial_categories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own financial categories"
  ON financial_categories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own financial categories"
  ON financial_categories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own financial categories"
  ON financial_categories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default financial categories
INSERT INTO financial_categories (user_id, name, type, color) 
SELECT 
  id,
  category_name,
  category_type,
  category_color
FROM profiles,
(VALUES 
  ('Food & Dining', 'expense', '#FF6B6B'),
  ('Transportation', 'expense', '#4ECDC4'),
  ('Shopping', 'expense', '#45B7D1'),
  ('Entertainment', 'expense', '#96CEB4'),
  ('Bills & Utilities', 'expense', '#FFEAA7'),
  ('Healthcare', 'expense', '#DDA0DD'),
  ('Education', 'expense', '#98D8C8'),
  ('Other Expenses', 'expense', '#F7DC6F'),
  ('Salary', 'income', '#2ECC71'),
  ('Freelance', 'income', '#3498DB'),
  ('Investment', 'income', '#9B59B6'),
  ('Other Income', 'income', '#1ABC9C')
) AS default_categories(category_name, category_type, category_color)
ON CONFLICT (user_id, name, type) DO NOTHING;