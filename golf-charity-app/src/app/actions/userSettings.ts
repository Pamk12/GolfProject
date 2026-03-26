'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateCharityYield(percent: number) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized Session' };
    }

    if (percent < 10 || percent > 100) {
      return { success: false, error: 'Yield must be between 10% and 100%.' };
    }

    const { error } = await supabase
      .from('users')
      .update({ charity_contribution_percentage: percent })
      .eq('id', user.id);

    if (error) {
      console.error('Yield Update Error:', error.message);
      return { success: false, error: 'Database transaction failed.' };
    }

    revalidatePath('/user/dashboard');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
