'use client';

import { useState } from 'react';
import { User, Mail, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import { changeEmailAction } from '@/app/actions/profile';

interface UserProfilePanelProps {
  email: string;
  userId: string;
  createdAt: string;
}

export default function UserProfilePanel({ email, userId, createdAt }: UserProfilePanelProps) {
  const [isEditing, setIsEditing] = useState(false);
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
      setMessage(result.message || 'Check your inbox.');
      setNewEmail('');
      setTimeout(() => { setIsEditing(false); setStatus('idle'); }, 4000);
    } else {
      setStatus('error');
      setMessage(result.error || 'Failed.');
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)]">
      <div className="bg-slate-900 px-3 sm:px-4 py-2.5 flex justify-between items-center border-b border-slate-800">
        <span className="font-mono text-[10px] sm:text-xs text-amber-500 uppercase tracking-widest flex items-center">
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span> USER_PROFILE
        </span>
        <User className="w-4 h-4 text-amber-500" />
      </div>
      
      <div className="p-4 sm:p-5 space-y-3">
        {/* User Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="font-mono text-[10px] text-slate-500 uppercase">Email</span>
          </div>
          <p className="font-mono text-xs sm:text-sm text-white break-all">{email}</p>
        </div>

        <div className="flex gap-4 sm:gap-6">
          <div>
            <span className="font-mono text-[10px] text-slate-500 uppercase block">UID</span>
            <span className="font-mono text-xs text-slate-300">{userId.substring(0, 12)}...</span>
          </div>
          <div>
            <span className="font-mono text-[10px] text-slate-500 uppercase block">Joined</span>
            <span className="font-mono text-xs text-slate-300">{new Date(createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Email Change */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full mt-2 py-2 bg-slate-950 border border-slate-700 text-slate-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest hover:border-amber-500/50 hover:text-amber-400 transition-all rounded"
          >
            Change Email
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="mt-2 space-y-2">
            <div className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
              <Shield className="w-3 h-3" /> Security verification required
            </div>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="New email address"
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white font-mono text-xs focus:border-amber-400 focus:outline-none placeholder:text-slate-600"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex-1 py-2 bg-amber-950/40 border border-amber-500/50 text-amber-400 font-mono text-[10px] uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all disabled:opacity-50 rounded"
              >
                {status === 'loading' ? 'VERIFYING...' : 'CONFIRM'}
              </button>
              <button
                type="button"
                onClick={() => { setIsEditing(false); setStatus('idle'); }}
                className="px-3 py-2 border border-slate-700 text-slate-500 font-mono text-[10px] uppercase hover:text-white transition-all rounded"
              >
                CANCEL
              </button>
            </div>
          </form>
        )}

        {/* Status Messages */}
        {status === 'success' && (
          <div className="flex items-start gap-2 text-green-400 font-mono text-[10px] bg-green-950/20 border border-green-500/30 p-2 rounded">
            <CheckCircle className="w-3 h-3 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}
        {status === 'error' && (
          <div className="flex items-start gap-2 text-red-400 font-mono text-[10px] bg-red-950/20 border border-red-500/30 p-2 rounded">
            <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}
