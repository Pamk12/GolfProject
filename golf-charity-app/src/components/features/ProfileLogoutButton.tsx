'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfileLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      className="flex-1 flex items-center justify-center py-3 bg-red-950/30 border border-red-500/50 text-red-400 font-mono text-xs sm:text-sm font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] rounded"
    >
      <LogOut className="w-4 h-4 mr-2" /> Logout
    </button>
  );
}
