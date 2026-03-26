import CharityFilter from "@/components/features/CharityFilter";
import Link from "next/link";
import { Terminal, Search, Database, Signal, Server, CheckCircle2, Activity, Heart, Globe, Shield } from "lucide-react";

export default function CharitiesDirectoryPage() {
// ... preserving rest of function ...
// We will use multi_replace for accuracy to ensure imports are added.
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 relative">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-cyan-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-[40%] left-0 w-[30%] h-[50%] bg-fuchsia-900/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10">
        
        {/* Page Header Terminal */}
        <div className="mb-8 sm:mb-10 w-full bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <div className="bg-slate-900 px-4 py-3 flex items-center border-b border-slate-800">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="ml-4 font-mono text-xs text-slate-500">query_nodes.sh</div>
            <div className="ml-auto font-mono text-[10px] sm:text-xs text-green-400 flex items-center">
              <Signal className="w-3 h-3 mr-1 animate-pulse" /> NETWORK_SYNCED
            </div>
          </div>
          
          <div className="p-5 sm:p-6 md:p-10">
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-mono font-bold text-white mb-2 uppercase tracking-wide flex items-center">
              <Database className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 text-cyan-400" />
              Active Nodes Directory
            </h1>
            <p className="font-sans text-sm sm:text-base text-slate-400 max-w-3xl mt-3 sm:mt-4 leading-relaxed">
              Browse the verified charitable organizations partnered with Digital Heroes. When you subscribe, a minimum of 10% of your monthly fee is routed directly to the charity you choose below. Each node represents an active, audited organization making real-world impact.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-5 sm:mt-6">
              <div className="flex items-center gap-2 bg-cyan-950/30 border border-cyan-500/20 rounded-lg px-3 py-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-[10px] sm:text-xs text-cyan-400">3 Active Sectors</span>
              </div>
              <div className="flex items-center gap-2 bg-green-950/30 border border-green-500/20 rounded-lg px-3 py-2">
                <Shield className="w-4 h-4 text-green-400" />
                <span className="font-mono text-[10px] sm:text-xs text-green-400">100% Audited</span>
              </div>
              <div className="flex items-center gap-2 bg-amber-950/30 border border-amber-500/20 rounded-lg px-3 py-2">
                <Heart className="w-4 h-4 text-amber-400" />
                <span className="font-mono text-[10px] sm:text-xs text-amber-400">10%+ of Every Subscription</span>
              </div>
            </div>
          </div>
        </div>

        {/* How Charity Routing Works */}
        <div className="mb-8 sm:mb-10 bg-slate-900/40 border border-slate-800 rounded-xl p-4 sm:p-6">
          <h2 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-widest mb-3 flex items-center">
            <Heart className="w-4 h-4 mr-2 text-fuchsia-400" /> How Charity Routing Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 sm:p-4">
              <div className="font-mono text-[10px] text-cyan-400 mb-1">STEP 1</div>
              <p className="font-sans text-xs sm:text-sm text-slate-400">Choose a charity during signup. Your selection locks in your routing destination.</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 sm:p-4">
              <div className="font-mono text-[10px] text-amber-400 mb-1">STEP 2</div>
              <p className="font-sans text-xs sm:text-sm text-slate-400">A minimum 10% of your monthly subscription fee is automatically directed to your chosen charity.</p>
            </div>
            <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 sm:p-4">
              <div className="font-mono text-[10px] text-green-400 mb-1">STEP 3</div>
              <p className="font-sans text-xs sm:text-sm text-slate-400">You can increase your allocation to up to 100% from your dashboard at any time.</p>
            </div>
          </div>
        </div>

        {/* Search/Filter */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8 sm:mb-10">
          <div className="flex-grow relative flex items-center w-full bg-slate-900/80 border border-slate-700 rounded-lg group focus-within:border-cyan-400 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all">
            <div className="pl-3 sm:pl-4 text-cyan-500 font-mono font-bold text-sm shrink-0">
              <Search className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Search</span>
            </div>
            <input 
              type="text" 
              placeholder="Search charities..." 
              className="w-full bg-transparent px-3 py-3 sm:py-4 text-white font-mono text-sm focus:outline-none placeholder:text-slate-600"
            />
          </div>

          <CharityFilter />
        </div>

        {/* Node Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          
          {/* Node Card 1 — Health */}
          <div className="flex flex-col bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden hover:bg-slate-900/80 hover:border-cyan-500/50 hover:shadow-[0_0_25px_rgba(34,211,238,0.15)] transition-all group flex-grow">
            <div className="h-32 sm:h-40 w-full relative border-b border-slate-800 bg-[#050B14] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.15)_0%,transparent_70%)] opacity-50"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 border border-cyan-500/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-700 z-10">
                <div className="absolute w-24 sm:w-28 h-24 sm:h-28 border border-cyan-500/10 rounded-full border-dashed animate-[spin_10s_linear_infinite]"></div>
                <Server className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400" />
              </div>
              <div className="absolute top-3 left-3 px-2 py-1 bg-cyan-950 border border-cyan-500/30 rounded text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">
                HEALTH
              </div>
              <div className="absolute top-3 right-3">
                <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse inline-block"></span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col flex-grow">
              <h3 className="text-base sm:text-lg font-mono font-bold text-white group-hover:text-cyan-400 transition-colors mb-1">Global Health Initiative</h3>
              <div className="font-mono text-[10px] sm:text-xs text-slate-500 mb-3 flex items-center gap-2">
                <span className="text-cyan-700">UID: 0x8A22F</span>
                <span className="text-green-400 flex items-center"><CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified</span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6 flex-grow leading-relaxed">
                Funds emergency medical supplies, builds rural clinics, and trains healthcare workers in 14 countries across Africa and Southeast Asia. Over $1.2M routed to date.
              </p>
              
              <div className="mt-auto space-y-3 sm:space-y-4">
                <div className="w-full">
                  <div className="flex justify-between font-mono text-[10px] sm:text-xs text-slate-400 mb-1.5 sm:mb-2 uppercase">
                    <span>Impact Rating</span>
                    <span className="text-cyan-400">92.4%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[92%] shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
                  </div>
                </div>
                
                <Link href="/charities/1" className="flex items-center justify-center w-full py-2.5 sm:py-3 bg-slate-950 border border-slate-700 text-slate-300 font-mono text-xs sm:text-sm font-bold tracking-widest hover:border-cyan-400 hover:text-cyan-400 transition-all uppercase group-hover:bg-cyan-950/20">
                  <Terminal className="w-4 h-4 mr-2" /> View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Node Card 2 — Education */}
          <div className="flex flex-col bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden hover:bg-slate-900/80 hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(251,191,36,0.15)] transition-all group flex-grow">
            <div className="h-32 sm:h-40 w-full relative border-b border-slate-800 bg-[#161105] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15)_0%,transparent_70%)] opacity-50"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 border border-amber-500/30 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-700 z-10">
                <div className="absolute w-24 sm:w-28 h-24 sm:h-28 border-2 border-amber-500/10 rounded-xl border-dashed animate-[spin_15s_linear_infinite_reverse]"></div>
                <Database className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
              </div>
              <div className="absolute top-3 left-3 px-2 py-1 bg-amber-950 border border-amber-500/30 rounded text-[10px] font-mono text-amber-500 font-bold tracking-widest uppercase">
                EDUCATION
              </div>
              <div className="absolute top-3 right-3">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse inline-block"></span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col flex-grow">
              <h3 className="text-base sm:text-lg font-mono font-bold text-white group-hover:text-amber-400 transition-colors mb-1">Education Equity Network</h3>
              <div className="font-mono text-[10px] sm:text-xs text-slate-500 mb-3 flex items-center gap-2">
                <span className="text-amber-700">UID: 0xB771C</span>
                <span className="text-green-400 flex items-center"><CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified</span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6 flex-grow leading-relaxed">
                Provides free digital learning materials, distributes tablets to underserved schools, and funds teacher training programs in 22 countries worldwide.
              </p>
              
              <div className="mt-auto space-y-3 sm:space-y-4">
                <div className="w-full">
                  <div className="flex justify-between font-mono text-[10px] sm:text-xs text-slate-400 mb-1.5 sm:mb-2 uppercase">
                    <span>Impact Rating</span>
                    <span className="text-amber-400">88.7%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 w-[88%] shadow-[0_0_8px_rgba(251,191,36,0.8)]"></div>
                  </div>
                </div>
                
                <Link href="/charities/2" className="flex items-center justify-center w-full py-2.5 sm:py-3 bg-slate-950 border border-slate-700 text-slate-300 font-mono text-xs sm:text-sm font-bold tracking-widest hover:border-amber-400 hover:text-amber-400 transition-all uppercase group-hover:bg-amber-950/20">
                  <Terminal className="w-4 h-4 mr-2" /> View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Node Card 3 — Climate */}
          <div className="flex flex-col bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden hover:bg-slate-900/80 hover:border-fuchsia-500/50 hover:shadow-[0_0_25px_rgba(232,121,249,0.15)] transition-all group flex-grow">
            <div className="h-32 sm:h-40 w-full relative border-b border-slate-800 bg-[#160514] overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(232,121,249,0.15)_0%,transparent_70%)] opacity-50"></div>
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 border-2 border-fuchsia-500/30 rounded-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-700 z-10 rotate-45">
                <div className="absolute w-20 sm:w-24 h-20 sm:h-24 border border-fuchsia-500/20 rounded-sm animate-[spin_8s_linear_infinite]"></div>
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-fuchsia-400 -rotate-45" />
              </div>
              <div className="absolute top-3 left-3 px-2 py-1 bg-fuchsia-950 border border-fuchsia-500/30 rounded text-[10px] font-mono text-fuchsia-400 font-bold tracking-widest uppercase">
                CLIMATE
              </div>
              <div className="absolute top-3 right-3">
                <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-pulse inline-block"></span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col flex-grow">
              <h3 className="text-base sm:text-lg font-mono font-bold text-white group-hover:text-fuchsia-400 transition-colors mb-1">Climate Defense Systems</h3>
              <div className="font-mono text-[10px] sm:text-xs text-slate-500 mb-3 flex items-center gap-2">
                <span className="text-fuchsia-800">UID: 0x2A99D</span>
                <span className="text-green-400 flex items-center"><CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified</span>
              </div>
              <p className="font-sans text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6 flex-grow leading-relaxed">
                Deploys reforestation programs, funds ocean plastic cleanup operations, and sponsors research into carbon capture technology across 8 major biomes.
              </p>
              
              <div className="mt-auto space-y-3 sm:space-y-4">
                <div className="w-full">
                  <div className="flex justify-between font-mono text-[10px] sm:text-xs text-slate-400 mb-1.5 sm:mb-2 uppercase">
                    <span>Impact Rating</span>
                    <span className="text-fuchsia-400">96.1%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-fuchsia-400 w-[96%] shadow-[0_0_8px_rgba(232,121,249,0.8)]"></div>
                  </div>
                </div>
                
                <Link href="/charities/3" className="flex items-center justify-center w-full py-2.5 sm:py-3 bg-slate-950 border border-slate-700 text-slate-300 font-mono text-xs sm:text-sm font-bold tracking-widest hover:border-fuchsia-400 hover:text-fuchsia-400 transition-all uppercase group-hover:bg-fuchsia-950/20">
                  <Terminal className="w-4 h-4 mr-2" /> View Details
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Info Bar */}
        <div className="mt-8 sm:mt-12 bg-slate-900/40 border border-slate-800 rounded-xl p-4 sm:p-6 text-center">
          <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            All partner charities are independently audited for transparency and impact. Your contribution is tracked in real-time and visible on your dashboard. Want to increase your impact? Adjust your contribution percentage from 10% up to 100% at any time.
          </p>
          <Link href="/register" className="inline-flex items-center mt-4 px-6 py-2.5 bg-cyan-950/30 border border-cyan-500/50 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-slate-950 transition-all">
            Join & Choose Your Charity
          </Link>
        </div>

      </div>
    </div>
  );
}
