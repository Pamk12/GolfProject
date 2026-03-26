'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 hover:text-red-400 font-mono text-xs tracking-widest border border-red-500/30 bg-red-950/20 px-4 py-1.5 rounded hover:bg-red-900/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all flex items-center"
    >
      <LogOut className="w-4 h-4 mr-2" />
      [ EXIT_SESSION ]
    </button>
  );
}
