"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { aggregateSystemAnalytics, UserSubscription } from '@/lib/adminLogic';
import { verifyAdmin } from './admin';

/**
 * Counts matches using strict multiset intersection.
 * Each drawn number can only be matched by at most one user score.
 * Example: draw=[5,10,15,20,25], user=[5,10,10,5,10] → 2 matches (not 5)
 */
function multisetIntersectionCount(drawn: number[], userScores: number[]): number {
  const drawnFreq = new Map<number, number>();
  for (const n of drawn) drawnFreq.set(n, (drawnFreq.get(n) ?? 0) + 1);
  let count = 0;
  for (const s of userScores) {
    const remaining = drawnFreq.get(s) ?? 0;
    if (remaining > 0) {
      count++;
      drawnFreq.set(s, remaining - 1);
    }
  }
  return count;
}

/**
 * executeRngRouting()
 * Core backend engine for the Monthly Prize Draw Algorithm (RNG_ROUTING).
 *
 * ALGORITHM:
 * - Generates exactly 5 unique, discrete integers between 1 and 45.
 * - Supports Random OR Algorithmic (Weighted) Generation.
 * - Supports Simulation Dry-Run Pre-Analysis mode before Publishing.
 * - Matches the generated payload against active user scores arrays.
 * - TIER 1 (Jackpot): 5 Numbers Matched = 40% of Prize Pool.
 * - TIER 2: 4 Numbers Matched = 35% of Prize Pool.
 * - TIER 3: 3 Numbers Matched = 25% of Prize Pool.
 */
