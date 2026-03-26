'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClasses = (path: string) => {
    // Exact match for home, partial match for others (e.g. /charities/id)
    const isActive = path === '/' ? pathname === '/' : pathname.startsWith(path);
    
    return `px-4 py-2 font-mono text-xs lg:text-sm uppercase tracking-wider rounded transition-all ${
      isActive 
        ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
        : 'text-slate-400 border border-transparent hover:text-cyan-400 hover:bg-slate-800/50 hover:border-slate-700'
    }`;
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / System ID */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center group">
              <Terminal className="h-6 w-6 text-cyan-500 mr-2 group-hover:text-amber-400 transition-colors" />
              <span className="font-mono font-bold text-white tracking-widest text-lg group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all">
                D_HEROES<span className="text-cyan-500 animate-pulse">_</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-2 lg:space-x-4">
              <Link href="/" className={getLinkClasses('/')}>
                [ /home ]
              </Link>
              <Link href="/charities" className={getLinkClasses('/charities')}>
                [ /active_nodes ]
              </Link>
              <Link href="/user/dashboard" className={getLinkClasses('/user/dashboard')}>
                [ /telemetry_dash ]
              </Link>
            </div>
          </div>

          {/* Auth Terminal Connect */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-amber-500 hover:text-amber-400 font-mono text-sm tracking-widest border border-amber-500/30 bg-amber-950/20 px-4 py-1.5 rounded hover:bg-amber-900/40 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all flex items-center"
            >
              $ ./init_auth
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-400 hover:text-cyan-400 focus:outline-none p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 relative z-40 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div className="px-4 pt-2 pb-6 space-y-3 flex flex-col">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className={getLinkClasses('/')}>
              [ /home ]
            </Link>
            <Link href="/charities" onClick={() => setIsMenuOpen(false)} className={getLinkClasses('/charities')}>
              [ /active_nodes ]
            </Link>
            <Link href="/user/dashboard" onClick={() => setIsMenuOpen(false)} className={getLinkClasses('/user/dashboard')}>
              [ /telemetry_dash ]
            </Link>
            <div className="pt-4 border-t border-slate-800">
              <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full text-center block text-amber-500 font-mono text-sm tracking-widest border border-amber-500/30 bg-amber-950/20 px-4 py-3 rounded uppercase">
                $ ./init_auth [CONNECT]
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
