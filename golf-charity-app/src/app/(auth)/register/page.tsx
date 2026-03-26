'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Network, AlertTriangle, KeySquare, CheckCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { validateRegistrationData, validateOtpFormat } from '@/lib/authLogic';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [charities, setCharities] = useState<any[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<string>('');
  
  const [isCharityOpen, setIsCharityOpen] = useState(false);
  const charityDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (charityDropdownRef.current && !charityDropdownRef.current.contains(event.target as Node)) {
        setIsCharityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchCharities = async () => {
      const supabase = createClient();
      const { data } = await supabase.from('charities').select('id, name').order('name');
      if (data) setCharities(data);
    };
    fetchCharities();
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCharity) return setError('MUST SELECT A CHARITY');
    setIsLoading(true);
    setError(null);

    try {
      validateRegistrationData(password, confirmPassword);

      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      // Handle email enumeration protection bypass:
      if (data?.user?.identities && data.user.identities.length === 0) {
        setError('NODE ALREADY EXISTS. REDIRECTING TO LOGIN ROUTINE...');
        setTimeout(() => {
          window.location.href = '/login?error=registered';
        }, 3000);
        return;
      }

      if (signUpError) {
        if (signUpError.message.toLowerCase().includes('registered') || signUpError.message.toLowerCase().includes('already exists')) {
          setError('NODE ALREADY EXISTS. REDIRECTING TO LOGIN ROUTINE...');
          setTimeout(() => {
            window.location.href = '/login?error=registered';
          }, 3000);
          return;
        }
        throw signUpError;
      }
      
      // Move to OTP phase
      setStep('otp');
    } catch (err: any) {
      setError(err.message?.toUpperCase() || 'NODE_CREATION_FAILED');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      validateOtpFormat(otp);

      const supabase = createClient();
      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup'
      });

      if (verifyError) throw verifyError;

      if (data.user) {
         await supabase.from('users').upsert({ 
           id: data.user.id, 
           selected_charity_id: selectedCharity,
           charity_contribution_percentage: 10,
           subscription_status: 'inactive'
         });
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/user/dashboard');
        router.refresh();
      }, 1000);

    } catch (err: any) {
      setError(err.message?.toUpperCase() || 'MFA_VALIDATION_FAILED');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300 font-sans p-6 overflow-hidden relative selection:bg-amber-500/30">
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.1)] overflow-hidden z-10">
        <div className="bg-slate-900 px-4 py-3 flex items-center border-b border-slate-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="ml-4 font-mono text-xs text-slate-500">node_provision.sh</div>
        </div>
        
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-amber-950 border border-amber-400/50 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              {step === 'register' ? (
                <Network className="w-8 h-8 text-amber-400" />
              ) : (
                <KeySquare className="w-8 h-8 text-amber-400" />
              )}
            </div>
          </div>
          
          <h2 className="text-2xl font-mono font-bold text-center text-white mb-2 uppercase tracking-widest">
            {step === 'register' ? 'Provision Node' : 'MFA Required'}
          </h2>
          <p className="font-mono text-[10px] sm:text-xs text-center text-amber-400 mb-6 animate-pulse">
            {step === 'register' ? '> INITIALIZING SECURE PACKET...' : '> AWAITING 6-DIGIT OTP PAYLOAD...'}
          </p>

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
                <span className="font-bold tracking-widest">NODE_VERIFIED // ROUTING TO DASHBOARD</span>
              </div>
            </div>
          )}

          {step === 'register' ? (
            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="block font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">UID_EMAIL</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:border-amber-400 focus:outline-none focus:shadow-[0_0_10px_rgba(251,191,36,0.2)] transition-all placeholder:text-slate-600" 
                  placeholder="node@network.com" 
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">ENCRYPTION_KEY</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:border-amber-400 focus:outline-none focus:shadow-[0_0_10px_rgba(251,191,36,0.2)] transition-all placeholder:text-slate-600" 
                  placeholder="••••••••" 
                />
              </div>
              <div>
                <label className="block font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">VERIFY_KEY</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                  className="w-full bg-slate-950 border border-slate-700 rounded px-4 py-3 text-white font-mono focus:border-amber-400 focus:outline-none focus:shadow-[0_0_10px_rgba(251,191,36,0.2)] transition-all placeholder:text-slate-600" 
                  placeholder="••••••••" 
                />
              </div>
              <div className="pt-2" ref={charityDropdownRef}>
                <label className="block font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 border-t border-slate-800 pt-4 text-purple-400">SELECT_CHARITY_NODE</label>
                <div className="relative">
                  <button 
                    type="button"
                    onClick={() => setIsCharityOpen(!isCharityOpen)}
                    className="w-full bg-slate-950 border border-purple-500/30 rounded px-4 py-3 text-white font-mono focus:border-purple-400 focus:outline-none focus:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all flex justify-between items-center text-left"
                  >
                    <span className={`truncate ${!selectedCharity ? 'text-slate-500' : 'text-white'}`}>
                      {selectedCharity ? charities.find(c => c.id === selectedCharity)?.name : '-- SELECT ROUTING NODE --'}
                    </span>
                    <span className="text-purple-400/50 text-xs text-right shrink-0 ml-2">▼</span>
                  </button>
                  
                  {isCharityOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-purple-500/30 rounded shadow-[0_0_30px_rgba(0,0,0,0.8)] z-50 max-h-60 overflow-y-auto">
                      {charities.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => { setSelectedCharity(c.id); setIsCharityOpen(false); }}
                          className={`w-full text-left px-4 py-3 font-mono text-sm transition-colors border-b border-slate-800/50 last:border-0 ${
                            selectedCharity === c.id ? 'bg-purple-900/40 text-purple-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                          }`}
                        >
                          {c.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 mt-2 bg-amber-950 border border-amber-400 text-amber-400 font-mono text-sm font-bold tracking-widest uppercase hover:bg-amber-400 hover:text-slate-950 transition-all hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '[ ALLOCATING... ]' : '[ EXECUTE: PROVISION ]'}
              </button>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block font-mono text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-center text-amber-500/80">OTP sent to: {email}</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-4 pl-12 tracking-[0.5em] py-4 text-center text-white font-mono text-xl focus:border-amber-400 focus:outline-none focus:shadow-[0_0_10px_rgba(251,191,36,0.2)] transition-all placeholder:text-slate-600" 
                  placeholder="------" 
                />
              </div>
              <button 
                type="submit" 
                disabled={isLoading || success}
                className="w-full py-4 mt-2 bg-amber-950 border border-amber-400 text-amber-400 font-mono text-sm font-bold tracking-widest uppercase hover:bg-amber-400 hover:text-slate-950 transition-all hover:shadow-[0_0_15px_rgba(251,191,36,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? '[ VERIFYING... ]' : '[ VERIFY MFA_OTP ]'}
              </button>
            </form>
          )}
          
          <div className="mt-8 text-center space-y-4">
            <Link href="/login" className="block font-mono text-xs text-slate-500 hover:text-amber-400 transition-colors uppercase">
              // Existing Node? Connect Here.
            </Link>            
            <Link href="/" className="block font-mono text-xs text-slate-500 hover:text-amber-400 transition-colors uppercase">
              &lt; RETURN_TO_ROOT
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
