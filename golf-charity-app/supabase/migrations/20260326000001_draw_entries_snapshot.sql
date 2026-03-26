-- Migration: Draw Entries Snapshot Table
-- Purpose: Implement temporal isolation for draw match counts
-- Date: 2026-03-26
--
-- CRITICAL: This table captures each user's score snapshot at draw execution time.
-- Once a draw runs, each user's active rolling 5-score array is immutable for that draw.
-- This prevents future score changes from affecting historical draw results.

CREATE TABLE draw_entries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id uuid NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  score_snapshot integer[] NOT NULL,        -- the user's 5 scores at draw time
  match_count integer NOT NULL DEFAULT 0,   -- pre-computed using correct multiset intersection algorithm
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (draw_id, user_id)
);

ALTER TABLE draw_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entries" ON draw_entries
  FOR SELECT USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can manage entries" ON draw_entries
  FOR ALL USING (is_admin());
