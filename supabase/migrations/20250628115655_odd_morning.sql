/*
  # Health Data and Notifications Schema

  1. New Tables
    - `health_data`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `data_type` (text) - steps, sleep, weight, heart_rate
      - `value` (decimal)
      - `unit` (text)
      - `recorded_at` (timestamp)
      - `source` (text) - apple_health, google_health, manual
      - `created_at` (timestamp)
    
    - `notification_settings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `mood_reminders` (boolean)
      - `nutrition_reminders` (boolean)
      - `finance_reminders` (boolean)
      - `reminder_times` (jsonb) - array of time strings
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for users to manage their own data
*/

-- Create health_data table
CREATE TABLE IF NOT EXISTS health_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  data_type text CHECK (data_type IN ('steps', 'sleep', 'weight', 'heart_rate', 'calories_burned')) NOT NULL,
  value decimal NOT NULL,
  unit text NOT NULL,
  recorded_at timestamptz NOT NULL,
  source text CHECK (source IN ('apple_health', 'google_health', 'manual')) DEFAULT 'manual',
  created_at timestamptz DEFAULT now()
);

-- Create notification_settings table
CREATE TABLE IF NOT EXISTS notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  mood_reminders boolean DEFAULT true,
  nutrition_reminders boolean DEFAULT true,
  finance_reminders boolean DEFAULT true,
  reminder_times jsonb DEFAULT '["09:00", "13:00", "18:00", "21:00"]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE health_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- Health data policies
CREATE POLICY "Users can read own health data"
  ON health_data FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own health data"
  ON health_data FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own health data"
  ON health_data FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own health data"
  ON health_data FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notification settings policies
CREATE POLICY "Users can read own notification settings"
  ON notification_settings FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notification settings"
  ON notification_settings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notification settings"
  ON notification_settings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create trigger for notification_settings updated_at
CREATE TRIGGER notification_settings_updated_at
  BEFORE UPDATE ON notification_settings
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert default notification settings for existing users
INSERT INTO notification_settings (user_id)
SELECT id FROM profiles
ON CONFLICT (user_id) DO NOTHING;