
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="max-w-sm mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Login Admin</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="text" className="border p-2 w-full" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required />
        <input type="password" className="border p-2 w-full" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded w-full" type="submit">Login</button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
}
