'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldCheck, Trash2 } from 'lucide-react';
import { adminEditUserScoreAction, adminDeleteUserAction } from '@/app/actions/admin';

interface UserRow {
  id: string;
  username: string;
  target: string;
  plan: string;
  status: string;
  latestScoreId: string;
}

export default function UserAccordionList({ users }: { users: UserRow[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const toggle = (username: string) => {
    setExpandedId(prev => (prev === username ? null : username));
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('WARNING: This will permanently erase user node ' + userId.substring(0, 6) + '... and all associated telemetry. Proceed?')) return;
    setDeletingId(userId);
    try {
      await adminDeleteUserAction(userId);
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditScore = async (scoreId: string) => {
    try {
      await adminEditUserScoreAction(scoreId, 36);
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <div className="divide-y divide-slate-800/50">
      {users.map(user => {
        const isExpanded = expandedId === user.username;
        const isDeleting = deletingId === user.username;

        return (
          <div key={user.username} className="group">
            {/* Collapsed Row — always visible */}
            <button
              onClick={() => toggle(user.username)}
              className="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-slate-800/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${user.status === 'ONLINE' ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-white font-mono font-bold tracking-widest text-xs sm:text-sm truncate">{user.id}</span>
                <span className={`px-1.5 py-0.5 text-[9px] sm:text-[10px] rounded uppercase font-bold tracking-widest flex-shrink-0 ${
                  user.status === 'ONLINE' ? 'bg-green-950/40 border-green-500/30 text-green-400 border' : 'bg-slate-900 border-slate-700 text-slate-500 border'
                }`}>
                  {user.status === 'ONLINE' && <ShieldCheck className="w-2.5 h-2.5 mr-0.5 inline" />}
                  {user.status === 'ONLINE' ? 'CONN' : 'OFF'}
                </span>
              </div>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-purple-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />}
            </button>

            {/* Expanded Dropdown — details + actions */}
            {isExpanded && (
              <div className="bg-[#070709] border-t border-slate-800 px-4 sm:px-6 py-4 space-y-3 animate-[fadeIn_0.15s_ease-in]">
                {/* Participant ID */}
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Participant_ID</span>
                  <span className="font-mono text-xs text-white break-all">{user.username}</span>
                </div>

                {/* Target Node + Plan */}
                <div className="flex flex-col sm:flex-row sm:gap-8 gap-3">
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Target_Node</span>
                    <span className="font-mono text-xs text-cyan-400 font-bold tracking-widest">{user.target}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Subscription</span>
                    <span className="font-mono text-[10px] text-slate-400 bg-slate-900 border border-slate-700 px-1.5 py-0.5 rounded w-max">[{user.plan} PLAN]</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800">
                  {user.latestScoreId && (
                    <button
                      onClick={() => handleEditScore(user.latestScoreId)}
                      className="w-full sm:w-auto px-4 py-2.5 bg-purple-950/40 border border-purple-500/50 text-purple-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold hover:bg-purple-500 hover:text-white transition-all text-center"
                    >
                      [ MOD_SCORE (36) ]
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(user.username)}
                    disabled={isDeleting}
                    className="w-full sm:w-auto px-4 py-2.5 bg-red-950/40 border border-red-500/50 text-red-400 font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3" />
                    {isDeleting ? '[ ERASING... ]' : '[ ERASE_NODE ]'}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {users.length === 0 && (
        <div className="px-6 py-12 text-center text-slate-500 font-mono text-sm uppercase tracking-widest bg-slate-900/40">
          [ NO USER NODES LOCATED ]
        </div>
      )}
    </div>
  );
}
