import Link from "next/link";
import { Terminal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-slate-800 text-slate-500 py-16 relative overflow-hidden">
      {/* Background glow lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        <div className="col-span-1 md:col-span-2 text-left">
          <Link href="/" className="group flex items-center gap-3 mb-6 inline-flex">
            <div className="w-8 h-8 bg-cyan-950 border border-cyan-400/30 flex items-center justify-center">
              <Terminal className="w-4 h-4 text-cyan-500" />
            </div>
            <span className="text-xl font-bold font-mono text-slate-300 tracking-widest">
              D_HEROES<span className="text-cyan-500">_</span>
            </span>
          </Link>
          <div className="font-mono text-xs text-slate-600 max-w-sm mb-4 leading-relaxed bg-slate-950 border border-slate-800 p-4 rounded border-l-2 border-l-slate-700">
            <span className="text-slate-500 block mb-1">/**</span>
            * Core telemetry and liquidity routing protocol. 
            * Processing verified athletic output into scalable
            * philanthropic allocations globally.
            <span className="text-slate-500 block mt-1">*/</span>
          </div>
        </div>
        
        {/* Directories */}
        <div>
          <h4 className="text-slate-300 font-mono font-bold mb-6 tracking-widest uppercase text-xs flex items-center">
            <span className="text-cyan-500 mr-2">+</span> SYSTEM_DIRS
          </h4>
          <ul className="space-y-3 text-xs font-mono">
            <li><Link href="/" className="hover:text-cyan-400 hover:pl-2 transition-all block">cd /home/overview</Link></li>
            <li><Link href="/charities" className="hover:text-cyan-400 hover:pl-2 transition-all block">cd /sys/active_nodes</Link></li>
            <li><Link href="/user/dashboard" className="hover:text-cyan-400 hover:pl-2 transition-all block">cd /usr/telemetry_dash</Link></li>
            <li><Link href="/login" className="hover:text-cyan-400 hover:pl-2 transition-all block text-amber-500/80">./init_auth.sh</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-slate-300 font-mono font-bold mb-6 tracking-widest uppercase text-xs flex items-center">
            <span className="text-fuchsia-500 mr-2">+</span> PROTOCOLS
          </h4>
          <ul className="space-y-3 text-xs font-mono">
            <li><a href="#" className="hover:text-fuchsia-400 hover:pl-2 transition-all block">Terms of Service _v1.2</a></li>
            <li><a href="#" className="hover:text-fuchsia-400 hover:pl-2 transition-all block">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-fuchsia-400 hover:pl-2 transition-all block">RNG_Draw Rules</a></li>
            <li><a href="#" className="hover:text-fuchsia-400 hover:pl-2 transition-all block text-green-500/80">ping support_node</a></li>
          </ul>
        </div>
      </div>
      
      {/* End Footer Base */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-6 border-t border-slate-800 text-xs font-mono text-center md:text-left flex flex-col md:flex-row justify-between items-center text-slate-600 gap-4">
        <p>
          <span className="text-cyan-500">&gt;</span> SYSTEM.COPYRIGHT [ {new Date().getFullYear()} ] DIGITAL_HEROES_PROTOCOL.
        </p>
        <div className="flex gap-4 opacity-50">
          <span>SEC: ENCRYPTED</span>
          <span>UPTIME: 99.99%</span>
        </div>
      </div>
    </footer>
  );
}
