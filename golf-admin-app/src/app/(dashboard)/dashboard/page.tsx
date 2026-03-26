import { Terminal, Activity, DollarSign, Users, Database } from 'lucide-react';
import { getSystemAnalyticsAction, verifyAdmin } from '@/app/actions/admin';
import { createClient } from '@/lib/supabase/server';

// Note: Re-validates periodically or on-demand
export const revalidate = 60; 

export default async function AdminDashboard() {
  const stats = await getSystemAnalyticsAction();
  
  const supabase = await verifyAdmin();
  const { count } = await supabase
    .from('scores')
    .select('*', { count: 'exact', head: true })
    .in('status', ['pending', 'flagged']);
    
  const pendingCount = count || 0;

  // Generate dynamic timestamps for the terminal log (HH:MM:SS)
  const now = new Date();
  const ts1 = new Date(now.getTime() - 1000 * 60 * 25).toTimeString().substring(0, 8);
  const ts2 = new Date(now.getTime() - 1000 * 60 * 24).toTimeString().substring(0, 8);
  const ts3 = new Date(now.getTime() - 1000 * 60 * 15).toTimeString().substring(0, 8);
  const ts4 = now.toTimeString().substring(0, 8);

  return (
    <div className="space-y-8">
      <div className="mb-6 sm:mb-8 border-b border-purple-500/20 pb-4 sm:pb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white uppercase tracking-widest flex items-center">
          <Terminal className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400" />
          SYS_METRICS
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">GLOBAL NETWORK OVERVIEW // ROOT_ACCESS</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 tracking-widest">
        {/* Metric 1 */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-4 sm:p-6 flex flex-col items-start relative overflow-hidden group hover:border-purple-500/30 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-[-10px] p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-20 h-20 text-purple-400" />
          </div>
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2 relative z-10">Total Enrolled Nodes</span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-white relative z-10 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">
            {stats.totalUsers.toLocaleString()}
          </span>
          <span className="font-mono text-[10px] bg-green-950/40 border border-green-500/30 px-2 py-0.5 rounded text-green-400 mt-3 relative z-10 flex items-center">
             <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse mr-1.5"></span>
             {stats.activeSubs.toLocaleString()} ACTIVE
          </span>
        </div>
        
        {/* Metric 2 */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex flex-col items-start relative overflow-hidden group hover:border-green-500/30 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-[-10px] p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-20 h-20 text-green-400" />
          </div>
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2 relative z-10">Total Prize Pool</span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-green-400 relative z-10 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]">
            ${stats.projectedPrizePool.toLocaleString()}
          </span>
          <span className="font-mono text-[10px] bg-green-950/40 border border-green-500/30 px-2 py-0.5 rounded text-green-400 mt-3 relative z-10">
            LIQUIDITY_SECURED
          </span>
        </div>
        
        {/* Metric 3 */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex flex-col items-start relative overflow-hidden group hover:border-amber-500/30 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-[-10px] p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity className="w-20 h-20 text-amber-400" />
          </div>
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2 relative z-10">Charity Yields</span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-amber-400 relative z-10 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]">
            ${stats.charityContributionTotal.toLocaleString()}
          </span>
          <span className="font-mono text-[10px] text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2 py-0.5 rounded mt-3 relative z-10">
            AWAITING_ROUTING
          </span>
        </div>
        
        {/* Metric 4 */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-xl p-6 flex flex-col items-start relative overflow-hidden group hover:border-cyan-500/30 transition-all shadow-[0_0_20px_rgba(0,0,0,0.3)]">
          <div className="absolute top-0 right-[-10px] p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Database className="w-20 h-20 text-cyan-400" />
          </div>
          <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2 relative z-10">System Status</span>
          <span className="font-mono text-2xl sm:text-3xl font-bold text-cyan-400 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">OPT</span>
          <span className="font-mono text-[10px] text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded mt-3 relative z-10">
            NODE_CONSENSUS
          </span>
        </div>
      </div>


      {/* Terminal Output mock */}
      <div className="mt-6 sm:mt-8 bg-[#0A0A0A] border border-slate-800 rounded-xl p-3 sm:p-4 lg:p-6 font-mono text-[10px] sm:text-xs md:text-sm text-slate-400 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-x-auto">
        <div className="flex justify-between items-center mb-3 sm:mb-4 border-b border-slate-800 pb-2 sm:pb-3">
          <div className="flex items-center text-purple-400 font-bold tracking-widest text-[10px] sm:text-xs md:text-sm">
            <Terminal className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" /> root@dheroes:/var/log/syslog
          </div>
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
        </div>
        <div className="space-y-2">
          <div><span className="text-slate-600">[{ts1}]</span> <span className="text-green-400">INFO</span> Compiled latest aggregated liquidity arrays ... <span className="text-green-400">OK</span></div>
          <div><span className="text-slate-600">[{ts2}]</span> <span className="text-green-400">INFO</span> Charity distribution set to ${stats.charityContributionTotal.toLocaleString()} ... <span className="text-green-400">OK</span></div>
          <div><span className="text-slate-600">[{ts3}]</span> <span className="text-amber-400">WARN</span> {pendingCount} pending verifications blocking payout sequence.</div>
          <div><span className="text-slate-600">[{ts4}]</span> <span className="text-green-400">INFO</span> RNG module ready for processing batch #042.</div>
          <div className="text-purple-400 animate-pulse mt-4 flex">
            <span>&gt;</span> <span className="w-2 h-4 bg-purple-400 ml-1 inline-block"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
