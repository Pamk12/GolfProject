'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, ChevronDown } from 'lucide-react';
import { executeRngRouting } from '@/app/actions/draws';

/* ── Custom Dropdown ─────────────────────────────────────── */
function CustomSelect({ 
  value, onChange, options, accentColor 
}: { 
  value: string; 
  onChange: (v: string) => void; 
  options: { value: string; label: string }[];
  accentColor: 'purple' | 'cyan';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.value === value);
  const borderOpen = accentColor === 'purple' ? 'border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.3)]' : 'border-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.3)]';
  const hoverColor = accentColor === 'purple' ? 'hover:bg-purple-950/40 hover:text-purple-300' : 'hover:bg-cyan-950/40 hover:text-cyan-300';

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full bg-slate-900 border ${open ? borderOpen : 'border-slate-700'} text-white rounded p-2 text-xs sm:text-sm font-mono text-left flex items-center justify-between transition-all`}
      >
        <span className="truncate">{selected?.label}</span>
        <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ml-2 transition-transform ${open ? 'rotate-180' : ''} text-slate-400`} />
      </button>
      {open && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded shadow-[0_8px_24px_rgba(0,0,0,0.6)] overflow-hidden">
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs sm:text-sm font-mono transition-colors ${
                opt.value === value ? (accentColor === 'purple' ? 'bg-purple-950/50 text-purple-400' : 'bg-cyan-950/50 text-cyan-400') : 'text-slate-300'
              } ${hoverColor}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ──────────────────────────────────────── */
export function ExecuteDrawButton() {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'simulation' | 'published'>('simulation');
  const [logic, setLogic] = useState<'random' | 'algorithmic'>('random');
  
  const [result, setResult] = useState<{
    success: boolean;
    mode?: string;
    logic?: string;
    winningNumbers: number[];
    prizePool: number;
    metrics: {
      monthly: { t1: number; t2: number; t3: number };
      yearly: { t1: number; t2: number; t3: number };
      demo: { t1: number; t2: number; t3: number };
    };
    rollover?: boolean;
  } | null>(null);

  const handleExecute = async () => {
    let proceed = true;
    if (mode === 'published') {
      proceed = confirm('WARNING: Publishing the draw will finalize data and route funds! Are you absolute sure?');
    }
    
    if (proceed) {
      setLoading(true);
      try {
        const res = await executeRngRouting(mode, logic);
        setResult(res);
      } catch (e: any) {
        alert('Error executing draw: ' + e.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="mt-4 sm:mt-8 flex flex-col items-center w-full">
      <div className="bg-[#050505] border border-slate-800 p-3 sm:p-4 rounded-xl mb-4 sm:mb-6 flex flex-col sm:flex-row gap-3 sm:gap-6 w-full sm:w-auto">
        <label className="flex flex-col text-xs font-mono text-slate-400 min-w-0 sm:min-w-[180px]">
          <span className="uppercase tracking-widest mb-2 text-purple-400 text-[10px] sm:text-xs">Execution Mode</span>
          <CustomSelect
            value={mode}
            onChange={v => setMode(v as any)}
            accentColor="purple"
            options={[
              { value: 'simulation', label: 'DRY-RUN / SIM' },
              { value: 'published', label: 'LIVE / PUBLISH' },
            ]}
          />
        </label>
        
        <label className="flex flex-col text-xs font-mono text-slate-400 min-w-0 sm:min-w-[180px]">
          <span className="uppercase tracking-widest mb-2 text-cyan-400 text-[10px] sm:text-xs">Hash Logic</span>
          <CustomSelect
            value={logic}
            onChange={v => setLogic(v as any)}
            accentColor="cyan"
            options={[
              { value: 'random', label: 'STANDARD (RNG)' },
              { value: 'algorithmic', label: 'WEIGHTED (ALGO)' },
            ]}
          />
        </label>
      </div>

      <button
        onClick={handleExecute}
        disabled={loading}
        className={`relative group overflow-hidden border-2 rounded-xl px-4 sm:px-8 lg:px-12 py-3 sm:py-4 lg:py-6 text-white font-mono text-xs sm:text-sm lg:text-xl font-bold uppercase tracking-widest transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:cursor-wait w-full sm:w-auto ${
          mode === 'published' 
            ? 'bg-red-950 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:bg-red-600' 
            : 'bg-purple-900 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:bg-purple-600'
        }`}
      >
        <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-[20deg] animate-[shimmer_2s_infinite]"></div>
        <div className="flex items-center justify-center relative z-10 text-center">
          <Play className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 sm:mr-3 flex-shrink-0 ${mode === 'published' ? 'text-white' : 'text-purple-200'}`} />
          <span className="text-[10px] sm:text-xs lg:text-base">{loading ? '[ EXECUTING... ]' : mode === 'published' ? '[ PUBLISH: RNG ]' : '[ SIMULATE: RNG ]'}</span>
        </div>
      </button>

      {result && (
        <div className="mt-4 sm:mt-6 w-full max-w-2xl bg-[#0A0A0A] border border-green-500/50 rounded-xl p-3 sm:p-4 lg:p-6 font-mono shadow-[0_0_20px_rgba(34,197,94,0.3)] relative">
          {result.mode === 'simulation' && (
            <div className="absolute -top-3 -right-3 bg-purple-500 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-widest rotate-12 shadow-[0_0_10px_rgba(168,85,247,0.8)]">
              SIM ONLY
            </div>
          )}
          <h3 className="text-green-400 font-bold uppercase tracking-widest text-xs sm:text-sm lg:text-lg mb-3 sm:mb-4 text-center">Protocol Executed Successfully</h3>
          <div className="space-y-2 text-slate-300 text-xs sm:text-sm">
            <p><span className="text-purple-400">HASH:</span> [ {result.winningNumbers.join(' | ')} ]</p>
            <p><span className="text-purple-400">POOL:</span> ${result.prizePool.toLocaleString()}</p>
            
            {/* Monthly Subscribers */}
            <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-2 sm:pt-3 mt-2 sm:mt-3">
              <span className="text-[10px] sm:text-xs text-green-400 uppercase font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                Monthly Subscribers (Payout Eligible)
              </span>
              <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-[11px] sm:text-sm">
                <span>T1 Jackpot: <span className="text-amber-400">{result.metrics.monthly.t1}</span></span>
                <span>T2: <span className="text-amber-400">{result.metrics.monthly.t2}</span></span>
                <span>T3: <span className="text-amber-400">{result.metrics.monthly.t3}</span></span>
              </div>
            </div>

            {/* Yearly Subscribers */}
            <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-2 sm:pt-3 mt-2 sm:mt-3">
              <span className="text-[10px] sm:text-xs text-blue-400 uppercase font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                Yearly Subscribers (Payout Eligible)
              </span>
              <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-[11px] sm:text-sm">
                <span>T1 Jackpot: <span className="text-amber-400">{result.metrics.yearly.t1}</span></span>
                <span>T2: <span className="text-amber-400">{result.metrics.yearly.t2}</span></span>
                <span>T3: <span className="text-amber-400">{result.metrics.yearly.t3}</span></span>
              </div>
            </div>

            {/* Demo Accounts */}
            <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-2 sm:pt-3 mt-2 sm:mt-3">
              <span className="text-[10px] sm:text-xs text-slate-500 uppercase font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                Demo Accounts (No Payouts)
              </span>
              <div className="flex flex-col sm:flex-row sm:gap-4 gap-1 text-[11px] sm:text-sm">
                <span>T1 Predicts: <span className="text-cyan-400">{result.metrics.demo.t1}</span></span>
                <span>T2: <span className="text-cyan-400">{result.metrics.demo.t2}</span></span>
                <span>T3: <span className="text-cyan-400">{result.metrics.demo.t3}</span></span>
              </div>
            </div>

            {result.rollover && (
              <p className="text-red-400 font-bold animate-pulse uppercase tracking-widest mt-3 text-[10px] sm:text-xs text-center">
                &gt; NO PAID T1 MATCH. JACKPOT ROLLED OVER.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
