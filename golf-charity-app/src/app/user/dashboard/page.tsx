import { Terminal, Shield, Crosshair, Clock, Award, Cpu } from 'lucide-react';
import ScoreEntryForm from '@/components/features/ScoreEntryForm';
import CharityUpgradeForm from '@/components/features/CharityUpgradeForm';
import UploadProofForm from '@/components/features/UploadProofForm';
import { createClient } from '@/lib/supabase/server';

export default async function UserDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch real scores
  const { data: rawScores } = await supabase
    .from('scores')
    .select('score, play_date, created_at')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  // Fetch ALL published draws (for history in uplink log)
  const { data: allDraws } = await supabase
    .from('draws')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  const latestDraw = allDraws?.[0] || null;

  // Fetch user data for charity contribution
  const { data: userData } = await supabase
    .from('users')
    .select(`
      charity_contribution_percentage,
      subscription_tier,
      selected_charity:charities ( id, name )
    `)
    .eq('id', user?.id)
    .maybeSingle() as any;
  
  const charityYield = userData?.charity_contribution_percentage || 10;

  // Group scores by play_date to reconstruct the payload arrays
  const scoreGroups: Record<string, { date: string; scores: number[]; created_at: string }> = {};
  if (rawScores) {
    rawScores.forEach(s => {
      if (!scoreGroups[s.play_date]) {
        scoreGroups[s.play_date] = { date: s.play_date, scores: [], created_at: s.created_at };
      }
      scoreGroups[s.play_date].scores.push(s.score);
    });
  }

  const sortedGroups = Object.values(scoreGroups).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Calculate the user's match status against the latest draw
  const isTier1Winner = latestDraw?.calculated_splits?.tiers?.tier1?.includes(user?.id);
  const isTier2Winner = latestDraw?.calculated_splits?.tiers?.tier2?.includes(user?.id);
  const isTier3Winner = latestDraw?.calculated_splits?.tiers?.tier3?.includes(user?.id);
  const requiresProof = isTier1Winner || isTier2Winner || isTier3Winner;

  // Figure out how many numbers the user matched in the latest draw
  let userMatchCount = 0;
  if (latestDraw?.winning_numbers && sortedGroups.length > 0) {
    const latestUserScores = sortedGroups[0].scores;
    userMatchCount = latestUserScores.filter((s: number) => latestDraw.winning_numbers.includes(s)).length;
  }

  // Combine logs chronologically for the Uplink History
  const combinedLog = [
    ...(allDraws || []).map((d: any) => ({ type: 'draw', date: new Date(d.created_at).getTime(), payload: d })),
    ...sortedGroups.map((g: any) => ({ type: 'score', date: new Date(g.created_at).getTime(), payload: g }))
  ].sort((a, b) => b.date - a.date);

  return (
    <div className="space-y-6 sm:space-y-8 relative z-10">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-amber-500/20 pb-4 sm:pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white uppercase tracking-widest flex items-center">
            <Terminal className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-amber-500" />
            USER_TELEMETRY
          </h1>
          <div className="flex items-center gap-3 sm:gap-4 mt-2">
            <p className="font-mono text-xs sm:text-sm text-slate-400">
              STATUS: <span className="text-green-400 px-1 bg-green-500/10 border border-green-500/20 rounded">VERIFIED</span>
            </p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 flex flex-col p-3 rounded text-right min-w-[130px]">
          <span className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mb-1">Target Yield</span>
          <span className="font-mono text-lg sm:text-xl text-green-400 font-bold">{charityYield}% ALLOCATED</span>
        </div>
      </div>

      {/* Latest Draw Widget + User Match Status */}
      {latestDraw && (
        <div className="bg-slate-900/50 backdrop-blur-md border border-purple-500/30 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <div className="bg-slate-900 px-3 sm:px-4 py-2.5 flex justify-between items-center border-b border-purple-500/20">
            <span className="font-mono text-[10px] sm:text-xs text-purple-400 uppercase tracking-widest flex items-center">
              <span className="w-2 h-2 rounded-full bg-purple-500 mr-2 animate-pulse"></span> LATEST DRAW RESULTS
            </span>
            <span className="font-mono text-[10px] text-slate-600">{latestDraw.draw_month}</span>
          </div>
          <div className="p-4 sm:p-6 md:p-8 font-mono">
            <div className="text-lg sm:text-xl md:text-2xl text-white font-bold tracking-widest mb-4 drop-shadow-[0_0_10px_rgba(168,85,247,0.6)]">
              PAYLOAD: [ {latestDraw.winning_numbers?.join(' | ')} ]
            </div>

            {/* User's personal match status */}
            <div className="mb-4 bg-[#080808] border border-slate-700 rounded-lg p-3 sm:p-4">
              <div className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest mb-2">Your Match Status</div>
              {userMatchCount >= 3 ? (
                <div className={`text-sm sm:text-base font-bold ${
                  userMatchCount === 5 ? 'text-amber-400' : userMatchCount === 4 ? 'text-green-400' : 'text-cyan-400'
                }`}>
                  {userMatchCount}/5 MATCHED — {userMatchCount === 5 ? 'TIER 1 JACKPOT (40%)' : userMatchCount === 4 ? 'TIER 2 (35%)' : 'TIER 3 (25%)'}
                  <span className="block text-[10px] sm:text-xs text-slate-400 mt-1 font-normal">Upload your scorecard proof below to claim your prize.</span>
                </div>
              ) : (
                <div className="text-sm text-slate-400">
                  {userMatchCount}/5 matched — No prize this round. Keep entering scores!
                </div>
              )}
            </div>
            
            {/* All winner nodes from this draw */}
            <div className="space-y-1.5 bg-[#050505] border border-slate-800 p-3 sm:p-4 rounded text-[10px] sm:text-xs md:text-sm">
              <div className="text-slate-500 mb-2 text-[10px] uppercase tracking-widest">All Matched Nodes</div>
              {latestDraw.calculated_splits?.tiers?.tier1?.map((id: string) => (
                <div key={`t1-${id}`} className={`text-amber-400 ${id === user?.id ? 'font-bold bg-amber-950/20 px-2 py-1 rounded border border-amber-500/20' : ''}`}>
                  &gt; TIER 1 (5/5): {id === user?.id ? 'YOU' : `id_${id.substring(0,8)}***`} — ${(latestDraw.calculated_splits.payouts.tier1_per_winner || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
                </div>
              ))}
              {latestDraw.calculated_splits?.tiers?.tier2?.map((id: string) => (
                <div key={`t2-${id}`} className={`text-green-400 ${id === user?.id ? 'font-bold bg-green-950/20 px-2 py-1 rounded border border-green-500/20' : ''}`}>
                  &gt; TIER 2 (4/5): {id === user?.id ? 'YOU' : `id_${id.substring(0,8)}***`} — ${(latestDraw.calculated_splits.payouts.tier2_per_winner || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
                </div>
              ))}
              {latestDraw.calculated_splits?.tiers?.tier3?.map((id: string) => (
                <div key={`t3-${id}`} className={`text-cyan-400 ${id === user?.id ? 'font-bold bg-cyan-950/20 px-2 py-1 rounded border border-cyan-500/20' : ''}`}>
                  &gt; TIER 3 (3/5): {id === user?.id ? 'YOU' : `id_${id.substring(0,8)}***`} — ${(latestDraw.calculated_splits.payouts.tier3_per_winner || 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
                </div>
              ))}
              {(!latestDraw.calculated_splits?.tiers?.tier1?.length && 
                !latestDraw.calculated_splits?.tiers?.tier2?.length && 
                !latestDraw.calculated_splits?.tiers?.tier3?.length) && (
                <div className="text-red-500 font-bold uppercase animate-pulse tracking-widest">
                  &gt; NO MATCHES THIS ROUND. JACKPOT ROLLS OVER.
                </div>
              )}
            </div>
            
            {requiresProof && (
              <div className="mt-4 bg-amber-950/10 border border-amber-500/30 rounded-lg p-4">
                {(userData?.subscription_tier === 'monthly' || userData?.subscription_tier === 'yearly') ? (
                  <>
                    <div className="font-mono text-xs text-amber-400 uppercase tracking-widest mb-3">Winner Proof Required</div>
                    <UploadProofForm />
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="font-mono text-xs text-red-400 uppercase tracking-widest mb-2 font-bold">[ ACCESS_DENIED ]</div>
                    <p className="font-mono text-[11px] sm:text-xs text-slate-400">You are on the <span className="text-cyan-400 font-bold">DEMO</span> plan. Proof submission and payouts are only available to <span className="text-green-400 font-bold">Monthly</span> or <span className="text-blue-400 font-bold">Yearly</span> subscribers.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Grid: Score Entry Only */}
      <div className="grid grid-cols-1 gap-6 sm:gap-8">
        {/* Score Entry Panel */}
        <div className="w-full">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden hover:border-amber-500/30 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.3)]">
            <div className="bg-slate-900 px-3 sm:px-4 py-2.5 flex justify-between items-center border-b border-slate-800">
              <span className="font-mono text-[10px] sm:text-xs text-amber-500 uppercase tracking-widest flex items-center">
                <span className="w-2 h-2 rounded-full bg-amber-500 mr-2 animate-pulse"></span> upload_matrix.exe
              </span>
              <Shield className="w-4 h-4 text-green-500" />
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <h2 className="text-lg sm:text-xl font-mono font-bold text-white mb-3 sm:mb-4 uppercase tracking-wider">Commit Telemetry Data</h2>
              <p className="text-slate-400 font-sans text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">
                Enter 5 integers between 1 and 45 from your latest round. These numbers become your monthly draw entry.
              </p>
              <ScoreEntryForm />
            </div>
          </div>
        </div>
      </div>

      {/* Uplink Log — Score History + Draw History Combined */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.3)]">
        <div className="bg-slate-900 px-3 sm:px-4 py-2.5 flex justify-between items-center border-b border-slate-800">
          <h3 className="font-mono text-[10px] sm:text-xs text-white font-bold uppercase tracking-widest flex items-center">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-slate-500" /> Uplink Log
          </h3>
          <span className="font-mono text-[10px] text-slate-600">
            {sortedGroups.length} SCORES / {(allDraws || []).length} DRAWS
          </span>
        </div>
        
        <div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3 max-h-[50vh] overflow-y-auto">
          {combinedLog.length === 0 ? (
            <div className="text-slate-500 font-mono text-xs text-center py-6 opacity-50 border border-slate-800/50 rounded border-dashed">
              [ NO TELEMETRY DATA FOUND ]
            </div>
          ) : (
            combinedLog.map((logItem, idx) => {
              if (logItem.type === 'draw') {
                const draw = logItem.payload;
                const myScores = sortedGroups[0]?.scores || [];
                const myMatches = myScores.filter((s: number) => draw.winning_numbers?.includes(s)).length;
                return (
                  <div key={`draw-${draw.id}`} className="font-mono text-[10px] sm:text-xs bg-purple-950/10 border border-purple-500/20 p-3 rounded hover:bg-purple-950/20 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <span className="flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-purple-400" />
                        <span className="text-purple-400 uppercase font-bold">Draw: {draw.draw_month}</span>
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
                        myMatches >= 5 ? 'bg-amber-950/40 text-amber-400 border-amber-500/30' :
                        myMatches >= 4 ? 'bg-green-950/40 text-green-400 border-green-500/30' :
                        myMatches >= 3 ? 'bg-cyan-950/40 text-cyan-400 border-cyan-500/30' :
                        'bg-slate-900 text-slate-500 border-slate-700'
                      }`}>
                        {myMatches}/5 MATCH
                      </span>
                    </div>
                    <div className="text-white tracking-wider">
                      [{draw.winning_numbers?.join(', ')}]
                    </div>
                  </div>
                );
              } else {
                const group = logItem.payload;
                // Since it's chronological, the first 'score' type we find is the most recent ACK
                const isLatestScore = combinedLog.filter(l => l.type === 'score')[0] === logItem;
                return (
                  <div key={`score-${idx}`} className="flex justify-between items-center font-mono text-[10px] sm:text-xs border-b border-slate-800/50 pb-2 sm:pb-3 hover:bg-slate-800/30 transition-colors px-2 -mx-2 rounded">
                    <div className="flex flex-col gap-0.5 sm:gap-1">
                      <span className="text-slate-500 text-[10px]">{new Date(group.created_at).toISOString().replace('T', ' ').substring(0, 19)}</span>
                      <span className="text-white font-bold">[{group.scores.join(', ')}]</span>
                    </div>
                    {isLatestScore ? (
                      <span className="text-green-400 border border-green-500/30 bg-green-950/30 px-2 py-0.5 rounded text-[10px] uppercase flex items-center">
                        <Award className="w-3 h-3 mr-1" /> ACK
                      </span>
                    ) : (
                      <span className="text-slate-500 border border-slate-700/50 bg-slate-900 px-2 py-0.5 rounded text-[10px] uppercase">
                        ARCHIVED
                      </span>
                    )}
                  </div>
                );
              }
            })
          )}
        </div>
      </div>
    </div>
  );
}
