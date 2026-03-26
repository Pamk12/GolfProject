import { Heart, AlertOctagon } from 'lucide-react';
import { verifyAdmin } from '@/app/actions/admin';

export default async function AdminCharitiesPage() {
  const supabase = await verifyAdmin();

  const { data: charities, error } = await supabase
    .from('charities')
    .select('*')
    .order('name');

  return (
    <div className="space-y-8">
      <div className="mb-6 sm:mb-8 border-b border-purple-500/20 pb-4 sm:pb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-white uppercase tracking-widest flex items-center">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-400" />
          CHARITY_REGISTRY
        </h1>
        <p className="font-mono text-[10px] sm:text-xs lg:text-sm text-slate-400 mt-1 sm:mt-2">ROUTING NODE MANAGEMENT // ADD, EDIT, AUDIT</p>
      </div>

      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
        {(!charities || charities.length === 0) && (
          <div className="bg-red-950/40 border border-red-500/50 p-4 mx-6 mt-4 text-red-500 font-mono text-xs sm:text-sm">
            <span className="font-bold uppercase tracking-widest block mb-1">
              <AlertOctagon className="w-4 h-4 inline mr-2 align-text-bottom" />
              DATABASE WARNING: [ 0 ROWS RETURNED ]
            </span>
            <span className="text-red-400">No charities found. Seed one via Supabase Studio or via a migration script.</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs sm:text-sm">
            <thead className="bg-[#0A0A0A] border-b border-slate-800 text-slate-500 text-[10px] sm:text-xs uppercase tracking-widest">
              <tr>
                <th className="px-3 sm:px-6 py-3 sm:py-4">Node_Name</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">Description</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 border-l border-slate-800">Featured</th>
                <th className="px-3 sm:px-6 py-3 sm:py-4 text-right">UID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {(charities || []).map((c: any) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-white font-bold tracking-widest text-xs sm:text-sm">{c.name}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-slate-400 text-[10px] sm:text-xs max-w-xs truncate hidden sm:table-cell">{c.description}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 border-l border-slate-800">
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 text-[9px] sm:text-[10px] rounded uppercase font-bold tracking-widest ${
                      c.featured ? 'bg-amber-950/40 border-amber-500/30 text-amber-400 border' : 'bg-slate-900 border-slate-700 text-slate-500 border'
                    }`}>
                      {c.featured ? 'FEATURED' : 'STANDARD'}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-right text-slate-500 text-[10px] sm:text-xs">{c.id?.substring(0, 8)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
