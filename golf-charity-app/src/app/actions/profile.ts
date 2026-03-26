'use server';

import { createClient } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';

export async function changeEmailAction(newEmail: string) {
  if (!newEmail || !newEmail.includes('@')) {
    return { success: false, error: 'Invalid email address.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Session expired. Please log in again.' };
  }

  const oldEmail = user.email || '';
  if (newEmail === oldEmail) {
    return { success: false, error: 'New email is the same as current email.' };
  }

  // Update email via Supabase Auth (sends verification to new email automatically)
  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    return { success: false, error: error.message };
  }

  // Send security notification to the OLD email via Resend
  await sendEmail({
    to: oldEmail,
    subject: 'Security Alert — Email Change Requested',
    html: `
      <div style="font-family: monospace; background: #0A0A0A; color: #e2e8f0; padding: 32px; max-width: 600px;">
        <h1 style="color: #ef4444; font-size: 20px; margin-bottom: 16px;">Security Alert: Email Change</h1>
        <p style="color: #94a3b8; line-height: 1.6;">
          A request was made to change the email associated with your Digital Heroes account.
        </p>
        <div style="margin: 16px 0; padding: 16px; border: 1px solid #1e293b; border-radius: 8px; background: #020617;">
          <p style="color: #64748b; font-size: 12px;">Current: <span style="color: #22d3ee;">${oldEmail}</span></p>
          <p style="color: #64748b; font-size: 12px;">Requested: <span style="color: #fbbf24;">${newEmail}</span></p>
        </div>
        <p style="color: #94a3b8; font-size: 13px;">
          If you did not make this request, please secure your account immediately by resetting your password.
        </p>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Digital Heroes Golf Charity Platform</p>
      </div>
    `,
  });

  // Send verification notice to the NEW email via Resend
  await sendEmail({
    to: newEmail,
    subject: 'Verify Your New Email — Digital Heroes',
    html: `
      <div style="font-family: monospace; background: #0A0A0A; color: #e2e8f0; padding: 32px; max-width: 600px;">
        <h1 style="color: #22d3ee; font-size: 20px; margin-bottom: 16px;">Email Verification</h1>
        <p style="color: #94a3b8; line-height: 1.6;">
          You requested to change your Digital Heroes email to this address. Supabase has sent you a separate confirmation link — please check your inbox and click the link to finalize the change.
        </p>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">Digital Heroes Golf Charity Platform</p>
      </div>
    `,
  });

  revalidatePath('/user/dashboard');
  return { success: true, message: 'Verification emails sent. Check both inboxes to confirm the change.' };
}
