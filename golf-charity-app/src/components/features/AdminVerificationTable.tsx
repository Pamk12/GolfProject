import { Button } from "@/components/ui/Button";
import { createClient } from '@/lib/supabase/server';

export default async function AdminVerificationTable() {
  const supabase = await createClient();
  
  // Fetch scores
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <table className="w-full text-left border-collapse">
      <thead className="bg-slate-50 border-b border-slate-200">
        <tr>
          <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Player / Round</th>
          <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider">Evidence</th>
          <th className="px-6 py-4 font-semibold text-xs text-slate-500 uppercase tracking-wider text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white text-sm">
        {!scores || scores.length === 0 ? (
          <tr>
            <td colSpan={3} className="px-6 py-8 text-center text-slate-500 font-mono text-xs">
              [ NO PENDING VERIFICATIONS ]
            </td>
          </tr>
        ) : (
          scores.map((scoreEntry) => (
            <tr key={scoreEntry.id}>
              <td className="px-6 py-5">
                <div className="font-bold text-slate-900 font-mono text-xs truncate max-w-[200px]" title={scoreEntry.user_id}>UID: {scoreEntry.user_id.substring(0, 8)}...</div>
                <div className="text-slate-500 mt-1 font-mono text-xs">Score: <span className="text-slate-900 font-bold">{scoreEntry.score}</span> ({scoreEntry.play_date})</div>
                <div className="mt-2 inline-flex items-center px-2 py-1 bg-amber-50 text-amber-700 rounded text-xs font-medium">Pending Highlight Win</div>
              </td>
              <td className="px-6 py-5">
                <a href="#" className="text-blue-600 hover:underline flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View Scorecard Screenshot
                </a>
              </td>
              <td className="px-6 py-5 text-right space-x-3">
                <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">Reject</Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve & Pay</Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
