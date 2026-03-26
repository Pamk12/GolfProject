'use client';
import { useState } from 'react';
import { submitTelemetry } from '@/app/actions/scores';
import { createCheckoutSession } from '@/app/actions/stripe';

export default function ScoreEntryForm() {
  const [scores, setScores] = useState(['', '', '', '', '']);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSubModal, setShowSubModal] = useState(false);
  const [charityYield, setCharityYield] = useState<number>(10);

  const handleChange = (index: number, val: string) => {
    // Strict Input Clamping
    let sanitizedVal = val;
    // Remove leading zeros
    if (sanitizedVal.length > 1 && sanitizedVal.startsWith('0')) {
      sanitizedVal = sanitizedVal.replace(/^0+/, '');
    }
    
    if (sanitizedVal !== '') {
      const num = parseInt(sanitizedVal, 10);
      if (isNaN(num)) return; // block non-numbers
      if (num < 1) sanitizedVal = '1';
      if (num > 45) sanitizedVal = '45';
    }

    const newScores = [...scores];
    newScores[index] = sanitizedVal;
    setScores(newScores);
    
    // Reset status if user starts typing again
    if (status !== 'idle' && status !== 'loading') {
      setStatus('idle');
      setErrorMessage('');
    }
  };

  const executeSubmit = async () => {
    setStatus('loading');
    setErrorMessage('');
    setShowSubModal(false);

    const numericScores = scores.map(s => parseInt(s, 10));
    // Provide the current ISO date without time component for playDate
    const playDate = new Date().toISOString().split('T')[0];

    try {
      const result = await submitTelemetry(numericScores, playDate, charityYield, 'demo');
      
      if (result.success) {
        setStatus('success');
        setScores(['', '', '', '', '']); // Clear form
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Uplink transmission failed.');
      }
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'System fault during execution.');
    }
  };

  const handleStripe = async (interval: 'month' | 'year') => {
    setStatus('loading');
    setShowSubModal(false);

    // Secure payload synchronization BEFORE checkout sequence
    const numericScores = scores.map(s => parseInt(s, 10));
    const playDate = new Date().toISOString().split('T')[0];
    const requestedTier = interval === 'month' ? 'monthly' : 'yearly';
    
    const result = await submitTelemetry(numericScores, playDate, charityYield, requestedTier);
    if (!result.success) {
      setStatus('error');
      setErrorMessage(result.error || 'Failed to sync telemetry before protocol escalation.');
      return;
    }

    const res = await createCheckoutSession(interval);
    if (res.url) {
      window.location.href = res.url;
    } else {
      setStatus('error');
      setErrorMessage(res.error || 'Failed to initialize payment gateway.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (scores.some(s => s === '')) {
      setStatus('error');
      setErrorMessage('Vector compilation failed: 5 integers required.');
      return;
    }
    setShowSubModal(true);
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="grid grid-cols-5 gap-2 sm:gap-4">
        {scores.map((score, idx) => (
          <div key={idx} className="flex flex-col items-center group relative">
            <label className="font-mono text-[10px] text-slate-500 mb-3 tracking-widest group-focus-within:text-amber-400 transition-colors">ARR[{idx}]</label>
            <div className="absolute inset-0 top-6 bg-amber-500/5 opacity-0 group-focus-within:opacity-100 blur transition-all point-events-none rounded"></div>
            <input 
              type="number" 
              min="1" 
              max="45"
              value={score}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="relative z-10 w-full text-center bg-slate-950 border border-slate-700/80 rounded py-4 text-white font-mono text-xl sm:text-2xl font-bold focus:border-amber-400 focus:text-amber-400 focus:outline-none focus:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all placeholder:text-slate-800 disabled:opacity-50"
              placeholder="00"
              required
              disabled={status === 'loading'}
            />
          </div>
        ))}
      </div>
      
      <div className="pt-6 border-t border-slate-800 space-y-6">
        
        {/* Yield Slider Embedded Component */}
        <div className="bg-slate-950 border border-slate-800 rounded p-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-mono text-xs text-slate-400 font-bold tracking-widest uppercase">Target Charity Yield</span>
            <span className="font-mono text-lg text-green-400 font-bold">{charityYield}% ROUTED</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="100" 
            step="5"
            value={charityYield}
            onChange={(e) => setCharityYield(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            disabled={status === 'loading'}
          />
          <div className="flex justify-between mt-2 font-mono text-[10px] text-slate-500">
            <span>MIN: 10%</span>
            <span>MAX: 100%</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className={`font-mono text-xs w-full p-4 rounded border flex-grow transition-colors duration-300 ${
          status === 'error' ? 'bg-red-950/20 border-red-500/30 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.1)]' :
          status === 'success' ? 'bg-green-950/20 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.1)]' :
          status === 'loading' ? 'bg-amber-950/20 border-amber-500/30 text-amber-400' :
          'bg-[#0A0A0A] border-slate-800 text-slate-500'
        }`}>
          {status === 'idle' && (
            <>
              <span className="text-amber-500 font-bold mr-2 animate-pulse">&gt;</span> 
              <span className="opacity-80">Awaiting vector compilation... [5 integer requirement]</span>
            </>
          )}
          
          {status === 'loading' && (
            <>
              <span className="text-amber-400 font-bold mr-2 animate-pulse">&gt;</span> 
              <span className="opacity-100 animate-pulse">EXECUTING UPLINK ROUTINE... PLEASE WAIT.</span>
            </>
          )}
          
          {status === 'success' && (
            <>
               <span className="text-green-400 font-bold mr-2">&gt;</span> 
               <span className="opacity-100 tracking-widest font-bold">UPLINK ACKNOWLEDGED // PAYLOAD SECURED</span>
            </>
          )}
          
          {status === 'error' && (
            <>
               <span className="text-red-500 font-bold mr-2">&gt;</span> 
               <span className="opacity-100">ERROR: {errorMessage}</span>
            </>
          )}
        </div>
        
        <button 
          type="submit" 
          disabled={status === 'loading'}
          className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-amber-950/40 border-2 border-amber-500 text-amber-500 font-mono text-sm font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '[ PROCESSING ]' : '[ EXECUTE_UPLINK ]'}
        </button>
        </div>
      </div>

      {showSubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-amber-500/50 rounded-xl p-6 sm:p-8 max-w-md w-full shadow-[0_0_30px_rgba(251,191,36,0.15)] relative">
            <h3 className="font-mono text-xl font-bold text-white mb-2 uppercase">Uplink Gateway</h3>
            <p className="font-sans text-sm text-slate-400 mb-6">
              To commit telemetry to the global draw, an active subscription is required. 10% routes directly to your Charity Node.
            </p>
            
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleStripe('month')}
                className="w-full py-4 px-4 bg-amber-950/30 border border-amber-500/50 text-amber-400 font-mono text-sm font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all flex justify-between items-center"
              >
                <span>Monthly Subscription</span>
                <span>$10/mo</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleStripe('year')}
                className="w-full py-4 px-4 bg-cyan-950/30 border border-cyan-500/50 text-cyan-400 font-mono text-sm font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-slate-950 transition-all flex justify-between items-center"
              >
                <span>Yearly Subscription</span>
                <span>$100/yr</span>
              </button>

              <div className="pt-4 mt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={executeSubmit}
                  className="w-full py-3 px-4 bg-transparent border border-slate-700 text-slate-500 font-mono text-xs font-bold uppercase tracking-widest hover:border-slate-500 hover:text-slate-300 transition-all"
                >
                  Bypass with Demo Account
                </button>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={() => setShowSubModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white"
            >
              [X]
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
