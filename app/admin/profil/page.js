"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import SidebarAdmin from "../../../components/SidebarAdmin";
import { useRouter } from "next/navigation";

export default function AdminProfilePage() {
  const router = useRouter();
    async function handleLogout() {
      await supabase.auth.signOut();
      router.push('/admin/login');
    }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        setUser(data.session.user);
        setName(data.session.user.user_metadata?.name || "");
      }
      setLoading(false);
    });
  }, []);


  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const { error, data } = await supabase.auth.updateUser({ data: { name } });
    if (error) setError(error.message);
    else {
      setMessage("Nama berhasil diupdate.");
      setUser(u => ({ ...u, user_metadata: { ...u.user_metadata, name } }));
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8 text-red-500">Anda belum login.</div>;

  return (
    <>
      <SidebarAdmin active="profil" onLogout={handleLogout} user={user} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100" style={{ marginLeft: '224px' }}>
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Profil Admin</h2>
          <form onSubmit={handleNameUpdate} className="mb-6">
            <label className="block text-slate-600 mb-1">Nama Admin</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2 rounded border"
                required
              />
              <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded font-semibold">Simpan</button>
            </div>
          </form>
          <div className="mb-6">
            <label className="block text-slate-600 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-2 rounded border bg-slate-100"
            />
          </div>
          {message && <div className="text-green-600 mt-2 text-center">{message}</div>}
          {error && <div className="text-red-600 mt-2 text-center">{error}</div>}
        </div>
      </div>
    </>
  );
}
