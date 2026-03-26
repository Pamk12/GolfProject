import Link from 'next/link';
import { Terminal, Database, Cpu, Activity, Signal, ShieldCheck, ChevronRight, Heart, Trophy, Users, Zap, HelpCircle, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background ambient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-fuchsia-500/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Terminal */}
      <section className="relative w-full max-w-7xl mx-auto px-4 py-10 md:py-24 z-10 flex flex-col items-center">
        <div className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.15)] overflow-hidden">
          <div className="bg-slate-900 px-4 py-3 flex items-center border-b border-slate-800">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="ml-4 font-mono text-xs text-slate-500">sys_init.sh</div>
          </div>
          
          <div className="p-5 sm:p-6 md:p-12 flex flex-col items-start w-full">
            <div className="font-mono text-cyan-400 text-sm md:text-base mb-6 md:mb-8 flex items-center">
              <span className="mr-3 font-bold">&gt;</span>
              <span className="animate-pulse">SYSTEM.INIT('CHARITY_ENGINE')</span>
              <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"></span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-mono font-bold tracking-tighter text-white mb-4 md:mb-6 leading-[1.1] uppercase">
              Enter Scores.<br />
              Run Algorithm.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                Fund the Future.
              </span>
            </h1>
            
            <p className="font-sans text-sm sm:text-base md:text-lg text-slate-400 mb-8 md:mb-10 max-w-2xl leading-relaxed">
              Digital Heroes converts your monthly golf scores into a cryptographic lottery that funds global charities. Subscribe, play, and let the algorithm decide who wins — and who the world helps next.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link 
                href="/register" 
                className="group relative flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 bg-cyan-950/30 border-2 border-cyan-400 text-cyan-400 font-mono text-sm font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-slate-950 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-300"
              >
                [ JOIN THE NETWORK ]
                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/charities" 
                className="flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-4 sm:py-5 border border-slate-600 text-slate-400 font-mono text-sm font-bold uppercase tracking-widest hover:border-fuchsia-400 hover:text-fuchsia-400 transition-all duration-300"
              >
                [ VIEW CHARITIES ]
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10 md:py-16 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-white uppercase tracking-widest mb-2">
            How It <span className="text-cyan-400">Works</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-500">PROTOCOL EXECUTION SEQUENCE</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Users, color: 'cyan', step: '01', title: 'Subscribe', desc: 'Choose a monthly or yearly plan. 10% of your fee automatically routes to your chosen charity.' },
            { icon: Zap, color: 'amber', step: '02', title: 'Enter Scores', desc: 'Log 5 golf scores (1-45 each) after each round. Your numbers become your lottery entry for the month.' },
            { icon: Cpu, color: 'fuchsia', step: '03', title: 'Algorithm Runs', desc: 'At month-end, the RNG engine generates 5 winning numbers. Match 3, 4, or all 5 to win prize tiers.' },
            { icon: Trophy, color: 'green', step: '04', title: 'Win & Give', desc: '5 Match = 40% jackpot. 4 Match = 35% split. 3 Match = 25% split. No jackpot? It rolls over.' },
          ].map((item, i) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl p-5 md:p-6 hover:border-current transition-colors group" style={{ borderColor: 'transparent' }}>
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-${item.color === 'cyan' ? 'cyan' : item.color === 'amber' ? 'amber' : item.color === 'fuchsia' ? 'fuchsia' : 'green'}-950 border border-slate-700 flex items-center justify-center mb-4`}>
                <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${item.color}-400`} />
              </div>
              <div className="font-mono text-[10px] text-slate-600 mb-2 tracking-widest">STEP_{item.step}</div>
              <h3 className="font-mono text-base sm:text-lg font-bold text-white mb-2 uppercase tracking-wider">{item.title}</h3>
              <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Prize Tier Breakdown */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10 md:py-16 relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex items-center justify-between">
            <div className="font-mono text-xs sm:text-sm text-fuchsia-400 flex items-center">
              <Terminal className="w-4 h-4 mr-2" /> prize_distribution.config
            </div>
            <span className="font-mono text-[10px] text-green-400 border border-green-500/20 bg-green-950/20 px-2 py-0.5 rounded">VERIFIED</span>
          </div>
          
          <div className="p-4 sm:p-6 md:p-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-amber-950/20 border border-amber-500/30 rounded-xl p-4 sm:p-6 text-center">
                <div className="font-mono text-[10px] sm:text-xs text-amber-400 uppercase tracking-widest mb-2">Tier 1 — Jackpot</div>
                <div className="font-mono text-3xl sm:text-4xl font-bold text-amber-400 mb-1">40%</div>
                <div className="font-mono text-xs text-slate-500">5/5 Numbers Matched</div>
                <div className="font-mono text-[10px] text-amber-400/60 mt-2">Rolls over if no winner</div>
              </div>
              <div className="flex-1 bg-green-950/20 border border-green-500/30 rounded-xl p-4 sm:p-6 text-center">
                <div className="font-mono text-[10px] sm:text-xs text-green-400 uppercase tracking-widest mb-2">Tier 2</div>
                <div className="font-mono text-3xl sm:text-4xl font-bold text-green-400 mb-1">35%</div>
                <div className="font-mono text-xs text-slate-500">4/5 Numbers Matched</div>
                <div className="font-mono text-[10px] text-green-400/60 mt-2">Split equally among winners</div>
              </div>
              <div className="flex-1 bg-cyan-950/20 border border-cyan-500/30 rounded-xl p-4 sm:p-6 text-center">
                <div className="font-mono text-[10px] sm:text-xs text-cyan-400 uppercase tracking-widest mb-2">Tier 3</div>
                <div className="font-mono text-3xl sm:text-4xl font-bold text-cyan-400 mb-1">25%</div>
                <div className="font-mono text-xs text-slate-500">3/5 Numbers Matched</div>
                <div className="font-mono text-[10px] text-cyan-400/60 mt-2">Split equally among winners</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Score Processing & Algorithmic Draw Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8 w-full">
          
          {/* Score Processing Widget */}
          <div className="flex-1 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] transition-all duration-500">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="font-mono text-xs text-amber-400 flex items-center">
                <Terminal className="w-4 h-4 mr-2" /> UPLINK_CORE
              </div>
              <ShieldCheck className="w-4 h-4 text-green-500" />
            </div>
            <div className="p-5 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-white mb-2 uppercase">Score Telemetry</h3>
              <p className="font-sans text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">Every round of golf generates 5 data points. Enter integers 1-45 and the platform stores your rolling array for the monthly draw.</p>
              
              <div className="w-full bg-black/60 border border-slate-800 rounded p-3 sm:p-4 font-mono text-xs sm:text-sm text-slate-300">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <span className="text-slate-500 text-[10px] sm:text-xs">conn: secured // AES-256</span>
                  <span className="text-amber-400 animate-pulse text-[10px] border border-amber-400/30 px-2 py-0.5 rounded">REC_READY</span>
                </div>
                <div className="border-l-2 border-amber-500/50 pl-3 py-1 space-y-1.5 sm:space-y-2 text-[11px] sm:text-sm">
                  <div><span className="text-slate-600">$</span> auth.verify() // <span className="text-green-400">OK</span></div>
                  <div><span className="text-slate-600">$</span> await upload_score(42)</div>
                  <div className="text-amber-400 italic mt-2">&gt; processing matrix insertion...</div>
                </div>
              </div>
            </div>
          </div>

          {/* Algorithmic Draw Panel */}
          <div className="flex-1 bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden hover:border-fuchsia-400/50 hover:shadow-[0_0_15px_rgba(232,121,249,0.2)] transition-all duration-500">
            <div className="bg-slate-900 px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="font-mono text-xs text-fuchsia-400 flex items-center">
                <Cpu className="w-4 h-4 mr-2" /> CRYPTO_DRAW_NODE
              </div>
              <Activity className="w-4 h-4 text-fuchsia-400 animate-pulse" />
            </div>
            <div className="p-5 sm:p-6 md:p-8">
              <h3 className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-white mb-2 uppercase">RNG Consensus</h3>
              <p className="font-sans text-xs sm:text-sm text-slate-400 mb-4 sm:mb-6">At month-end, the admin executes the algorithm. 5 unique numbers are drawn and matched against every subscriber's score array.</p>
              
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full mb-4 sm:mb-6">
                {[12, 45, 19, 3, 28].map((num, i) => (
                  <div key={i} className="aspect-square bg-slate-950 border border-fuchsia-500/30 flex items-center justify-center font-mono text-base sm:text-xl font-bold text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-fuchsia-500/10 group-hover:bg-fuchsia-500/30 transition-colors"></div>
                    {num}
                  </div>
                ))}
              </div>
              
              <div className="w-full bg-black/60 border border-slate-800 rounded p-3 font-mono text-[10px] sm:text-xs text-slate-400 flex justify-between items-center">
                <span>HASH: 0x9a4f...21cb</span>
                <span className="text-green-400 px-2 bg-green-900/40 rounded">VERIFIED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charity Impact Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10 md:py-16 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-white uppercase tracking-widest mb-2">
            <Heart className="w-6 h-6 sm:w-8 sm:h-8 inline mr-2 text-fuchsia-400" />
            Charity <span className="text-fuchsia-400">Impact</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-500">WHERE YOUR CONTRIBUTION GOES</p>
        </div>

        <div className="w-full bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden">
          <div className="bg-slate-900 px-4 sm:px-6 py-3 sm:py-5 border-b border-slate-800 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-cyan-950 border border-cyan-500/30 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-mono font-bold text-white tracking-wider uppercase">Global Routing Matrix</h2>
                <div className="text-[10px] sm:text-xs font-mono text-cyan-400 flex items-center mt-0.5 sm:mt-1">
                  <Signal className="w-3 h-3 mr-1 animate-pulse" /> SYSTEM_ONLINE
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4">
            {[
              { name: 'GLOBAL_HEALTH_VX', color: 'cyan', protocol: 'MED_SUPPORT', desc: 'Directing liquidity to medical infrastructure and emergency response in under-provisioned sectors.' },
              { name: 'EDU_EQUITY_NET', color: 'amber', protocol: 'EDUCATION', desc: 'Deploying capital to synthesize open-source educational modules and localized digital learning grids.' },
              { name: 'CLIMATE_DEF_SYS', color: 'fuchsia', protocol: 'CLIMATE', desc: 'Optimizing planetary carbon capture through targeted reforestation algorithms and ocean-cleaning robotics.' },
            ].map((node, i) => (
              <div key={i} className={`flex flex-col sm:flex-row bg-slate-950/80 border-l-4 border-${node.color}-400 border-r border-t border-b border-slate-800 p-4 sm:p-6 rounded hover:bg-slate-800/50 transition-colors gap-4 sm:gap-6 group`}>
                <div className="flex-1">
                  <h4 className={`font-mono text-sm sm:text-lg font-bold text-${node.color}-400 mb-1`}>NODE: {node.name}</h4>
                  <p className="font-sans text-xs sm:text-sm text-slate-400 mb-2 leading-relaxed">{node.desc}</p>
                  <div className="font-mono text-[10px] sm:text-xs text-slate-500">PROTOCOL: {node.protocol}</div>
                </div>
                <Link href="/charities" className={`shrink-0 self-start sm:self-center px-4 py-2 border border-slate-700 text-slate-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest hover:border-${node.color}-400 hover:text-${node.color}-400 transition-all flex items-center`}>
                  INSPECT <ArrowRight className="w-3 h-3 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10 md:py-16 relative z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold text-white uppercase tracking-widest mb-2">
            <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 inline mr-2 text-cyan-400" />
            Frequently <span className="text-cyan-400">Asked</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-slate-500">SYSTEM.QUERY('FAQ')</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { q: 'What is Digital Heroes?', a: 'A subscription platform where your monthly golf scores automatically enter you into an algorithmic prize draw, with a portion of every subscription directly funding global charities.' },
            { q: 'How does the draw work?', a: 'Each month, 5 unique winning numbers (1–45) are generated. If your submitted scores match 3, 4, or all 5 numbers, you win a share of the prize pool.' },
            { q: 'Where does the charity money go?', a: 'A minimum of 10% (voluntarily adjustable up to 100%) of your subscription fee goes directly to the charity you selected during signup.' },
            { q: 'What happens if nobody wins the jackpot?', a: 'The 40% Tier 1 allocation rolls over to the next month, creating ever-growing jackpots until someone matches all 5 numbers.' },
            { q: 'Can I change my charity?', a: 'Your charity is locked during onboarding, but you can increase your contribution percentage at any time from your dashboard.' },
            { q: 'Is there a limit on scores?', a: 'You can hold a maximum of 5 scores at any time (the "Rolling 5" rule). Submitting new scores automatically replaces the oldest ones.' },
          ].map((faq, i) => (
            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 sm:p-6 hover:border-cyan-500/30 transition-colors">
              <h4 className="font-mono text-sm sm:text-base font-bold text-white mb-2 uppercase tracking-wider flex items-start">
                <span className="text-cyan-400 mr-2 shrink-0">&gt;</span> {faq.q}
              </h4>
              <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed pl-4">{faq.a}</p>
            </div>
          ))}
        </div>

        {/* Prize Tier Breakdown */}
        <div className="mt-8 md:mt-12">
          <div className="text-center mb-6">
            <h3 className="font-mono text-lg sm:text-xl font-bold text-white uppercase tracking-widest">Prize Tier Structure</h3>
            <p className="font-mono text-xs text-slate-500 mt-1">PAYOUT_ALLOCATION_TABLE // MONTHLY DRAW</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Tier 1 */}
            <div className="relative bg-slate-900/70 border border-amber-500/40 rounded-xl p-4 sm:p-6 text-center overflow-hidden shadow-[0_0_20px_rgba(251,191,36,0.1)] hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] transition-all">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
              <div className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2">Tier 1</div>
              <div className="font-mono text-4xl sm:text-5xl font-bold text-amber-400 mb-1 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]">40%</div>
              <div className="font-mono text-sm text-white font-bold uppercase tracking-widest mb-3">Jackpot</div>
              <div className="space-y-1.5 text-xs font-mono text-slate-400">
                <p>5 / 5 Numbers Matched</p>
                <p className="text-amber-400/80">Rolls over if no winner</p>
              </div>
            </div>
            {/* Tier 2 */}
            <div className="relative bg-slate-900/70 border border-purple-500/40 rounded-xl p-4 sm:p-6 text-center overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] transition-all">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
              <div className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2">Tier 2</div>
              <div className="font-mono text-4xl sm:text-5xl font-bold text-purple-400 mb-1 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">35%</div>
              <div className="font-mono text-sm text-white font-bold uppercase tracking-widest mb-3">Runner Up</div>
              <div className="space-y-1.5 text-xs font-mono text-slate-400">
                <p>4 / 5 Numbers Matched</p>
                <p className="text-purple-400/80">Split equally among winners</p>
              </div>
            </div>
            {/* Tier 3 */}
            <div className="relative bg-slate-900/70 border border-cyan-500/40 rounded-xl p-4 sm:p-6 text-center overflow-hidden shadow-[0_0_20px_rgba(34,211,238,0.1)] hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] transition-all">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
              <div className="font-mono text-xs text-slate-500 uppercase tracking-widest mb-2">Tier 3</div>
              <div className="font-mono text-4xl sm:text-5xl font-bold text-cyan-400 mb-1 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]">25%</div>
              <div className="font-mono text-sm text-white font-bold uppercase tracking-widest mb-3">Participant</div>
              <div className="space-y-1.5 text-xs font-mono text-slate-400">
                <p>3 / 5 Numbers Matched</p>
                <p className="text-cyan-400/80">Split equally among winners</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="w-full max-w-7xl mx-auto px-4 py-10 md:py-16 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-md border border-cyan-500/30 rounded-xl p-6 sm:p-8 md:p-12 text-center shadow-[0_0_40px_rgba(34,211,238,0.1)]">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-mono font-bold text-white uppercase tracking-widest mb-3 sm:mb-4">
            Ready to Route Some Good?
          </h2>
          <p className="font-sans text-sm sm:text-base text-slate-400 max-w-xl mx-auto mb-6 sm:mb-8">
            Join the network of digital heroes who are playing golf, winning prizes, and funding the future — all from one subscription.
          </p>
          <Link 
            href="/register" 
            className="inline-flex items-center px-8 sm:px-10 py-4 sm:py-5 bg-cyan-400 text-slate-950 font-mono text-sm font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all duration-300"
          >
            [ INITIALIZE NODE ] <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>

        <div className="mt-8 sm:mt-12 text-center font-mono text-[10px] sm:text-xs text-slate-600 space-y-2">
          <p>Digital Heroes Golf Charity Platform © 2026</p>
          <p>HTTPS Enforced // JWT Session Auth // Supabase Infrastructure</p>
        </div>
      </section>
    </div>
  );
}
