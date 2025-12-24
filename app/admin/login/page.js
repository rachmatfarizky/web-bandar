'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      router.push('/admin');
    }
  }

  return (
    <div className="max-w-sm mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Login Admin</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" className="border p-2 w-full" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" className="border p-2 w-full" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded w-full" type="submit">Login</button>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
}
