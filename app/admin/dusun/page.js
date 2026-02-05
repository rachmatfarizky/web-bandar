"use client";

import React, { useEffect, useState, useRef } from 'react';
import SidebarAdmin from '../../../components/SidebarAdmin';
import { Users, Image as ImageIcon, Edit, Trash2, AlertCircle, Check, X, ChevronLeft, Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function AdminDusun() {
  const [dusun, setDusun] = useState([]);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: '', population: '', head: '', description: '', commodities: '', images: [] });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, type: '', id: null, name: '' });
  const router = useRouter();

  async function handleLogout() {
    // Call logout API to clear server-side cookie
    await fetch('/api/admin/logout', { method: 'POST' });
    // Also clear localStorage for compatibility
    localStorage.removeItem('admin_session');
    router.push('/admin/login');
  }

  useEffect(() => {
    // Get session and fetch user info - redirect if not authenticated
    const session = localStorage.getItem('admin_session');
    if (!session) {
      router.push('/admin/login');
      return;
    }
    
    fetch('/api/admins/me', { headers: { 'Authorization': `Bearer ${session}` } })
      .then(res => res.json())
      .then(data => { 
        if (data && data.user) {
          setUser(data.user);
        } else {
          // Invalid session
          router.push('/admin/login');
        }
      })
      .catch(() => router.push('/admin/login'));
    
    fetchDusun();
  }, []);

  async function fetchDusun() {
    try {
      const res = await fetch('/api/dusun');
      const data = await res.json();
      if (data.dusun) setDusun(data.dusun);
    } catch (err) {
      // handle error
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    if (!form.name || !form.population || !form.head || !form.description || !form.commodities) {
      setMessage({ type: 'error', text: 'Semua field wajib diisi kecuali gambar.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return;
    }
    setConfirmModal({ 
      show: true, 
      type: editId ? 'update' : 'create', 
      name: form.name 
    });
  }

  async function handleConfirmSubmit() {
    setConfirmModal({ show: false, type: '', id: null, name: '' });
    
    let imagesArr = Array.isArray(form.images) ? [...form.images] : [];
    if (fileInputRef.current && fileInputRef.current.files.length > 0) {
      setUploading(true);
      const files = Array.from(fileInputRef.current.files);
      imagesArr = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.url) imagesArr.push(data.url);
          else throw new Error(data.error || 'Upload gagal');
        } catch (err) {
          setMessage({ type: 'error', text: 'Gagal upload gambar: ' + err.message });
          setUploading(false);
          setTimeout(() => setMessage({ type: '', text: '' }), 5000);
          return;
        }
      }
      setUploading(false);
    }
    const dataForm = { ...form, images: imagesArr, commodities: form.commodities.split(',').map(s => s.trim()) };
    try {
      if (editId) {
        await fetch('/api/dusun', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, ...dataForm })
        });
        setMessage({ type: 'success', text: 'Data dusun berhasil diupdate!' });
      } else {
        await fetch('/api/dusun', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataForm)
        });
        setMessage({ type: 'success', text: 'Dusun baru berhasil ditambahkan!' });
      }
      setForm({ name: '', population: '', head: '', description: '', commodities: '', images: [] });
      setEditId(null);
      setModalOpen(false);
      fetchDusun();
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menyimpan data.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  }

  async function handleDeleteClick(id, name) {
    setConfirmModal({ 
      show: true, 
      type: 'delete', 
      id, 
      name 
    });
  }

  async function handleConfirmDelete() {
    const { id } = confirmModal;
    setConfirmModal({ show: false, type: '', id: null, name: '' });
    
    try {
      await fetch('/api/dusun', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      setMessage({ type: 'success', text: 'Dusun berhasil dihapus!' });
      fetchDusun();
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (err) {
      setMessage({ type: 'error', text: 'Gagal menghapus data.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  }

  async function handleDelete(id) {
    try {
      await fetch('/api/dusun', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchDusun();
    } catch (err) {
      // handle error
    }
  }

  function handleEdit(item) {
    const commoditiesArr = Array.isArray(item.commodities) 
      ? item.commodities 
      : JSON.parse(item.commodities || '[]');
    setForm({
      name: item.name,
      population: item.population,
      head: item.head,
      description: item.description,
      commodities: commoditiesArr.join(', '),
      images: Array.isArray(item.images) ? item.images : JSON.parse(item.images || '[]')
    });
    setEditId(item.id);
    setMessage({ type: '', text: '' });
    setModalOpen(true);
  }

  function handleAdd() {
    setForm({ name: '', population: '', head: '', description: '', commodities: '', images: [] });
    setEditId(null);
    setMessage({ type: '', text: '' });
    setModalOpen(true);
  }

  return (
    <>
      <SidebarAdmin active="dusun" onLogout={handleLogout} user={user} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-10 px-2 md:px-0" style={{ marginLeft: '224px' }}>
        <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-slate-800 flex items-center gap-3"><Users className="w-8 h-8 text-emerald-600" /> Kelola Data Dusun</h1>
        <div className="flex justify-end mb-6">
          <button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow transition flex items-center gap-2">
            <Plus size={20}/> Tambah Dusun
          </button>
        </div>
        {/* Modal Form Tambah/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-scale-up border border-slate-100">
              <button onClick={() => { setModalOpen(false); setEditId(null); setForm({ name: '', population: '', head: '', description: '', commodities: '', image: '' }); setMessage({ type: '', text: '' }); }} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-xl font-bold">&times;</button>
              <h2 className="text-xl font-bold mb-6 text-emerald-700">{editId ? 'Edit Dusun' : 'Tambah Dusun Baru'}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Nama Dusun</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50" placeholder="Nama Dusun" value={form.name ?? ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Jumlah Penduduk</label>
                    <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50" placeholder="Jumlah Penduduk" value={form.population ?? ''} onChange={e => setForm(f => ({ ...f, population: e.target.value }))} required />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Kepala Dusun</label>
                    <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50" placeholder="Kepala Dusun" value={form.head ?? ''} onChange={e => setForm(f => ({ ...f, head: e.target.value }))} required />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Deskripsi</label>
                  <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50" placeholder="Deskripsi" value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required rows={3} />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Komoditas (pisahkan dengan koma)</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50" placeholder="Komoditas (pisahkan dengan koma)" value={form.commodities ?? ''} onChange={e => setForm(f => ({ ...f, commodities: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1 items-center gap-2">Upload Gambar (Bisa banyak)</label>
                  <input type="file" accept="image/*" ref={fileInputRef} multiple className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                  {form.images && form.images.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {form.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Preview Gambar ${idx+1}`} className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow" />
                          <button
                            type="button"
                            title="Hapus gambar ini"
                            onClick={() => setForm(f => ({
                              ...f,
                              images: f.images.filter((_, i) => i !== idx)
                            }))}
                            className="absolute top-1 right-1 bg-white/80 hover:bg-red-500 text-red-500 hover:text-white rounded-full p-1 shadow transition-opacity opacity-80 group-hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploading && <div className="text-emerald-600 text-sm mt-2">Mengupload gambar...</div>}
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow transition" type="submit">{editId ? 'Update' : 'Tambah'} Dusun</button>
                  {editId && <button type="button" className="ml-2 text-red-500 font-semibold hover:underline" onClick={() => { setEditId(null); setForm({ name: '', population: '', head: '', description: '', commodities: '', image: '' }); setMessage({ type: '', text: '' }); setModalOpen(false); }}>Batal Edit</button>}
                </div>
              </form>
            </div>

        {/* Message Toast */}
        {message.text && (
          <div className={`fixed top-6 right-6 max-w-md rounded-lg shadow-lg flex items-center gap-3 px-6 py-4 backdrop-blur-sm z-40 animate-slide-in ${
            message.type === 'success' 
              ? 'bg-emerald-500/90 text-white border border-emerald-400' 
              : 'bg-rose-500/90 text-white border border-rose-400'
          }`}>
            {message.type === 'success' ? (
              <Check size={20} className="flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="flex-shrink-0" />
            )}
            <div className="flex-1">
              <p className="font-semibold">{message.text}</p>
            </div>
            <button
              onClick={() => setMessage({ type: '', text: '' })}
              className="flex-shrink-0 hover:opacity-80 transition"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-up">
              <div className={`px-6 py-4 ${
                confirmModal.type === 'delete' ? 'bg-rose-50' : 'bg-emerald-50'
              } border-b ${
                confirmModal.type === 'delete' ? 'border-rose-200' : 'border-emerald-200'
              }`}>
                <div className="flex items-center gap-3">
                  {confirmModal.type === 'delete' ? (
                    <AlertCircle className="text-rose-600" size={24} />
                  ) : (
                    <Check className="text-emerald-600" size={24} />
                  )}
                  <h2 className={`text-lg font-bold ${
                    confirmModal.type === 'delete' ? 'text-rose-900' : 'text-emerald-900'
                  }`}>
                    {confirmModal.type === 'delete' ? 'Hapus Data' : 'Simpan Data'}
                  </h2>
                </div>
              </div>

              <div className="px-6 py-6">
                <p className="text-slate-700 mb-2">
                  {confirmModal.type === 'delete' 
                    ? 'Apakah Anda yakin ingin menghapus dusun ' 
                    : 'Apakah Anda yakin ingin menyimpan perubahan untuk '
                  }
                  <span className="font-semibold text-slate-900">{confirmModal.name}</span>?
                </p>
                {confirmModal.type === 'delete' && (
                  <p className="text-sm text-rose-600 mt-3">Tindakan ini tidak dapat dibatalkan</p>
                )}
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmModal({ show: false, type: '', id: null, name: '' })}
                  className="px-6 py-2 rounded-lg font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (confirmModal.type === 'delete') {
                      handleConfirmDelete();
                    } else {
                      handleConfirmSubmit();
                    }
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
                    confirmModal.type === 'delete'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {confirmModal.type === 'delete' ? 'Ya, Hapus' : 'Ya, Simpan'}
                </button>
              </div>
            </div>
          </div>
        )}

            <style>{`
              @keyframes fade-in {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes scale-up {
                from { transform: scale(0.95); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
              }
              .animate-fade-in {
                animation: fade-in 0.2s ease-out forwards;
              }
              .animate-scale-up {
                animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
              }
            `}</style>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h2 className="text-xl font-bold mb-6 text-emerald-700">Daftar Dusun</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dusun.map(item => (
              <div key={item.id} className="bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all overflow-hidden hover:border-emerald-300">
                {/* Image Section */}
                {item.images && item.images.length > 0 && (
                  <img src={item.images[0]} alt="Gambar Dusun" className="w-full h-40 object-cover" />
                )}
                
                {/* Content Section */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-slate-800 mb-2">{item.name}</h3>
                    <span className="inline-block text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-semibold">Kepala: {item.head}</span>
                  </div>
                  
                  <div className="space-y-2 mb-4 text-sm">
                    <div>
                      <span className="text-slate-500">Jumlah Penduduk:</span>
                      <span className="ml-2 text-emerald-700 font-semibold">{item.population}</span>
                    </div>
                    <div>
                      <span className="text-slate-600 line-clamp-2">{item.description}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-xs">Komoditas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(Array.isArray(item.commodities) ? item.commodities : JSON.parse(item.commodities || '[]')).map((commodity, idx) => (
                          <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                            {commodity}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4 border-t border-slate-200">
                    <button onClick={() => handleEdit(item)} className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 rounded-lg transition">
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleDeleteClick(item.id, item.name)} className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 rounded-lg transition">
                      <Trash2 className="w-4 h-4" /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {dusun.length === 0 && (
            <div className="text-slate-400 text-center py-12">
              <p className="text-lg">Belum ada data dusun.</p>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Toast Notification */}
      {message.text && (
        <div className={`fixed top-6 right-6 px-6 py-4 rounded-xl shadow-lg flex items-center gap-3 z-50 animate-slide-in ${
          message.type === 'success'
            ? 'bg-emerald-500 text-white'
            : 'bg-rose-500 text-white'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="font-semibold">{message.text}</span>
          <button
            onClick={() => setMessage({ type: '', text: '' })}
            className="ml-2 hover:opacity-75 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}