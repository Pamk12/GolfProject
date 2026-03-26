'use client';
import { useState } from 'react';
import { updateCharityYield } from '@/app/actions/userSettings';

export default function CharityUpgradeForm({ currentYield }: { currentYield: number }) {
  const [percent, setPercent] = useState(currentYield);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await updateCharityYield(percent);
      if (res.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleUpdate} className="mt-6 pt-4 border-t border-slate-800 relative z-10">
      <div className="flex justify-between items-center font-mono text-xs mb-2 uppercase">
        <span className="text-slate-500">Voluntary Allocation</span>
        <span className="text-cyan-400 font-bold text-sm tracking-widest">{percent}%</span>
      </div>
      
      <input 
        type="range" 
        min="10" 
        max="100" 
        step="5"
        value={percent} 
        onChange={(e) => setPercent(parseInt(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 mb-4"
      />
      
      <button 
        type="submit" 
        disabled={status === 'loading' || percent === currentYield}
        className="w-full text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-950/40 border border-cyan-500/50 text-cyan-400 py-2 hover:bg-cyan-500 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'CONFIGURING...' : status === 'success' ? 'YIELD UPDATED' : 'CONFIRM ROUTING PROTOCOL'}
      </button>
    </form>
  );
}
