'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitScores(scores: { score: number; play_date: string }[]) {
  const supabase = createClient();
  
  // 1. Authenticate
  const { data: { user }, error: authError } = await (await supabase).auth.getUser();
  if (authError || !user) {
    return { success: false, error: 'Unauthorized user.' };
  }

  // 2. Validate input format
  if (!Array.isArray(scores) || scores.length === 0) {
    return { success: false, error: 'No scores provided.' };
  }

  for (const s of scores) {
    if (!Number.isInteger(s.score) || s.score < 1 || s.score > 45) {
      return { success: false, error: 'Scores must be integers between 1 and 45.' };
    }
    if (!s.play_date || Number.isNaN(Date.parse(s.play_date))) {
      return { success: false, error: 'Invalid play date.' };
    }
  }

  // 3. Fetch existing scores
  const { data: existingScores, error: fetchError } = await (await supabase)
    .from('scores')
    .select('id, user_id, play_date, score, created_at')
    .eq('user_id', user.id);

  if (fetchError) {
    return { success: false, error: 'Failed to fetch existing scores.' };
  }

  // 4. Determine insertions and deletions (Rolling 5-score logic)
  const allScores = [...(existingScores || [])];
  const newInsertions = scores.map(s => ({
    user_id: user.id,
    play_date: s.play_date,
    score: s.score,
    // Add a fake created_at for sorting purposes during the algorithm
    created_at: new Date().toISOString() 
  }));

  // Simulate inserting them
  const simulatedTotal = [...allScores, ...newInsertions];

  let scoresToDelete: string[] = [];
  
  // If total > 5, we need to delete the oldest
  if (simulatedTotal.length > 5) {
    // Sort all scores (including new ones if they magically are older, but usually we just delete DB items)
    // Actually, we should only delete IDs that are already IN the database.
    // So let's sort the existing DB records oldest first.
    
    const sortedExisting = [...allScores].sort((a, b) => {
      const timeA = new Date(a.play_date).getTime();
      const timeB = new Date(b.play_date).getTime();
      if (timeA === timeB) {
         return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      return timeA - timeB;
    });

    const excessAmount = simulatedTotal.length - 5;
    
    // Safety check: if excessAmount > existing scores, it means they are submitting more than 5 scores at once.
    // In that case, we wipe all existing, and only keep the 5 newest of the submitted ones.
    if (excessAmount >= sortedExisting.length) {
      scoresToDelete = sortedExisting.map(s => s.id);
      // Also truncate the new insertions to only the 5 best/latest
      // (This handles the edge case of >5 submitted at once)
      if (newInsertions.length > 5) {
         // truncate to latest 5
         newInsertions.sort((a,b) => new Date(b.play_date).getTime() - new Date(a.play_date).getTime());
         newInsertions.length = 5; 
      }
    } else {
      // Delete the oldest `excessAmount` existing scores
      scoresToDelete = sortedExisting.slice(0, excessAmount).map(s => s.id);
    }
  }

  // 5. Execute DB Transactions
  try {
    if (scoresToDelete.length > 0) {
      const { error: deleteError } = await (await supabase)
        .from('scores')
        .delete()
        .in('id', scoresToDelete);
        
      if (deleteError) throw new Error(deleteError.message);
    }

    if (newInsertions.length > 0) {
      // Strip out the fake created_at used for sorting logic if needed, 
      // but Postgres handles it fine or ignores it if not strictly enforced, 
      // however let's just insert the required fields.
      const payload = newInsertions.map(({ user_id, play_date, score }) => ({
        user_id,
        play_date,
        score
      }));

      const { error: insertError } = await (await supabase)
        .from('scores')
        .insert(payload);

      if (insertError) throw new Error(insertError.message);
    }

    revalidatePath('/user/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Database transaction failed.' };
  }
}
