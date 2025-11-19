"""create_subscription_table

Revision ID: 20250831234226
Create Date: 2025-08-31T23:42:26.077Z

"""

-- UP Migration
-- Create subscriptions table

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cost DECIMAL(10,2) NOT NULL,
  periodicity TEXT NOT NULL, -- monthly, yearly, etc.
  custom_fields JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_created_at ON subscriptions(created_at);
CREATE INDEX IF NOT EXISTS idx_subscriptions_periodicity ON subscriptions(periodicity);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Security policies
CREATE POLICY "Users can view own subscriptions" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own subscriptions" ON subscriptions
  FOR DELETE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON subscriptions TO authenticated;
GRANT ALL ON subscriptions TO service_role;

-- DOWN Migration
-- Drop subscriptions table

DROP POLICY IF EXISTS "Users can delete own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON subscriptions;
DROP POLICY IF EXISTS "Users can view own subscriptions" ON subscriptions;

DROP INDEX IF EXISTS idx_subscriptions_periodicity;
DROP INDEX IF EXISTS idx_subscriptions_created_at;
DROP INDEX IF EXISTS idx_subscriptions_user_id;

DROP TABLE IF EXISTS subscriptions CASCADE;




