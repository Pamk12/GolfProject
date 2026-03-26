'use client';
import { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';

export default function CharityFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('All Sectors');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const options = [
    { value: 'ALL', label: 'All Sectors' },
    { value: 'HEALTH', label: 'Health & Medical' },
    { value: 'EDU', label: 'Education' },
    { value: 'CLIMATE', label: 'Climate & Environment' },
    { value: 'COMMUNITY', label: 'Community' },
  ];

  return (
    <div ref={dropdownRef} className="sm:w-64 relative flex items-center bg-slate-900/80 border border-slate-700 rounded-lg group focus-within:border-fuchsia-400 focus-within:shadow-[0_0_15px_rgba(232,121,249,0.2)] transition-all">
      <div className="pl-3 sm:pl-4 text-fuchsia-500 font-mono font-bold text-sm shrink-0">Filter</div>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-transparent px-3 py-3 sm:py-4 text-white font-mono text-sm text-left focus:outline-none flex justify-between items-center"
      >
        <span className="truncate pr-2">{selected}</span>
        <Filter className={`w-4 h-4 shrink-0 transition-colors ${isOpen ? 'text-fuchsia-400' : 'text-slate-500 group-hover:text-fuchsia-400'}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+8px)] right-0 w-full sm:w-auto min-w-[200px] max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-50 overflow-hidden transform origin-top-right">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setSelected(opt.label); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 font-mono text-sm transition-colors ${
                selected === opt.label ? 'bg-fuchsia-900/40 text-fuchsia-400' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
