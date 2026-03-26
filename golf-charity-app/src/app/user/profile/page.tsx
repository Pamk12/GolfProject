import { Terminal, Mail, Shield, LogOut, User, Calendar, Key } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import EmailChangeForm from '@/components/features/EmailChangeForm';
import ProfileLogoutButton from '@/components/features/ProfileLogoutButton';

export default async function UserProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: userData } = await supabase
    .from('users')
    .select(`
      charity_contribution_percentage,
      subscription_status,
      subscription_tier,
      selected_charity:charities ( id, name )
    `)
    .eq('id', user.id)
    .single() as any;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-500/30 relative">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 relative z-10">
        
        {/* Terminal Window */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-[0_0_30px_rgba(251,191,36,0.1)] overflow-hidden">
          {/* Title Bar */}
          <div className="bg-slate-900 px-4 py-3 flex items-center border-b border-slate-800">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="ml-4 font-mono text-xs text-slate-500">user_profile.sh</div>
          </div>

          <div className="p-5 sm:p-8">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 sm:gap-5 mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-amber-950 border-2 border-amber-500/50 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                <User className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-mono font-bold text-white uppercase tracking-widest">
                  User Profile
                </h1>
                <p className="font-mono text-xs sm:text-sm text-slate-400 mt-1">
                  Account Settings & Security
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="space-y-4 sm:space-y-5">
              
              {/* Email */}
              <div className="bg-[#0A0A0A] border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest">Email Address</span>
                </div>
                <p className="font-mono text-sm sm:text-base text-white break-all">{user.email}</p>
              </div>

              {/* UID */}
              <div className="bg-[#0A0A0A] border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Key className="w-4 h-4 text-cyan-500" />
                  <span className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest">User ID</span>
                </div>
                <p className="font-mono text-xs sm:text-sm text-slate-300 break-all">{user.id}</p>
              </div>

              {/* Join Date */}
              <div className="bg-[#0A0A0A] border border-slate-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-green-500" />
                  <span className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest">Member Since</span>
                </div>
                <p className="font-mono text-sm text-slate-300">
                  {new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Subscription & Charity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#0A0A0A] border border-slate-800 rounded-lg p-4">
                  <span className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest block mb-2">Subscription</span>
                  <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded border ${
                    userData?.subscription_tier === 'monthly' || userData?.subscription_tier === 'yearly' 
                      ? 'text-green-400 bg-green-950/30 border-green-500/30' 
                      : 'text-amber-400 bg-amber-950/30 border-amber-500/30'
                  }`}>
                    {userData?.subscription_tier === 'monthly' ? '[ MONTHLY PLAN ]' : 
                     userData?.subscription_tier === 'yearly' ? '[ YEARLY PLAN ]' : 
                     '[ DEMO PLAN ]'}
                  </span>
                </div>
                <div className="bg-[#0A0A0A] border border-slate-800 rounded-lg p-4">
                  <span className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest block mb-2">Charity Node</span>
                  <span className="font-mono text-sm text-cyan-400 font-bold">
                    {userData?.selected_charity?.name || 'Not selected'}
                  </span>
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-slate-800 rounded-lg p-4">
                <span className="font-mono text-[10px] sm:text-xs text-slate-500 uppercase tracking-widest block mb-2">Charity Contribution</span>
                <span className="font-mono text-lg text-green-400 font-bold">
                  {userData?.charity_contribution_percentage || 10}% of subscription
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-800 my-6 sm:my-8"></div>

            {/* Email Change Section */}
            <div className="mb-6 sm:mb-8">
              <h2 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-widest mb-1 flex items-center">
                <Shield className="w-4 h-4 mr-2 text-amber-500" /> Change Email
              </h2>
              <p className="font-mono text-[10px] sm:text-xs text-slate-500 mb-4">
                A verification email will be sent to your new address. A security alert will be sent to your current address.
              </p>
              <EmailChangeForm currentEmail={user.email || ''} />
            </div>

            {/* Divider */}
            <div className="border-t border-slate-800 my-6 sm:my-8"></div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a 
                href="/user/dashboard" 
                className="flex-1 flex items-center justify-center py-3 bg-slate-950 border border-slate-700 text-slate-400 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest hover:border-amber-500/50 hover:text-amber-400 transition-all rounded"
              >
                <Terminal className="w-4 h-4 mr-2" /> Back to Dashboard
              </a>
              <ProfileLogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
