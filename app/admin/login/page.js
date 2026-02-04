
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock } from 'lucide-react';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        // Simpan JWT token ke localStorage
        if (data.token) {
          localStorage.setItem('admin_session', data.token);
        }
        router.push('/admin');
      }
    } catch (err) {
      setError('Gagal login');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-emerald-50 py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 md:p-10 border border-slate-100 animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center rounded-full bg-emerald-100">
            <img src="/img/logo-kab-pacitan.png" alt="Logo Kabupaten Pacitan" className="w-9 h-9 text-emerald-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 mb-1">Login Admin</h1>
          <p className="text-slate-500 text-sm">Masuk ke dashboard admin Desa Bandar</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
            type="submit"
          >
            Login
          </button>
          {error && <div className="text-red-500 text-sm mt-2 text-center">{error}</div>}
        </form>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.16,1,0.3,1) forwards;
        }
      `}</style>
    </div>
  );
}
