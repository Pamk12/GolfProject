'use client';

import { useState } from 'react';
import { CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { changeEmailAction } from '@/app/actions/profile';

export default function EmailChangeForm({ currentEmail }: { currentEmail: string }) {
  const [newEmail, setNewEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setStatus('loading');
    const result = await changeEmailAction(newEmail);
    if (result.success) {
      setStatus('success');
      setMessage('A security alert with a recovery link has been sent to your old email. A 2-minute OTP will arrive in your new email.');
      setNewEmail('');
    } else {
      setStatus('error');
      setMessage(result.error || 'Failed.');
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="bg-[#050505] border border-slate-800 rounded px-3 py-2 font-mono text-xs text-slate-500">
          Current: {currentEmail}
        </div>
        <input
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter new email address"
          className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-white font-mono text-sm focus:border-amber-400 focus:outline-none focus:shadow-[0_0_10px_rgba(251,191,36,0.2)] transition-all placeholder:text-slate-600"
        />
        <button
          type="submit"
          disabled={status === 'loading' || !newEmail.trim()}
          className="w-full py-3 bg-amber-950/40 border border-amber-500/50 text-amber-400 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all disabled:opacity-40 disabled:cursor-not-allowed rounded"
        >
          {status === 'loading' ? '[ VERIFYING... ]' : '[ SEND VERIFICATION ]'}
        </button>
      </form>

      {status === 'success' && (
        <div className="flex items-start gap-2 text-green-400 font-mono text-xs bg-green-950/20 border border-green-500/30 p-3 rounded">
          <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-start gap-2 text-red-400 font-mono text-xs bg-red-950/20 border border-red-500/30 p-3 rounded">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}
