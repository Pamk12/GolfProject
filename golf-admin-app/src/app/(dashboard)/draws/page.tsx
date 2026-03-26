import { Terminal, Cpu, Play } from 'lucide-react';
import { verifyAdmin } from '@/app/actions/admin';
import { ExecuteDrawButton } from '@/app/(dashboard)/dashboard/execute-draw-button';

export default async function AdminDrawsPage() {
  const supabase = await verifyAdmin();

  const { data: draws } = await supabase
    .from('draws')
    .select('*')
    .order('created_at', { ascending: false });

  const drawHistory = (draws || []).map((d: any) => ({
    id: d.id,
    date: d.draw_month,
    status: d.status === 'published' ? 'COMPLETED' : 'SIMULATION',
    numbers: d.winning_numbers || [],
    matchers: (d.winning_user_ids || []).length,
    yield: d.prize_pool || 0,
    rollover: d.rollover_amount || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-purple-500/20 pb-4">
        <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white uppercase tracking-widest flex items-center">
          <Cpu className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400" />
          RNG_ROUTING
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400 mt-1">ALGORITHMIC PAYOUT CONSENSUS // EXECUTE AND REVIEW DRAWS</p>
      </div>

      {/* Draw Execution Terminal */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="bg-[#0A0A0A] px-3 sm:px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
          <div className="font-mono text-[10px] sm:text-xs text-purple-400 flex items-center">
            <span className="mr-2">&gt;</span> execute_draw.sh
          </div>
          <div className="flex gap-2 text-slate-600 font-mono text-[10px]">
            <span className="hidden sm:inline">[ DRAWS: {drawHistory.length} ]</span>
            <span>[ READY ]</span>
          </div>
        </div>
        
        <div className="p-5 sm:p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-purple-500/30 flex items-center justify-center mb-4 sm:mb-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-purple-500/10 hover:bg-purple-500/20 transition-all flex justify-center items-center cursor-pointer">
              <Play className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            </div>
            <div className="w-[120%] h-[120%] absolute border border-purple-500/10 rounded-full animate-[spin_4s_linear_infinite]"></div>
          </div>
          
          <h2 className="text-lg sm:text-2xl font-mono font-bold text-white mb-1 sm:mb-2 uppercase tracking-widest">Initiate Consensus</h2>
          <p className="font-mono text-xs sm:text-sm text-slate-400 max-w-md mb-5 sm:mb-8">
             Generate RNG matrix against active user vectors for payout distribution.
          </p>
          
          <ExecuteDrawButton />
        </div>
      </div>

      {/* Execution Log — LIVE FROM DB */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="bg-[#0A0A0A] px-3 sm:px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
          <h3 className="font-mono text-[10px] sm:text-xs font-bold text-white uppercase tracking-widest flex items-center">
            <Terminal className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-purple-400" />
            Execution Log
          </h3>
          <span className="font-mono text-[10px] text-slate-600">{drawHistory.length} RECORDS</span>
        </div>
        
        <div className="p-3 sm:p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {drawHistory.length === 0 ? (
            <div className="text-slate-500 font-mono text-xs text-center py-8 opacity-50 border border-slate-800/50 rounded border-dashed uppercase tracking-widest">
              [ NO DRAW HISTORY FOUND ]
            </div>
          ) : (
            drawHistory.map((draw: any) => (
              <div key={draw.id} className="font-mono text-xs sm:text-sm bg-[#0A0A0A] border border-slate-800 p-3 sm:p-4 rounded group hover:border-purple-500/30 transition-colors">
                <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-500 mb-2">
                  <span>{draw.date}</span>
                  <span className={`px-1.5 py-0.5 border rounded font-bold text-[10px] ${
                    draw.status === 'COMPLETED' 
                      ? 'bg-green-950/40 text-green-400 border-green-500/30' 
                      : 'bg-amber-950/40 text-amber-400 border-amber-500/30'
                  }`}>{draw.status}</span>
                </div>
                <div className="text-white font-bold tracking-widest text-center mb-2 text-xs sm:text-sm break-all">
                  HASH: {draw.numbers.join(', ')}
                </div>
                <div className="text-[10px] sm:text-xs text-slate-400 flex justify-between">
                  <span>Matchers: {String(draw.matchers).padStart(2, '0')}</span>
                  <span className="text-purple-400">Yield: ${draw.yield.toLocaleString()}</span>
                </div>
                {draw.rollover > 0 && (
                  <div className="text-[10px] text-amber-400 mt-2 text-center uppercase tracking-widest animate-pulse">
                    ROLLOVER: ${draw.rollover.toLocaleString()}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
