'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Terminal, Menu, X, UserCircle, CreditCard, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

          {/* Auth Terminal Connect & Mobile Controls */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {session ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-1 sm:gap-2 text-slate-300 hover:text-cyan-400 font-mono text-xs sm:text-sm tracking-widest border border-slate-700 bg-slate-800/50 px-2 sm:px-3 py-1.5 rounded hover:border-cyan-500/50 hover:bg-cyan-950/30 transition-all focus:outline-none"
                >
                  <UserCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">SYS_OP</span>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-md shadow-lg py-1 z-50 overflow-hidden">
                    <Link href="/user/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-3 text-sm font-mono text-slate-300 hover:bg-slate-800 hover:text-cyan-400 relative overflow-hidden group">
                      <LayoutDashboard className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    <Link href="/user/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-3 text-sm font-mono text-slate-300 hover:bg-slate-800 hover:text-cyan-400">
                      <Settings className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link href="/user/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center px-4 py-3 text-sm font-mono text-amber-500 hover:bg-slate-800 hover:text-amber-400 border-t border-slate-800">
                      <CreditCard className="w-4 h-4 mr-3" />
                      Subscription
                    </Link>
                    <button onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      setIsProfileOpen(false);
                    }} className="w-full text-left flex items-center px-4 py-3 text-sm font-mono text-rose-400 hover:bg-slate-800 hover:text-rose-300 border-t border-slate-800">
                      <LogOut className="w-4 h-4 mr-3" />
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex">
                <Link 
                  href="/login" 
                  className="text-amber-500 hover:text-amber-400 font-mono text-sm tracking-widest border border-amber-500/30 bg-amber-950/20 px-4 py-1.5 rounded hover:bg-amber-900/40 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all flex items-center"
                >
                  $ ./init_auth
                </Link>
              </div>
            )}

            {/* Mobile menu button (Hamburger) */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-400 hover:text-cyan-400 focus:outline-none p-1 sm:p-2"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 right-0 w-[40vw] min-w-[200px] h-[calc(100vh-4rem)] bg-slate-900 border-l border-slate-800 z-40 shadow-[-10px_10px_30px_rgba(0,0,0,0.8)] overflow-hidden transform origin-top-right transition-all flex flex-col justify-between">
          <div className="flex flex-col py-6 space-y-6 overflow-y-auto flex-1">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className={`mx-4 ${getLinkClasses('/')}`}>
              [ /home ]
            </Link>
            <Link href="/charities" onClick={() => setIsMenuOpen(false)} className={`mx-4 ${getLinkClasses('/charities')}`}>
              [ /active_nodes ]
            </Link>
            <Link href="/user/dashboard" onClick={() => setIsMenuOpen(false)} className={`mx-4 ${getLinkClasses('/user/dashboard')}`}>
              [ /telemetry_dash ]
            </Link>
            
            <div className="pt-6 mt-auto border-t border-slate-800 w-full mb-4">
              {session ? (
                <div className="flex flex-col space-y-2">
                  <Link href="/user/profile" onClick={() => setIsMenuOpen(false)} className="w-full text-left flex items-center text-amber-500 font-mono text-xs tracking-widest px-6 py-4 hover:bg-slate-800 uppercase">
                    [ SYS_CONFIG ]
                  </Link>
                  <button onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      setIsMenuOpen(false);
                    }} className="w-full text-left flex items-center text-rose-400 font-mono text-xs tracking-widest px-6 py-4 border-t border-slate-800 hover:bg-slate-800 uppercase">
                    [ DISCONNECT ]
                  </button>
                </div>
              ) : (
                <div className="px-4 pb-4 pt-2">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full justify-center flex text-center text-amber-500 font-mono text-xs tracking-widest border border-amber-500/30 bg-amber-950/20 px-4 py-3 rounded uppercase hover:bg-amber-900/40 hover:shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all">
                    $ ./init_auth
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
