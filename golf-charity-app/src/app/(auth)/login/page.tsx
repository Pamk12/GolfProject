'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [wrongPasswordCount, setWrongPasswordCount] = useState(0);
  const [linkSent, setLinkSent] = useState(false);

  const handleSendLoginLink = async () => {
    if (!email.trim()) {
      setError('UID_EMAIL REQUIRED');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setLinkSent(false);

    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (otpError) throw otpError;

      setLinkSent(true);
    } catch (err: any) {
      setError(err.message?.toUpperCase() || 'LINK_DISPATCH_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!email.trim() || !password.trim()) {
        throw new Error('Vector packets cannot be empty.');
      }

      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message.toLowerCase().includes('credentials') || signInError.message.toLowerCase().includes('invalid')) {
          setWrongPasswordCount(prev => prev + 1);
          setError('INVALID CREDENTIALS. CHECK YOUR KEY OR USE A LOGIN LINK.');
          setIsLoading(false);
          return;
        }
        throw signInError;
      }

      setSuccess(true);
      
      setTimeout(() => {
        window.location.href = '/user/dashboard';
      }, 800);

    } catch (err: any) {
      setError(err.message?.toUpperCase() || 'HANDSHAKE_FAILED');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300 font-sans p-6 overflow-hidden relative selection:bg-cyan-500/30">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.15)] overflow-hidden z-10">
        <div className="bg-slate-900 px-4 py-3 flex items-center border-b border-slate-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="ml-4 font-mono text-xs text-slate-500">auth_protocol.exe</div>
        </div>
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-cyan-950 border border-cyan-400/50 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              <Lock className="w-8 h-8 text-cyan-400" />
            </div>
          </div>
          <h2 className="text-2xl font-mono font-bold text-center text-white mb-2 uppercase tracking-widest">System Login</h2>
          <p className="font-mono text-[10px] sm:text-xs text-center text-cyan-400 mb-6 animate-pulse">&gt; AWAITING CREDENTIALS...</p>
          
          {error && (
            <div className="mb-6 bg-red-950/50 border border-red-500/50 p-4 rounded text-red-500 font-mono text-xs sm:text-sm shadow-[0_0_15px_rgba(239,68,68,0.2)]">
              <div className="flex items-start mb-1">
                <AlertTriangle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
                <span className="font-bold tracking-widest">ERROR: HANDSHAKE_FAILED</span>
              </div>
              <div className="pl-6 text-red-400/80 mt-2 border-l-2 border-red-500/30">
                <span className="text-slate-500 mr-2">$</span> {error}
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-950/50 border border-green-500/50 p-4 rounded text-green-500 font-mono text-xs sm:text-sm shadow-[0_0_15px_rgba(74,222,128,0.2)]">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="font-bold tracking-widest">CLEARANCE_GRANTED // ROUTING</span>
              </div>
            </div>
          )}

          {linkSent && (
            <div className="mb-6 bg-cyan-950/50 border border-cyan-500/50 p-4 rounded text-cyan-500 font-mono text-xs sm:text-sm shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="font-bold tracking-widest">LOGIN LINK DISPATCHED TO UID_EMAIL</span>
              </div>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">UID_EMAIL</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all placeholder:text-slate-600" 
                placeholder="user@domain.com" 
              />
            </div>
            <div>
              <label className="block font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">AUTH_KEY</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all placeholder:text-slate-600" 
                placeholder="••••••••" 
              />
            </div>
            <div className="space-y-4 pt-2">
              <button 
                type="submit" 
                disabled={isLoading || success}
                className="w-full py-4 bg-cyan-950 border border-cyan-400 text-cyan-400 font-mono text-sm font-bold tracking-widest uppercase hover:bg-cyan-400 hover:text-slate-950 transition-all hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '[ EXECUTING... ]' : '[ EXECUTE: VERIFY ]'}
              </button>

              {wrongPasswordCount > 0 && (
                <button
                  type="button"
                  onClick={handleSendLoginLink}
                  disabled={isLoading || success || linkSent}
                  className="w-full py-3 bg-transparent border border-slate-700 text-slate-400 font-mono text-xs font-bold tracking-widest uppercase hover:border-cyan-400 hover:text-cyan-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  [ REQUIRE LOGIN LINK INSTEAD ]
                </button>
              )}
            </div>
          </form>
          
          <div className="mt-6 text-center space-y-4">
            <Link href="/register" className="block font-mono text-xs text-slate-500 hover:text-cyan-400 transition-colors uppercase">
              // New Node? Initialize Here.
            </Link>            
            <Link href="/" className="block font-mono text-xs text-slate-500 hover:text-cyan-400 transition-colors uppercase">
              &lt; RETURN_TO_ROOT
            </Link>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <p className="font-sans text-[10px] sm:text-xs text-slate-500 leading-relaxed">
              Digital Heroes turns your golf scores into charity funding. Subscribe, enter 5 scores per month, and the algorithm handles the rest — prizes for you, impact for the world.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
