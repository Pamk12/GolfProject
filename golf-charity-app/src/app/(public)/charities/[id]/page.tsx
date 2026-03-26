import Link from 'next/link';
import { Terminal, Database, ArrowLeft, Activity, ShieldCheck, Server } from 'lucide-react';

export default function CharityProfilePage({ params }: { params: { id: string } }) {
  // Suppress unused var warnings if any
  const nodeId = params.id;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-cyan-900/10 blur-[100px] pointer-events-none" />
      
      <div className="w-full max-w-5xl mx-auto px-4 py-8 md:py-16 relative z-10">
        <Link href="/charities" className="inline-flex items-center text-slate-500 font-mono text-sm hover:text-cyan-400 transition-colors mb-8 group uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          cd .. (RETURN_TO_NODES)
        </Link>
        
        {/* Node Header */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] mb-8">
          <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse mr-3"></span>
              <span className="font-mono text-xs text-slate-500 tracking-widest uppercase">Node_Inspection_Protocol</span>
            </div>
            <div className="font-mono text-[10px] text-green-400 border border-green-500/20 bg-green-950/20 px-2 py-0.5 rounded">
              SECURE_CONN
            </div>
          </div>
          
          <div className="p-6 md:p-10 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden">
            {/* CSS Node Graphic */}
            <div className="relative w-32 h-32 border border-cyan-500/30 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(34,211,238,0.2)] bg-slate-950">
              <div className="absolute w-40 h-40 border border-cyan-500/10 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute w-48 h-48 border border-cyan-500/5 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
              <Server className="w-12 h-12 text-cyan-400" />
            </div>
            
            <div className="flex-grow z-10">
              <div className="flex flex-wrap items-center gap-4 mb-3">
                <h1 className="text-3xl md:text-5xl font-mono font-bold text-white uppercase tracking-tighter">GLOBAL_HEALTH_INIT</h1>
                <span className="px-3 py-1 bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold tracking-widest rounded uppercase">HEALTH_SECTOR</span>
              </div>
              
              <div className="font-mono text-xs sm:text-sm text-slate-500 mb-6 flex flex-wrap gap-4">
                <span><span className="text-slate-600">UID:</span> 0x8A22F</span>
                <span><span className="text-slate-600">UPTIME:</span> 99.9%</span>
                <span><span className="text-slate-600">LATENCY:</span> 14ms</span>
              </div>
              
              <p className="font-sans text-base md:text-lg text-slate-400 leading-relaxed max-w-2xl">
                Directing liquidity algorithms to optimize high-yield medical infrastructure and emergency response capabilities in critical global sectors. This node processes verified funding to deploy tangible medical assets.
              </p>
            </div>
          </div>
        </div>
        
        {/* Telemetry Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
            <div className="absolute inset-0 top-1/2 bg-cyan-500/5 blur-xl group-hover:bg-cyan-500/10 transition-colors"></div>
            <div className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2 relative z-10">Total Funds Routed</div>
            <div className="font-mono text-3xl font-bold text-cyan-400 relative z-10">$1.2M</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-green-500/30 transition-colors">
            <div className="absolute inset-0 top-1/2 bg-green-500/5 blur-xl group-hover:bg-green-500/10 transition-colors"></div>
            <div className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2 relative z-10">Impact Operations</div>
            <div className="font-mono text-3xl font-bold text-green-400 relative z-10">14,250</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl relative overflow-hidden group hover:border-amber-500/30 transition-colors">
            <div className="absolute inset-0 top-1/2 bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-colors"></div>
            <div className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2 relative z-10">Routing Efficiency</div>
            <div className="font-mono text-3xl font-bold text-amber-400 relative z-10">92.4%</div>
          </div>
        </div>

        {/* Live Event Ticker */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <div className="bg-slate-900 px-6 py-4 flex items-center justify-between border-b border-slate-800">
            <h3 className="font-mono text-sm font-bold text-white uppercase tracking-widest flex items-center">
              <Terminal className="w-4 h-4 mr-3 text-cyan-400" />
              Recent Executions
            </h3>
          </div>
          <div className="p-0">
            <div className="grid grid-cols-1 divide-y divide-slate-800/50">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 hover:bg-slate-800/30 transition-colors gap-4">
                  <div>
                    <div className="font-mono text-cyan-400 font-bold text-sm mb-1 uppercase tracking-widest">Operation_Deploy_0{idx + 1}</div>
                    <div className="font-sans text-xs text-slate-400">Deployed medical supply algorithms to Region {idx + 4}.</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] text-slate-500">T-MINUS 12 HOURS</span>
                    <span className="px-2 py-1 bg-green-950/30 border border-green-500/20 text-green-400 font-mono text-[10px] font-bold tracking-widest rounded uppercase whitespace-nowrap">
                      <ShieldCheck className="w-3 h-3 inline mr-1" /> VERIFIED
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0A0A0A] p-4 border-t border-slate-800 text-center flex justify-center">
            <button className="font-mono text-xs font-bold tracking-widest text-slate-500 hover:text-cyan-400 transition-colors uppercase flex items-center">
              <span className="text-cyan-500 mr-2">$</span> load_more_logs()
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
