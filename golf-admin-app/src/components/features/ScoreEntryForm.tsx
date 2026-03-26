'use client';
import { useState } from 'react';

export default function ScoreEntryForm() {
  const [scores, setScores] = useState(['', '', '', '', '']);

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
  };

  return (
    <form className="space-y-8">
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
              className="relative z-10 w-full text-center bg-slate-950 border border-slate-700/80 rounded py-4 text-white font-mono text-xl sm:text-2xl font-bold focus:border-amber-400 focus:text-amber-400 focus:outline-none focus:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all placeholder:text-slate-800"
              placeholder="00"
              required
            />
          </div>
        ))}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-800">
        <div className="font-mono text-xs text-slate-500 w-full bg-[#0A0A0A] p-4 rounded border border-slate-800">
          <span className="text-amber-500 font-bold mr-2 animate-pulse">&gt;</span> 
          <span className="opacity-80">Awaiting vector compilation... [5 integer requirement]</span>
        </div>
        
        <button 
          type="submit" 
          className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-amber-950/40 border-2 border-amber-500 text-amber-500 font-mono text-sm font-bold uppercase tracking-widest hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 hover:shadow-[0_0_20px_rgba(251,191,36,0.5)] whitespace-nowrap"
        >
          [ EXECUTE_UPLINK ]
        </button>
      </div>
    </form>
  )
}
