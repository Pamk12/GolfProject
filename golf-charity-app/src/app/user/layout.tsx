import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-amber-500/30">
      <Navbar />
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
        {children}
      </main>
    </div>
  );
}
