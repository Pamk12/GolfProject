'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Users, Database, ShieldAlert, Cpu, Activity, Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getLinkClass = (path: string) => {
    const isActive = pathname === path || pathname?.startsWith(path + '/');
    return isActive 
      ? "flex items-center px-4 py-3 bg-purple-950/20 border border-purple-500/20 text-purple-400 rounded font-mono text-xs sm:text-sm tracking-widest transition-all group"
      : "flex items-center px-4 py-3 text-slate-400 hover:text-purple-400 hover:bg-slate-800/50 border border-transparent hover:border-slate-700 rounded font-mono text-xs sm:text-sm tracking-widest transition-all group";
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-950 font-sans selection:bg-purple-500/30 md:items-stretch">
      
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-40 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-purple-950 border border-purple-500/50 rounded flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.3)]">
             <Terminal className="w-4 h-4 text-purple-400" />
           </div>
           <span className="font-mono font-bold text-white tracking-widest uppercase text-lg">Admin<span className="text-purple-500">_NET</span></span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-400 hover:text-purple-400 focus:outline-none">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 transform ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:sticky md:top-0 md:self-stretch md:translate-x-0 md:h-screen transition-transform duration-300 ease-in-out w-72 bg-slate-900 border-l md:border-l-0 md:border-r border-slate-800 text-slate-300 flex flex-col flex-shrink-0 shadow-[-4px_0_24px_rgba(0,0,0,0.5)] md:shadow-[4px_0_24px_rgba(0,0,0,0.5)] z-50`}>
        <div className="absolute top-0 left-[-50%] w-[150%] h-[30%] bg-purple-500/5 blur-3xl pointer-events-none"></div>
        <div className="hidden md:flex p-6 border-b border-slate-800 items-center gap-3 relative z-10">
          <div className="w-8 h-8 bg-purple-950 border border-purple-500/50 rounded flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.3)]">
            <Terminal className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-mono font-bold text-white tracking-widest uppercase">
            Admin<span className="text-purple-500">_NET</span>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 relative z-10 overflow-y-auto">
          <div className="font-mono text-[10px] text-slate-500 mb-4 px-4 uppercase tracking-widest font-bold">Core_Modules</div>
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/dashboard')}>
            <Activity className="w-4 h-4 mr-3 group-hover:text-purple-300" /> [ SYS_METRICS ]
          </Link>
          <Link href="/users" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/users')}>
            <Users className="w-4 h-4 mr-3 group-hover:text-purple-300" /> [ USER_REGISTRY ]
          </Link>
          <Link href="/draws" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/draws')}>
            <Cpu className="w-4 h-4 mr-3 group-hover:text-purple-300" /> [ RNG_ROUTING ]
          </Link>
          <div className="font-mono text-[10px] text-slate-500 mt-10 mb-4 px-4 uppercase tracking-widest font-bold">Verification</div>
          <Link href="/charities" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/charities')}>
            <Heart className="w-4 h-4 mr-3 group-hover:text-purple-300" /> [ CHARITY_REGISTRY ]
          </Link>
          <Link href="/verification" onClick={() => setIsMobileMenuOpen(false)} className={getLinkClass('/verification')}>
            <ShieldAlert className="w-4 h-4 mr-3 group-hover:text-red-300" /> [ AUDIT_LOGS ]
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800 relative z-10 bg-slate-900">
          <button className="w-full px-4 py-3 text-left font-mono text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-white hover:bg-slate-800 rounded transition-colors flex items-center border border-transparent hover:border-slate-700">
            <span className="text-red-500 mr-2 font-bold">$</span> kill_session()
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when sidebar is open */}
      {isMobileMenuOpen && (
        <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden" />
      )}

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden p-4 sm:p-6 md:p-10 relative">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
