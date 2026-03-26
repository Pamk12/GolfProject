'use client';

import { useRouter } from 'next/navigation';
import { Lock, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Hardcoded expected root email for isolated monorepo environment
  const ROOT_EMAIL = 'admin@dheroes.com';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (email.toLowerCase().trim() !== ROOT_EMAIL.toLowerCase()) {
        throw new Error('UNAUTHORIZED_NODE: Terminal restricted to ROOT_ACCESS only.');
      }

      // Hardcoded local validation
      if (password !== 'admin123') {
        throw new Error('INVALID_KEY: Authentication sequence rejected.');
      }

      const supabase = createClient();
      let { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        // Seamless Auto-Provisioning: If account doesn't exist, force-create it
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });
        
        if (signUpError) {
          throw new Error('AUTH_REJECTED: ' + signUpError.message);
        }
        
        if (!signUpData.session) {
           throw new Error('BLOCKED: Supabase "Email Confirmations" are turned ON. You must disable Email Confirmations in your Supabase Auth Settings to allow this hardcoded bypass to work.');
        }
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard'); // Since it's isolated, root dashboard is just /dashboard
        router.refresh();
      }, 800);

    } catch (err: any) {
      setError(err.message?.toUpperCase() || 'HANDSHAKE_FAILED');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-slate-300 font-sans p-6 overflow-hidden relative selection:bg-purple-500/30">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="w-full max-w-md bg-[#0A0A0A]/90 backdrop-blur-md border border-slate-800 rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden z-10">
        <div className="bg-[#050505] px-4 py-3 flex items-center border-b border-slate-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="ml-4 font-mono text-xs text-slate-500 flex items-center">
             sudo /sys/admin_login.sh
          </div>
        </div>
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-purple-950/50 border border-purple-500/50 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.3)]">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
          </div>
          <h2 className="text-2xl font-mono font-bold text-center text-white mb-2 uppercase tracking-widest text-purple-100 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">Root Access</h2>
          <p className="font-mono text-[10px] sm:text-xs text-center text-slate-500 mb-6 uppercase tracking-widest">
             Restricted DigitalHeroes Network Terminal
          </p>
          
          {error && (
            <div className="mb-6 bg-red-950/50 border border-red-500/50 p-4 rounded text-red-500 font-mono text-xs sm:text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <div className="flex items-start mb-1">
                <ShieldAlert className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                <span className="font-bold tracking-widest">FATAL: INTRUSION_BLOCKED</span>
              </div>
              <div className="pl-6 text-red-400/80 mt-2 border-l-2 border-red-500/30">
                <span className="text-slate-500 mr-2">$</span> {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-6 bg-purple-950/50 border border-purple-500/50 p-4 rounded text-purple-400 font-mono text-sm shadow-[0_0_15px_rgba(168,85,247,0.2)] text-center tracking-widest uppercase font-bold animate-pulse">
              [ ACCESS GRANTED ]
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">RESTRICTED_EMAIL</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#050505] border border-slate-700 rounded px-4 py-3 text-white font-mono focus:border-purple-500 focus:outline-none focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all placeholder:text-slate-600" 
                placeholder="admin@dheroes.com" 
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AUTH_KEY</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#050505] border border-slate-700 rounded px-4 py-3 text-white font-mono focus:border-purple-500 focus:outline-none focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all placeholder:text-slate-600" 
                placeholder="••••••••" 
              />
            </div>
            <button 
              type="submit" 
              disabled={isLoading || success}
              className="w-full py-4 mt-2 bg-purple-900 border border-purple-500 text-purple-100 font-mono text-sm font-bold tracking-widest uppercase hover:bg-purple-500 hover:text-white transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '[ EXECUTING... ]' : '[ ATTEMPT: OVERRIDE ]'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
