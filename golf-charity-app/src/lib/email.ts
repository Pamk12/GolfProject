import { Resend } from 'resend';

// Initialize Resend with an API key
// Sign up at https://resend.com and add RESEND_API_KEY to your .env.local
const resend = new Resend(process.env.RESEND_API_KEY || '');

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

/**
 * Send a transactional email via Resend.
 * Falls back gracefully if RESEND_API_KEY is not configured.
 */
export async function sendEmail({ to, subject, html }: EmailPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[EMAIL] RESEND_API_KEY not set — email skipped:', subject);
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Golf-Charity <noreply@digitalheroes.app>',
      to,
      subject,
      html,
    });

    if (error) {
      console.error('[EMAIL] Send failed:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('[EMAIL] Exception:', err.message);
    return { success: false, error: err.message };
  }
}

// Pre-built email templates

export function welcomeEmail(userName: string) {
  return {
    subject: 'Welcome to Digital Heroes — Your Node is Active',
    html: `
      <div style="font-family: monospace; background: #0A0A0A; color: #e2e8f0; padding: 32px; max-width: 600px;">
        <h1 style="color: #22d3ee; font-size: 24px; margin-bottom: 16px;">Welcome to Digital Heroes</h1>
        <p style="color: #94a3b8; line-height: 1.6;">
          Hi ${userName},<br/><br/>
          Your node has been successfully initialized on the Digital Heroes network.
          You can now enter your golf scores, participate in monthly draws, and route funds to your chosen charity.
        </p>
        <div style="margin-top: 24px; padding: 16px; border: 1px solid #1e293b; border-radius: 8px; background: #020617;">
          <p style="color: #22d3ee; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Next Steps</p>
          <ul style="color: #94a3b8; font-size: 14px; line-height: 1.8;">
            <li>Enter 5 scores (1-45) from your latest round</li>
            <li>Adjust your charity contribution (default: 10%)</li>
            <li>Wait for the monthly RNG draw</li>
          </ul>
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
          Digital Heroes Golf Charity Platform
        </p>
      </div>
    `,
  };
}

export function drawResultEmail(numbers: number[], tierMatched: string | null, prizeAmount: number) {
  const isWinner = tierMatched !== null;
  return {
    subject: isWinner 
      ? `You matched ${tierMatched}! — Digital Heroes Draw Results` 
      : 'Monthly Draw Results — Digital Heroes',
    html: `
      <div style="font-family: monospace; background: #0A0A0A; color: #e2e8f0; padding: 32px; max-width: 600px;">
        <h1 style="color: ${isWinner ? '#fbbf24' : '#a78bfa'}; font-size: 24px; margin-bottom: 16px;">
          ${isWinner ? 'Congratulations!' : 'Draw Results'}
        </h1>
        <div style="text-align: center; padding: 24px; border: 1px solid #1e293b; border-radius: 8px; background: #020617; margin-bottom: 16px;">
          <p style="color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">Winning Numbers</p>
          <p style="color: #ffffff; font-size: 28px; font-weight: bold; letter-spacing: 4px;">
            ${numbers.join(' | ')}
          </p>
        </div>
        ${isWinner ? `
          <div style="padding: 16px; border: 1px solid #fbbf24; border-radius: 8px; background: #1a1500; margin-bottom: 16px;">
            <p style="color: #fbbf24; font-size: 14px; font-weight: bold;">
              You matched ${tierMatched} and won $${prizeAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}!
            </p>
            <p style="color: #94a3b8; font-size: 13px; margin-top: 8px;">
              Please upload your scorecard proof from your dashboard to claim your prize.
            </p>
          </div>
        ` : `
          <p style="color: #94a3b8; line-height: 1.6;">
            Unfortunately, your scores didn't match this month. Keep entering scores — the jackpot grows with every unclaimed round!
          </p>
        `}
        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
          Digital Heroes Golf Charity Platform
        </p>
      </div>
    `,
  };
}

export function verificationStatusEmail(status: 'approved' | 'rejected', prizeAmount: number) {
  return {
    subject: status === 'approved' 
      ? 'Your Prize Has Been Approved — Digital Heroes' 
      : 'Verification Update — Digital Heroes',
    html: `
      <div style="font-family: monospace; background: #0A0A0A; color: #e2e8f0; padding: 32px; max-width: 600px;">
        <h1 style="color: ${status === 'approved' ? '#4ade80' : '#ef4444'}; font-size: 24px; margin-bottom: 16px;">
          ${status === 'approved' ? 'Prize Approved' : 'Verification Update'}
        </h1>
        <p style="color: #94a3b8; line-height: 1.6;">
          ${status === 'approved' 
            ? `Your scorecard proof has been verified and approved. $${prizeAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} will be routed to your account.`
            : 'Your scorecard proof was not accepted. Please review the submission requirements and try again from your dashboard.'
          }
        </p>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
          Digital Heroes Golf Charity Platform
        </p>
      </div>
    `,
  };
}