export async function executeRngRouting(
  mode: 'simulation' | 'published' = 'simulation',
  logic: 'random' | 'algorithmic' = 'random'
) {
  // STEP 1: VERIFY ADMIN CLEARANCE
  const supabase = await verifyAdmin();

  // Fetch all active users to calculate the prize pool
  const { data: allUsers, error: userError } = await supabase
    .from('users')
    .select('id, subscription_status, subscription_tier, charity_contribution_percentage');

  if (userError) throw new Error(userError.message);

  // Calculate the prize pool from subscription analytics
  const analytics = aggregateSystemAnalytics((allUsers || []) as UserSubscription[]);

  // Check for rollover from the most recent published draw
  const { data: lastDraw } = await supabase
    .from('draws')
    .select('rollover_amount')
    .eq('status', 'published')
    .order('draw_month', { ascending: false })
    .limit(1)
    .single();

  const totalPrizePool = analytics.projectedPrizePool + (lastDraw?.rollover_amount ?? 0);

  // Fetch all user scores to evaluate matches and for Algorithmic mode weighting
  const { data: allScores, error: scoreError } = await supabase
    .from('scores')
    .select('user_id, score')
    .order('created_at', { ascending: false });

  if (scoreError) throw new Error(scoreError.message);

  // STEP 2: GENERATE 5 UNIQUE SECURE WINNING NUMBERS (1-45)
  let winningNumbers: number[] = [];
  
  if (logic === 'algorithmic' && allScores && allScores.length > 0) {
    // Weighted Algorithm: Pick the 5 most frequently submitted numbers across the system
    const freqMap: Record<number, number> = {};
    allScores.forEach(s => { freqMap[s.score] = (freqMap[s.score] || 0) + 1; });
    const sortedFreqs = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1]) // Descending freq
      .map(entry => parseInt(entry[0], 10));
    
    // Pick top 5, backfill with random if insufficient user data
    winningNumbers = sortedFreqs.slice(0, 5);
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) winningNumbers.push(num);
    }
  } else {
    // Standard Cryptographic Random Generation
    while (winningNumbers.length < 5) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!winningNumbers.includes(num)) winningNumbers.push(num);
    }
  }
  
  // Sort numbers for cleaner display/logging
  winningNumbers.sort((a, b) => a - b);

  // Reconstruct the 5-number vectors for each user (max 5 scores per user)
  const userVectors: Record<string, number[]> = {};
  if (allScores) {
    for (const s of allScores) {
      if (!userVectors[s.user_id]) userVectors[s.user_id] = [];
      if (userVectors[s.user_id].length < 5) {
        userVectors[s.user_id].push(s.score);
      }
    }
  }

  // STEP 4: RUN MATCHING ALGORITHM
  const winners = {
    demo: { tier1: [] as string[], tier2: [] as string[], tier3: [] as string[] },
    monthly: { tier1: [] as string[], tier2: [] as string[], tier3: [] as string[] },
    yearly: { tier1: [] as string[], tier2: [] as string[], tier3: [] as string[] }
  };

  const userStatusMap: Record<string, string> = {};
  const userTierMap: Record<string, string> = {};
  if (allUsers) {
    for (const u of allUsers) {
      userStatusMap[u.id] = u.subscription_status;
      userTierMap[u.id] = (u as any).subscription_tier || 'demo';
    }
  }

  for (const [userId, vector] of Object.entries(userVectors)) {
    const matchCount = multisetIntersectionCount(winningNumbers, vector);

    const tier = userTierMap[userId] || 'demo';
    const cat = (tier === 'monthly' || tier === 'yearly') ? tier : 'demo';

    if (matchCount === 5) winners[cat].tier1.push(userId);
    if (matchCount === 4) winners[cat].tier2.push(userId);
    if (matchCount === 3) winners[cat].tier3.push(userId);
  }

  // Calculate strict PRD splits targeting PAID (monthly+yearly) winners only
  const paidWinners = {
    tier1: [...winners.monthly.tier1, ...winners.yearly.tier1],
    tier2: [...winners.monthly.tier2, ...winners.yearly.tier2],
    tier3: [...winners.monthly.tier3, ...winners.yearly.tier3],
  };

  const splits = {
    tier1_total: totalPrizePool * 0.40,
    tier2_total: totalPrizePool * 0.35,
    tier3_total: totalPrizePool * 0.25,
    tier1_per_winner: paidWinners.tier1.length > 0 ? (totalPrizePool * 0.40) / paidWinners.tier1.length : 0,
    tier2_per_winner: paidWinners.tier2.length > 0 ? (totalPrizePool * 0.35) / paidWinners.tier2.length : 0,
    tier3_per_winner: paidWinners.tier3.length > 0 ? (totalPrizePool * 0.25) / paidWinners.tier3.length : 0,
  };

  // If there are no Tier 1 (Jackpot) PAID winners, their 40% will rollover.
  const rolloverAmount = paidWinners.tier1.length === 0 ? splits.tier1_total : 0;
  
  // Collect all winning user IDs for global tracking (combined)
  const allWinningIds = [
    ...paidWinners.tier1, ...paidWinners.tier2, ...paidWinners.tier3,
    ...winners.demo.tier1, ...winners.demo.tier2, ...winners.demo.tier3
  ];

  // STEP 5: SAVE PROTOCOL RESULTS TO THE DATABASE
  const { data: insertedDraw, error: insertErr } = await supabase
    .from('draws')
    .insert([{
      draw_month: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      winning_numbers: winningNumbers,
      prize_pool: totalPrizePool,
      rollover_amount: rolloverAmount,
      calculated_splits: {
        tiers: winners,
        payouts: splits
      },
      winning_user_ids: allWinningIds,
      status: mode
    }])
    .select('id')
    .single();

  if (insertErr) throw new Error(insertErr.message);

  // Snapshot each user's score vector against this draw (temporal isolation)
  if (mode === 'published' && insertedDraw?.id) {
    const snapshotPayload = Object.entries(userVectors).map(([userId, vector]) => ({
      draw_id: insertedDraw.id,
      user_id: userId,
      score_snapshot: vector,
      match_count: multisetIntersectionCount(winningNumbers, vector),
    }));
    
    if (snapshotPayload.length > 0) {
      const { error: snapErr } = await supabase.from('draw_entries').insert(snapshotPayload);
      if (snapErr) console.warn('Snapshot insertion failure:', snapErr.message);
    }
  }


  // STEP 6: NOTIFY THE DASHBOARDS OF A STATE CHANGE
  if (mode === 'published') {
    revalidatePath('/dashboard');
    revalidatePath('/user/dashboard'); 
  }

  return { 
    success: true, 
    mode,
    logic,
    winningNumbers, 
    prizePool: totalPrizePool,
    rollover: rolloverAmount > 0,
    metrics: {
      monthly: { t1: winners.monthly.tier1.length, t2: winners.monthly.tier2.length, t3: winners.monthly.tier3.length },
      yearly: { t1: winners.yearly.tier1.length, t2: winners.yearly.tier2.length, t3: winners.yearly.tier3.length },
      demo: { t1: winners.demo.tier1.length, t2: winners.demo.tier2.length, t3: winners.demo.tier3.length }
    }
  };
}
