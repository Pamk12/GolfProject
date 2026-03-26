'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitTelemetry(scores: number[], playDate: string, yieldValue: number = 10, tier: string = 'demo') {
  try {
    const supabase = await createClient();

    // 1. Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: 'Unauthorized user.' };
    }

    // 1b. Ensure `public.users` configuration node exists (Just-in-Time Creation for Magic Links & Legacy Accounts)
    const { data: existingUser } = await supabase.from('users').select('id').eq('id', user.id).maybeSingle();
    
    if (!existingUser) {
      // Pick a random/first charity if required by schema constraints
      const { data: fallbackCharity } = await supabase.from('charities').select('id').limit(1).maybeSingle();
      
      await supabase.from('users').insert({
        id: user.id,
        subscription_status: 'inactive',
        charity_contribution_percentage: 10,
        selected_charity_id: fallbackCharity?.id || null
      });
    }

    // 2. Validate payload: exactly 5 integers between 1 and 45
    if (!Array.isArray(scores) || scores.length !== 5) {
      return { success: false, error: 'Payload must contain exactly 5 discrete integers.' };
    }

    for (const score of scores) {
      if (!Number.isInteger(score) || score < 1 || score > 45) {
        return { success: false, error: 'Scores must be strict integers between 1 and 45.' };
      }
    }

    if (!playDate || Number.isNaN(Date.parse(playDate))) {
      return { success: false, error: 'Invalid play date.' };
    }

    // 3. Insert the 5 scores into the `scores` table
    const insertPayload = scores.map(score => ({
      user_id: user.id,
      play_date: playDate,
      score: score
    }));

    const { error: insertError } = await supabase
      .from('scores')
      .insert(insertPayload);

    if (insertError) {
      throw new Error(`Failed to insert telemetry: ${insertError.message}`);
    }

    // 3b. Update profile with the specified Yield & Tier configurations
    if (yieldValue < 10 || yieldValue > 100) return { success: false, error: 'Yield constraint violated. Must be 10-100.' };
    
    const userUpdatePayload: any = { charity_contribution_percentage: yieldValue };
    if (tier !== 'demo') {
      userUpdatePayload.subscription_tier = tier;
      userUpdatePayload.subscription_status = 'active';
    } else {
      userUpdatePayload.subscription_tier = 'demo';
      userUpdatePayload.subscription_status = 'inactive';
    }

    const { error: updateError } = await supabase
      .from('users')
      .update(userUpdatePayload)
      .eq('id', user.id);

    if (updateError) throw new Error(`Failed to synchronize host profile configurations: ${updateError.message}`);

    // 4. Enforce the "Rolling 5" PRD Rule
    // Query the user's total scores ordered by creation date descending (newest first)
    const { data: totalScores, error: fetchError } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      throw new Error(`Failed to verify rolling history: ${fetchError.message}`);
    }

    if (totalScores && totalScores.length > 5) {
      // Keep only the first 5 (newest), delete the rest
      const excessScores = totalScores.slice(5).map(s => s.id);
      
      if (excessScores.length > 0) {
        const { error: deleteError } = await supabase
          .from('scores')
          .delete()
          .in('id', excessScores);
          
        if (deleteError) {
          throw new Error(`Failed to enforce sliding window: ${deleteError.message}`);
        }
      }
    }

    // 5. Revalidate Paths
    revalidatePath('/user/dashboard');
    revalidatePath('/admin/dashboard');

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Telemetry transaction failed.' };
  }
}
