import { Users, Search, AlertOctagon } from 'lucide-react';
import { verifyAdmin } from '@/app/actions/admin';
import UserAccordionList from './UserAccordionList';

export default async function AdminUsersPage() {
  const supabase = await verifyAdmin();
  const { data: dbUsers, error } = await supabase.from('users').select(`
    id,
    subscription_status,
    subscription_tier,
    charity_contribution_percentage,
    scores ( id, score, play_date, status )
  `);

  const users = (dbUsers || []).map(u => ({
    id: u.id.substring(0, 6) + '...',
    username: u.id,
    target: 'CHARITY_YIELD_' + Math.floor(u.charity_contribution_percentage || 10) + '%',
    plan: (u.subscription_tier || 'demo').toUpperCase(),
    status: u.subscription_status === 'active' ? 'ONLINE' : 'OFFLINE',
    latestScoreId: (u.scores && u.scores.length > 0) ? u.scores[0].id : ''
  }));

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="mb-6 sm:mb-8 border-b border-purple-500/20 pb-4 sm:pb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white uppercase tracking-widest flex items-center">
          <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400" />
          USER_REGISTRY
        </h1>
        <p className="font-mono text-xs sm:text-sm text-slate-400 mt-1 sm:mt-2">NETWORK PARTICIPANTS // MANAGE_NODES & SCORES</p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {/* Search Bar */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
          <div className="relative flex-grow max-w-md flex items-center bg-[#0A0A0A] border border-slate-800 rounded focus-within:border-purple-400 focus-within:shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all">
            <span className="pl-3 sm:pl-4 text-purple-500 font-mono font-bold text-xs sm:text-sm">$ grep -i</span>
            <input 
              type="text" 
              placeholder='"username"' 
              className="w-full bg-transparent px-2 sm:px-3 py-2.5 sm:py-3 text-white font-mono text-xs sm:text-sm focus:outline-none placeholder:text-slate-600"
            />
            <Search className="w-4 h-4 text-slate-500 mr-3 sm:mr-4 flex-shrink-0" />
          </div>
          <button className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-purple-950/40 border border-purple-500 text-purple-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all text-center">
            [ ADD_USER_NODE ]
          </button>
        </div>

        {/* RLS Warning if empty */}
        {users.length === 0 && (
          <div className="bg-red-950/40 border border-red-500/50 p-3 sm:p-4 mx-4 sm:mx-6 mt-3 sm:mt-4 text-red-500 font-mono text-xs sm:text-sm">
            <span className="font-bold uppercase tracking-widest block mb-1">
              <AlertOctagon className="w-4 h-4 inline mr-2 align-text-bottom" />
              DATABASE WARNING: [ 0 ROWS RETURNED ]
            </span>
            <span className="text-red-400">If users exist but aren't showing, Supabase Row-Level Security (RLS) is blocking the Anon Key. You must execute an RLS Admin-Bypass snippet in the Supabase SQL Editor.</span>
          </div>
        )}

        {/* Accordion List — Mobile First */}
        <UserAccordionList users={users} />
      </div>
    </div>
  );
}
