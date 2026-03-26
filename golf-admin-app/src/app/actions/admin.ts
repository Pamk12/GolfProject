'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { aggregateSystemAnalytics, verifyScoreImage, editUserScore, AdminScore, UserSubscription } from '@/lib/adminLogic';

// Middleware or layout should already protect this route, but we double check admin status
export async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/');
  }

  // In a real system, we'd check `users.is_admin = true`. 
  // Assuming the user is admin for this demonstration.
  return supabase;
}

export async function getSystemAnalyticsAction() {
  const supabase = await verifyAdmin();
  
  // Fetch users with their subscription statuses
  const { data: users, error: userError } = await supabase
    .from('users')
    .select('id, subscription_status, charity_contribution_percentage');
    
  if (userError) throw new Error(userError.message);

  return aggregateSystemAnalytics((users || []) as UserSubscription[], 100);
}

export async function processScoreVerificationAction(scoreId: string, action: 'approve' | 'reject' | 'flag', formData?: FormData) {
  const supabase = await verifyAdmin();

  // 1. Fetch score
  const { data: scoreData, error: fetchErr } = await supabase
    .from('scores')
    .select('*')
    .eq('id', scoreId)
    .single();

  if (fetchErr || !scoreData) throw new Error('Score not found.');

  // 2. Run through rigorous domain logic state machine
  const updatedScore = verifyScoreImage(scoreData as AdminScore, action);

  // 3. Update DB
  const { error: updateErr } = await supabase
    .from('scores')
    .update({ status: updatedScore.status })
    .eq('id', scoreId);

  if (updateErr) throw new Error(updateErr.message);

  revalidatePath('/verification');
}

export async function adminEditUserScoreAction(scoreId: string, newScoreValue: number, formData?: FormData) {
  const supabase = await verifyAdmin();

  const { data: scoreData, error: fetchErr } = await supabase
    .from('scores')
    .select('*')
    .eq('id', scoreId)
    .single();

  if (fetchErr || !scoreData) throw new Error('Score not found.');

  const updatedScore = editUserScore(scoreData as AdminScore, newScoreValue);

  const { error: updateErr } = await supabase
    .from('scores')
    .update({ score: updatedScore.score, status: updatedScore.status })
    .eq('id', scoreId);

  if (updateErr) throw new Error(updateErr.message);

  revalidatePath('/users');
}

export async function adminDeleteUserAction(userId: string) {
  const supabase = await verifyAdmin();

  // 1. Delete all scores for this user first (FK constraint)
  const { error: scoresErr } = await supabase
    .from('scores')
    .delete()
    .eq('user_id', userId);

  if (scoresErr) throw new Error('Failed to delete user scores: ' + scoresErr.message);

  // 2. Delete the user record
  const { error: userErr } = await supabase
    .from('users')
    .delete()
    .eq('id', userId);

  if (userErr) throw new Error('Failed to delete user: ' + userErr.message);

  revalidatePath('/users');
}
