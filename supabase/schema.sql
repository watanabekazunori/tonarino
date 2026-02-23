-- searches table (search log = unregistered list)
CREATE TABLE IF NOT EXISTS searches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  searched_at TIMESTAMPTZ DEFAULT NOW(),
  query TEXT NOT NULL,
  place_id TEXT NOT NULL,
  place_name TEXT NOT NULL,
  lat FLOAT NOT NULL,
  lng FLOAT NOT NULL,
  area TEXT,
  ip TEXT,
  user_agent TEXT
);

-- users table (registered users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  auth_provider TEXT DEFAULT 'email',
  store_name TEXT,
  place_id TEXT,
  business_type TEXT,
  challenge TEXT,
  challenge_other TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- reports table (generated reports)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  place_id TEXT NOT NULL,
  competitors_json JSONB,
  review_summary JSONB,
  comparison_text TEXT,
  suggestions JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS policies
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- searches: allow insert from anyone, select only for service role
CREATE POLICY "Allow anonymous inserts" ON searches
  FOR INSERT TO anon WITH CHECK (true);

-- users: allow users to read/update their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- reports: allow users to read their own reports
CREATE POLICY "Users can view own reports" ON reports
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reports" ON reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- indexes
CREATE INDEX idx_searches_place_id ON searches(place_id);
CREATE INDEX idx_searches_searched_at ON searches(searched_at);
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_place_id ON reports(place_id);
