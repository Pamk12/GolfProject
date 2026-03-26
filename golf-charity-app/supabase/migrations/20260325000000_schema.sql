-- 1. CHARITIES TABLE (Added upcoming_events)
CREATE TABLE charities (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  images text[],
  upcoming_events jsonb DEFAULT '[]'::jsonb, -- To satisfy the "events/golf days" requirement
  featured boolean DEFAULT false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USERS TABLE (Added Admin and Stripe fields)
CREATE TABLE users (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  is_admin boolean DEFAULT false, -- Crucial for Admin Dashboard access
  subscription_status text NOT NULL DEFAULT 'inactive',
  stripe_customer_id text UNIQUE, 
  stripe_subscription_id text UNIQUE,
  selected_charity_id uuid REFERENCES charities(id) ON DELETE SET NULL,
  charity_contribution_percentage numeric(5,2) NOT NULL DEFAULT 10.00 CHECK (charity_contribution_percentage >= 10),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SCORES TABLE
CREATE TABLE scores (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  play_date date NOT NULL,
  score integer NOT NULL CHECK (score >= 1 AND score <= 45),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. DRAWS TABLE (Added numbers and rollover tracking)
CREATE TABLE draws (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_month date NOT NULL,
  winning_numbers integer[], -- Array to store the 5 drawn numbers
  prize_pool numeric(10,2) NOT NULL DEFAULT 0.00,
  rollover_amount numeric(10,2) NOT NULL DEFAULT 0.00, -- To track jackpot rollovers
  status text NOT NULL DEFAULT 'open', -- 'open', 'simulated', 'published'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE charities ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

-- 5. THE CORRECTED RLS POLICIES (With Admin Access)

-- Admin Utility Function (Makes writing policies easier)
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT is_admin FROM users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Charities
CREATE POLICY "Charities viewable by everyone" ON charities FOR SELECT USING (true);
CREATE POLICY "Admins can manage charities" ON charities FOR ALL USING (is_admin());

-- Users
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id OR is_admin());
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id OR is_admin());

-- Scores (Added UPDATE/DELETE for users, and Admin ALL access)
CREATE POLICY "Users can view own scores" ON scores FOR SELECT USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can insert own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can update own scores" ON scores FOR UPDATE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Users can delete own scores" ON scores FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- Draws
CREATE POLICY "Draws viewable by everyone" ON draws FOR SELECT USING (true);
CREATE POLICY "Admins can manage draws" ON draws FOR ALL USING (is_admin());
