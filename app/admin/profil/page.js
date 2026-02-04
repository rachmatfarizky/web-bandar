"use client";
import React, { useEffect, useState, useRef } from "react";
// Supabase removed: use MySQL-based API for user session/profile
import SidebarAdmin from "../../../components/SidebarAdmin";
import { useRouter } from "next/navigation";

export default function AdminProfilePage() {
  const router = useRouter();
    async function handleLogout() {
      // Call logout API to clear server-side cookie
      await fetch('/api/admin/logout', { method: 'POST' });
      // Also clear localStorage for compatibility
      localStorage.removeItem('admin_session');
      router.push('/admin/login');
    }
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  // Password update state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwMessage, setPwMessage] = useState("");
  const [pwError, setPwError] = useState("");
  const [oldPwStatus, setOldPwStatus] = useState(null); // null, 'checking', 'valid', 'invalid'
  const debounceTimer = useRef(null);

  const validatePassword = (pw) => {
    const errors = [];
    if (pw.length < 8) errors.push('minimal 8 karakter');
    if (!/[A-Z]/.test(pw)) errors.push('minimal 1 huruf besar');
    if (!/[a-z]/.test(pw)) errors.push('minimal 1 huruf kecil');
    if (!/[0-9]/.test(pw)) errors.push('minimal 1 angka');
    return errors;
  };

  const validateOldPassword = async (password) => {
    if (!password) {
      setOldPwStatus(null);
      return;
    }
    setOldPwStatus('checking');
    const session = localStorage.getItem('admin_session');
    try {
      const res = await fetch('/api/admins/me/password-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`
        },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      setOldPwStatus(data.valid ? 'valid' : 'invalid');
    } catch {
      setOldPwStatus('invalid');
    }
  };

  const handleOldPasswordChange = (e) => {
    const password = e.target.value;
    setOldPassword(password);
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer for validation
    debounceTimer.current = setTimeout(() => {
      validateOldPassword(password);
    }, 500); // Validasi setelah 500ms pengguna berhenti mengetik
  };

  const pwErrors = validatePassword(newPassword);
  const pwValid = newPassword.length > 0 && pwErrors.length === 0;

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPwMessage("");
    setPwError("");
    const session = localStorage.getItem('admin_session');
    if (!session) {
      setPwError('Tidak ada sesi login.');
      return;
    }
    if (!oldPassword || !newPassword) {
      setPwError('Password lama dan baru wajib diisi.');
      return;
    }
    if (pwErrors.length > 0) {
      setPwError('Password baru tidak memenuhi syarat keamanan.');
      return;
    }
    if (oldPassword === newPassword) {
      setPwError('Password baru harus berbeda dengan password lama.');
      return;
    }
    if (oldPwStatus !== 'valid') {
      setPwError('Password lama belum divalidasi atau salah.');
      return;
    }
    try {
      const res = await fetch('/api/admins/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPwMessage('Password berhasil diupdate.');
        setOldPassword("");
        setNewPassword("");
      } else {
        setPwError(data.error || 'Gagal update password.');
      }
    } catch {
      setPwError('Gagal update password.');
    }
  };

  useEffect(() => {
    // Get session from localStorage
    const session = localStorage.getItem('admin_session');
    if (!session) {
      setLoading(false);
      return;
    }
    // Fetch user profile from API
    fetch('/api/admins/me', {
      headers: { 'Authorization': `Bearer ${session}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.user) {
          setUser(data.user);
          setName(data.user.name || '');
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);


  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    const session = localStorage.getItem('admin_session');
    if (!session) {
      setError('Tidak ada sesi login.');
      return;
    }
    try {
      const res = await fetch('/api/admins/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session}`
        },
        body: JSON.stringify({ name })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setMessage('Nama berhasil diupdate.');
        setUser(u => ({ ...u, name }));
      } else {
        setError(data.error || 'Gagal update nama.');
      }
    } catch {
      setError('Gagal update nama.');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return <div className="p-8 text-red-500">Anda belum login.</div>;

  return (
    <>
      <SidebarAdmin active="profil" onLogout={handleLogout} user={user} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-10 px-2 md:px-0" style={{ marginLeft: '224px' }}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            <h2 className="text-3xl font-extrabold mb-8 text-slate-800">Profil Admin</h2>
            
            {/* Profil Section */}
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-6 text-emerald-700">Informasi Profil</h3>
              
              <form onSubmit={handleNameUpdate} className="space-y-4 mb-6">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Nama Admin</label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50"
                      required
                    />
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow transition">Simpan</button>
                  </div>
                  {message && <div className="text-green-600 text-sm font-semibold mt-2">{message}</div>}
                  {error && <div className="text-red-600 text-sm font-semibold mt-2">{error}</div>}
                </div>
              </form>
              
              <div>
                <label className="block text-slate-700 font-semibold mb-2">Username</label>
                <input
                  type="text"
                  value={user.username}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none shadow-sm bg-slate-100 text-slate-600"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200 my-8"></div>

            {/* Password Section */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-emerald-700">Ubah Password</h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Password Lama</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={handleOldPasswordChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50 ${
                      oldPassword.length === 0
                        ? 'border-slate-200 focus:border-emerald-500'
                        : oldPwStatus === 'checking'
                        ? 'border-yellow-300 focus:border-yellow-500'
                        : oldPwStatus === 'valid'
                        ? 'border-green-300 focus:border-green-500'
                        : 'border-red-300 focus:border-red-500'
                    }`}
                    required
                  />
                  {oldPassword.length > 0 && (
                    <div className={`mt-2 text-sm font-semibold flex items-center gap-2 ${
                      oldPwStatus === 'checking' ? 'text-yellow-600' : 
                      oldPwStatus === 'valid' ? 'text-green-600' : 
                      'text-red-600'
                    }`}>
                      <span className={`text-lg fa-solid ${
                        oldPwStatus === 'checking' ? 'fa-hourglass-half' : 
                        oldPwStatus === 'valid' ? 'fa-check-circle' : 
                        'fa-circle-xmark'
                      }`}></span>
                      <span>{
                        oldPwStatus === 'checking' ? 'Validasi...' : 
                        oldPwStatus === 'valid' ? 'Password lama benar' : 
                        'Password lama salah'
                      }</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-2">Password Baru</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50 ${
                      newPassword.length === 0
                        ? 'border-slate-200 focus:border-emerald-500'
                        : pwValid
                        ? 'border-green-300 focus:border-green-500'
                        : 'border-red-300 focus:border-red-500'
                    }`}
                    required
                  />
                  {newPassword.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <div className="text-sm font-semibold mb-2">Syarat password:</div>
                      {['minimal 8 karakter', 'minimal 1 huruf besar', 'minimal 1 huruf kecil', 'minimal 1 angka'].map((req, idx) => {
                        const isValid = !pwErrors.includes(req);
                        return (
                          <div key={idx} className={`text-sm flex items-center gap-2 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
                            <span className={`text-lg fa-solid ${isValid ? 'fa-check-circle' : 'fa-circle-xmark'}`}></span>
                            {req}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={!pwValid || oldPwStatus !== 'valid'}
                  className={`w-full py-3 rounded-xl font-bold shadow transition ${
                    pwValid && oldPwStatus === 'valid'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  Update Password
                </button>
                {pwMessage && <div className="text-green-600 text-sm font-semibold mt-2 p-3 bg-green-50 rounded-lg">{pwMessage}</div>}
                {pwError && <div className="text-red-600 text-sm font-semibold mt-2 p-3 bg-red-50 rounded-lg">{pwError}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
