/*
  # Subscriptions Table

  1. New Tables
    - `subscriptions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `plan` (text) - 'free' or 'premium'
      - `status` (text) - 'active', 'inactive', 'cancelled'
      - `started_at` (timestamp)
      - `expires_at` (timestamp, nullable)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on subscriptions table
    - Add policies for users to manage their own subscription
*/

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan text CHECK (plan IN ('free', 'premium')) DEFAULT 'free' NOT NULL,
  status text CHECK (status IN ('active', 'inactive', 'cancelled')) DEFAULT 'active' NOT NULL,
  started_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default free subscription for existing users
INSERT INTO subscriptions (user_id, plan, status)
SELECT id, 'free', 'active' FROM profiles
ON CONFLICT (user_id) DO NOTHING;