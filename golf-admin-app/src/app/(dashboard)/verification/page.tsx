import { ShieldAlert, CheckSquare, XSquare, Database, Activity, AlertOctagon } from 'lucide-react';
import { processScoreVerificationAction, verifyAdmin } from '@/app/actions/admin';
import { createClient } from '@/lib/supabase/server';

export default async function AdminVerificationPage() {
  const supabase = await verifyAdmin();
  
  // Real Database Fetch for Auditing
  // Fetch all scores to rebuild the "Rolling 5" vectors for each user, then filter the ones that need verification
  const { data: allScores, error } = await supabase
    .from('scores')
    .select('*')
    .order('created_at', { ascending: false });

  const vectorMap: Record<string, number[]> = {};
  if (allScores) {
    allScores.forEach(s => {
      if (!vectorMap[s.user_id]) vectorMap[s.user_id] = [];
      if (vectorMap[s.user_id].length < 5) vectorMap[s.user_id].push(s.score);
    });
  }

  const pendingData = (allScores || []).filter(s => s.status === 'pending' || s.status === 'flagged');

  // Map Real DB to Telemetry Visualization
  const pendingScores = pendingData.map((dbScore, idx) => {
    const realVector = vectorMap[dbScore.user_id] || [dbScore.score];
    const realTotal = realVector.reduce((a, b) => a + b, 0);

    return {
      id: dbScore.id, 
      userId: dbScore.user_id.substring(0, 8), 
      amount: 'PENDING CALC', 
      arrayVector: realVector, 
      totalStableford: realTotal,
      tierMatch: dbScore.score > 35 ? 'JACKPOT_TIER' : 'TIER_ROUTINE',
      poolCut: dbScore.score > 35 ? '40% + ROLLOVER' : '25%',
      img: dbScore.image_url || 'https://placeholder.com/400x300'
    };
  });

  return (
    <div className="space-y-8">
      <div className="mb-6 sm:mb-8 border-b border-purple-500/20 pb-4 sm:pb-6 flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl lg:text-3xl font-mono font-bold text-white uppercase tracking-widest flex items-center">
            <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-red-500" />
            VERIFICATION_LOGS
          </h1>
          <p className="font-mono text-[10px] sm:text-xs lg:text-sm text-slate-400 mt-1 sm:mt-2">AUDIT AND YIELD_PAYOUT CLEARANCE // DEEP VECTOR ANALYSIS</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 flex flex-col p-2 sm:p-3 rounded text-right min-w-[120px] sm:min-w-[150px]">
          <span className="font-mono text-[9px] sm:text-[10px] text-slate-500 uppercase tracking-widest mb-1">Pending Audits</span>
          <span className="font-mono text-lg sm:text-xl text-red-400 font-bold">{pendingScores.length} Nodes</span>
        </div>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        <div className="bg-[#0A0A0A] px-3 sm:px-6 py-3 sm:py-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest overflow-hidden">
            <span className="text-red-500 font-bold mr-2 animate-pulse">!</span> Awaiting Manual Clearances
          </div>
          <div className="text-[9px] sm:text-[10px] font-mono text-slate-600">STABLEFORD_VECTORS (MAX 5)</div>
        </div>
        
        <div className="p-0">
          {pendingScores.length === 0 && (
            <div className="bg-red-950/40 border border-red-500/50 p-4 m-6 text-red-500 font-mono text-xs sm:text-sm">
              <span className="font-bold uppercase tracking-widest block mb-1">
                <AlertOctagon className="w-4 h-4 inline mr-2 align-text-bottom" />
                DATABASE WARNING: [ 0 ROWS RETURNED ]
              </span>
              <span className="text-red-400">Due to Supabase Row-Level Security (RLS) constraints, this Admin Node cannot read other users' scores. Execute RLS bypass script in Supabase Studio.</span>
            </div>
          )}
          <div className="grid grid-cols-1 divide-y divide-slate-800/50 font-mono">
            
            {pendingScores.map((score, idx) => {
              const approveAction = processScoreVerificationAction.bind(null, score.id, 'approve');
              const rejectAction = processScoreVerificationAction.bind(null, score.id, 'reject');
              
              return (
                <div key={score.id} className="px-3 sm:px-6 py-4 sm:py-5 hover:bg-slate-800/50 transition-colors flex flex-col justify-between gap-4 sm:gap-6 relative group">
                  
                  {/* Visual Background Accent based on Tier */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${score.tierMatch.includes('JACKPOT') ? 'bg-amber-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]'}`}></div>

                  <div className="flex-1 ml-2">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-3 mb-3">
                      <span className="text-white font-bold text-[10px] sm:text-sm tracking-widest break-all">TRX_0x{score.id.toUpperCase()}{(idx+4)*11}B1</span>
                      <span className="px-1.5 sm:px-2 py-0.5 bg-red-950/40 text-red-400 border border-red-500/30 rounded text-[8px] sm:text-[10px] uppercase font-bold tracking-widest animate-pulse">AWAIT_REVIEW</span>
                      <span className={`px-1.5 sm:px-2 py-0.5 border rounded text-[8px] sm:text-[10px] uppercase font-bold tracking-widest ${
                        score.tierMatch.includes('JACKPOT') 
                          ? 'bg-amber-950/40 text-amber-400 border-amber-500/30' 
                          : 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30'
                      }`}>
                        {score.tierMatch}
                      </span>
                    </div>

                    {/* Array Breakdown */}
                    <div className="mb-3 sm:mb-4 bg-[#050505] border border-slate-800 rounded p-2 sm:p-3 text-[10px] sm:text-xs w-full">
                      <div className="flex items-center text-slate-500 mb-2 border-b border-slate-800 pb-2">
                        <Database className="w-3 h-3 mr-2" />
                        Rolling Stableford Vector Array
                      </div>
                      <div className="flex gap-1 sm:gap-2">
                        {score.arrayVector.map((num, i) => (
                          <div key={i} className="flex-1 bg-slate-900 border border-slate-700 py-1 text-center rounded text-cyan-400 font-bold relative group-hover:border-cyan-500/50 transition-colors">
                            <span className="absolute -top-1.5 -left-1 text-[8px] text-slate-600 bg-[#0A0A0A] px-1 rounded-sm">[{i}]</span>
                            {num}
                          </div>
                        ))}
                        <div className="flex-1 bg-purple-950/30 border border-purple-500/30 py-1 text-center rounded text-purple-400 font-bold ml-2">
                          <span className="absolute -top-1.5 -left-1 text-[8px] text-slate-600 bg-[#0A0A0A] px-1 rounded-sm">Σ</span>
                          {score.totalStableford}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] sm:text-[11px] flex flex-col gap-1.5 sm:gap-2">
                      <span className="text-slate-400 flex items-center"><Activity className="w-3 h-3 mr-1 text-slate-500"/> Node: <span className="text-white ml-1">{score.userId}</span></span>
                      <span className="text-slate-400 flex items-center"><span className="text-green-500 w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_5px_rgba(74,222,128,0.5)]"></span> Projected Withdrawal: <span className="text-green-400 font-bold ml-1">{score.amount}</span></span>
                      <span className="text-slate-400 flex items-center">Liquidity Cut: <span className="text-white ml-1">{score.poolCut}</span></span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 shrink-0 ml-2">
                    <a href={score.img} target="_blank" rel="noreferrer" className="w-full sm:w-auto px-4 py-2 border border-slate-700 text-slate-400 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-slate-800 hover:text-white transition-all whitespace-nowrap text-center block">
                      INSPECT_IMG
                    </a>
                    
                    <form action={approveAction}>
                      <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-green-950/40 border border-green-500/50 text-green-400 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-green-400 hover:text-slate-950 transition-all shadow-[0_0_10px_rgba(74,222,128,0.2)] flex items-center justify-center whitespace-nowrap">
                        <CheckSquare className="w-3 h-3 mr-2" /> CLEAR_NODE
                      </button>
                    </form>
                    
                    <form action={rejectAction}>
                      <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-red-950/40 border border-red-500/50 text-red-400 text-[10px] md:text-xs uppercase tracking-widest font-bold hover:bg-red-500 hover:text-slate-950 transition-all shadow-[0_0_10px_rgba(239,68,68,0.2)] flex items-center justify-center whitespace-nowrap">
                        <XSquare className="w-3 h-3 mr-2" /> REJECT
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
            
            {pendingScores.length === 0 && (
              <div className="px-6 py-12 text-center text-slate-500 font-mono text-sm uppercase tracking-widest bg-slate-900/40">
                [ NO PENDING VERIFICATIONS LOCATED ]
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
