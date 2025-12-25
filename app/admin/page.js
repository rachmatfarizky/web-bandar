'use client';

import Link from 'next/link';
import { LogOut, FileText, Home, Users, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user);
    });
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/admin/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex">
      {/* Sidebar */}
      <aside className={`fixed z-30 inset-y-0 left-0 w-64 bg-white border-r border-slate-100 shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} transition-transform duration-200 ease-in-out md:relative md:translate-x-0 md:w-64`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
          <Home className="w-7 h-7 text-emerald-600" />
          <span className="font-bold text-lg text-slate-800">Admin Desa Bandar</span>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          <Link href="/admin/artikel" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-emerald-50 font-medium transition">
            <FileText className="w-5 h-5 text-emerald-500" /> Kelola Artikel
          </Link>
          <Link href="/admin/dusun" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:bg-emerald-50 font-medium transition">
            <Users className="w-5 h-5 text-emerald-500" /> Kelola Dusun
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 w-full px-4 py-6 border-t border-slate-100">
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-h-screen ml-0 md:ml">
        {/* Topbar */}
        <header className="flex items-center justify-between px-6 py-6 bg-white border-b border-slate-100 shadow-sm sticky top-0 z-20">
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-emerald-600 focus:outline-none">
              <Menu className="w-7 h-7" />
            </button>
            <span className="font-bold text-lg text-slate-800">Admin</span>
          </div>
          <div className="hidden md:block">
            <h1 className="text-2xl font-bold text-slate-800">Dashboard Admin</h1>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <span className="text-slate-600 text-sm">{user.email}</span>
            )}
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-slate-100">
              <FileText className="w-10 h-10 text-emerald-500 bg-emerald-100 rounded-xl p-2" />
              <div>
                <p className="text-slate-500 text-sm">Total Artikel</p>
                <h3 className="text-2xl font-bold text-slate-800">-</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-slate-100">
              <Users className="w-10 h-10 text-emerald-500 bg-emerald-100 rounded-xl p-2" />
              <div>
                <p className="text-slate-500 text-sm">Total Dusun</p>
                <h3 className="text-2xl font-bold text-slate-800">-</h3>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center gap-4 border border-slate-100">
              <Home className="w-10 h-10 text-emerald-500 bg-emerald-100 rounded-xl p-2" />
              <div>
                <p className="text-slate-500 text-sm">Selamat Datang</p>
                <h3 className="text-2xl font-bold text-slate-800">Admin</h3>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Akses Cepat</h2>
            <div className="flex flex-col md:flex-row gap-6">
              <Link href="/admin/artikel" className="flex-1 px-6 py-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 font-semibold text-lg flex items-center gap-3 transition shadow">
                <FileText className="w-6 h-6" /> Kelola Artikel
              </Link>
              <Link href="/admin/dusun" className="flex-1 px-6 py-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-700 font-semibold text-lg flex items-center gap-3 transition shadow">
                <Users className="w-6 h-6" /> Kelola Dusun
              </Link>
            </div>
          </div>
        </main>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .md\\:ml-64 { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
