'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitProofImage(imageUrl: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized Session' };
    }

    if (!imageUrl || !imageUrl.startsWith('https://')) {
      return { success: false, error: 'Must provide a secure HTTPS image url.' };
    }

    // Update the user's latest score entry to be pending verification with the image
    const { data: latestScore, error: fetchErr } = await supabase
      .from('scores')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (fetchErr || !latestScore) {
      return { success: false, error: 'No score vectors found to attach proof to.' };
    }

    const { error: updateErr } = await supabase
      .from('scores')
      .update({ status: 'pending', image_url: imageUrl })
      .eq('id', latestScore.id);

    if (updateErr) {
      console.error('Proof Upload Error:', updateErr.message);
      return { success: false, error: 'Database transaction failed.' };
    }

    revalidatePath('/user/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
