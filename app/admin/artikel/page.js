"use client";


import React, { useEffect, useState, useRef, useMemo } from 'react';
import SidebarAdmin from '../../../components/SidebarAdmin';
import Link from 'next/link';
import { Edit, Trash2, PlusCircle, Image as ImageIcon, Search, X, ChevronRight, AlertCircle, Check, Plus } from 'lucide-react';
import Select from 'react-select';

import { useRouter } from 'next/navigation';

const stripHtml = (value) => {
  if (!value) return '';
  const text = String(value).replace(/<[^>]*>/g, '');
  return text.replace(/\s+/g, ' ').trim();
};

export default function AdminArtikel() {
  const [artikel, setArtikel] = useState([]);
  const [dusunList, setDusunList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDusun, setFilterDusun] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [confirmModal, setConfirmModal] = useState({ show: false, type: '', id: null, name: '' });
  const router = useRouter();

  // Filter artikel berdasarkan search term, dusun, dan author
  const filteredArtikel = useMemo(() => {
    return artikel.filter(item => {
      const matchSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDusun = !filterDusun || item.dusun_id == filterDusun;
      
      let matchAuthor = true;
      if (filterAuthor) {
        let authorsArray = [];
        if (Array.isArray(item.authors)) {
          authorsArray = item.authors;
        } else if (typeof item.authors === 'string') {
          try { authorsArray = JSON.parse(item.authors); } catch { }
        }
        matchAuthor = authorsArray.includes(parseInt(filterAuthor));
      }
      
      return matchSearch && matchDusun && matchAuthor;
    });
  }, [artikel, searchTerm, filterDusun, filterAuthor]);

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
    
    fetchArtikel();
    fetchDusun();
    fetchAdmin();
  }, []);

  async function fetchArtikel() {
    try {
      const res = await fetch('/api/artikel');
      const data = await res.json();
      if (data.artikel) setArtikel(data.artikel);
    } catch (err) {
      console.error('Error fetching artikel:', err);
    }
  }

  async function fetchDusun() {
    try {
      const res = await fetch('/api/dusun');
      const data = await res.json();
      if (data.dusun) setDusunList(data.dusun);
    } catch (err) {
      console.error('Error fetching dusun:', err);
    }
  }

  async function fetchAdmin() {
    try {
      const res = await fetch('/api/admins');
      const data = await res.json();
      if (data.admins) setAdminList(data.admins);
    } catch (err) {
      console.error('Error fetching admins:', err);
    }
  }

  function handleDeleteClick(id, name) {
    setConfirmModal({ show: true, type: 'delete', id, name });
  }

  async function handleConfirmDelete() {
    try {
      await fetch('/api/artikel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: confirmModal.id })
      });
      setMessage({ type: 'success', text: 'Artikel berhasil dihapus!' });
      setConfirmModal({ show: false, type: '', id: null, name: '' });
      fetchArtikel();
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (err) {
      console.error('Error deleting artikel:', err);
      setMessage({ type: 'error', text: 'Gagal menghapus artikel.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  }

  async function handleConfirmSubmit() {
    try {
      setMessage({ type: '', text: '' });
      let imageUrl = form.image;
      if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files[0]) {
        const file = fileInputRef.current.files[0];
        const formData = new FormData();
        formData.append('file', file);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (uploadData.url) imageUrl = uploadData.url;
      }
      const payload = {
        title: form.title,
        content: form.content,
        dusun_id: form.dusun_id,
        authors: form.authors.split(',').map(s => s.trim()).filter(Boolean),
        image: imageUrl
      };
      if (editId) {
        await fetch('/api/artikel', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, ...payload })
        });
        setMessage({ type: 'success', text: 'Artikel berhasil diupdate!' });
      } else {
        await fetch('/api/artikel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        setMessage({ type: 'success', text: 'Artikel berhasil ditambahkan!' });
      }
      setConfirmModal({ show: false, type: '', id: null, name: '' });
      setModalOpen(false);
      setEditId(null);
      setForm({ title: '', content: '', dusun_id: '', authors: '', image: '' });
      fetchArtikel();
      setTimeout(() => setMessage({ type: '', text: '' }), 2000);
    } catch (err) {
      console.error('Error saving artikel:', err);
      setMessage({ type: 'error', text: 'Gagal menyimpan artikel.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const title = form.title.trim();
    if (!title) {
      setMessage({ type: 'error', text: 'Judul harus diisi!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return;
    }
    setConfirmModal({ show: true, type: 'create', id: null, name: title });
  }

  return (
    <>
      <SidebarAdmin active="artikel" onLogout={handleLogout} user={user} />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-10 px-2 md:px-0" style={{ marginLeft: '224px' }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-8 text-slate-800 flex items-center gap-3"><PlusCircle className="w-8 h-8 text-emerald-600" /> Kelola Artikel</h1>
          <div className="flex justify-end mb-6">
            <Link href="/admin/artikel/tambah" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow transition flex items-center gap-2">
              <Plus size={20}/> Tambah Artikel
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            <h2 className="text-xl font-bold mb-6 text-emerald-700">Daftar Artikel</h2>
            
            {/* Filter Section */}
            <div className="mb-6 space-y-4">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari artikel berdasarkan judul atau konten..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-slate-50"
                />
              </div>

              {/* Filter Dusun and Author */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Filter Dusun</label>
                  <Select
                    instanceId="filter-dusun"
                    options={[{ value: '', label: 'Semua Dusun' }, ...dusunList.map(d => ({ value: d.id, label: d.name }))]}
                    value={filterDusun ? { value: filterDusun, label: dusunList.find(d => d.id === filterDusun)?.name } : { value: '', label: 'Semua Dusun' }}
                    onChange={(option) => setFilterDusun(option?.value || '')}
                    isSearchable
                    isClearable={false}
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#cbd5e1',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f8fafc',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#10b981' },
                        '&:focus': { borderColor: '#10b981' }
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : '#ffffff',
                        color: state.isSelected ? '#ffffff' : '#1e293b',
                        cursor: 'pointer'
                      })
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Filter Penulis</label>
                  <Select
                    instanceId="filter-penulis"
                    options={[{ value: '', label: 'Semua Penulis' }, ...adminList.map(a => ({ value: a.id, label: a.name }))]}
                    value={filterAuthor ? { value: filterAuthor, label: adminList.find(a => a.id === filterAuthor)?.name } : { value: '', label: 'Semua Penulis' }}
                    onChange={(option) => setFilterAuthor(option?.value || '')}
                    isSearchable
                    isClearable={false}
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#cbd5e1',
                        borderRadius: '0.75rem',
                        backgroundColor: '#f8fafc',
                        boxShadow: 'none',
                        '&:hover': { borderColor: '#10b981' },
                        '&:focus': { borderColor: '#10b981' }
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : '#ffffff',
                        color: state.isSelected ? '#ffffff' : '#1e293b',
                        cursor: 'pointer'
                      })
                    }}
                  />
                </div>
              </div>

              {/* Clear Filters Button */}
              {(searchTerm || filterDusun || filterAuthor) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDusun('');
                    setFilterAuthor('');
                  }}
                  className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
                >
                  <X className="w-4 h-4" /> Hapus semua filter
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-slate-600">
              Menampilkan {filteredArtikel.length} dari {artikel.length} artikel
            </div>

            <ul className="divide-y divide-slate-100">
              {filteredArtikel.map(item => (
                <li key={item.id} className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-5 flex-1">
                    {item.image && <img src={item.image} alt="Gambar Artikel" className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow" />}
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-slate-800">{item.title}</span>
                      </div>
                      <div className="text-slate-600 text-sm mb-2 line-clamp-2">{stripHtml(item.content)}</div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {item.dusun_id && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                            Dusun: {dusunList.find(d => d.id === item.dusun_id)?.name || '-'}
                          </span>
                        )}
                        {(() => {
                          let authorsArray = [];
                          if (Array.isArray(item.authors)) {
                            authorsArray = item.authors;
                          } else if (typeof item.authors === 'string') {
                            try { authorsArray = JSON.parse(item.authors); } catch { authorsArray = item.authors ? [item.authors] : []; }
                          } else if (item.author) {
                            authorsArray = [item.author];
                          }
                          const authorNames = authorsArray
                            .map(id => adminList.find(a => a.id === id)?.name || id)
                            .filter(Boolean);
                          return authorNames.length > 0 ? (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              Penulis: {authorNames.join(', ')}
                            </span>
                          ) : null;
                        })()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 md:mt-0">
                    <Link href={`/artikel/${item.slug}`} target="_blank" className="flex items-center gap-1 text-green-600 hover:underline font-semibold"><ChevronRight className="w-4 h-4" /> Lihat</Link>
                    <Link href={`/admin/artikel/edit/${item.id}`} className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"><Edit className="w-4 h-4" /> Edit</Link>
                    <button className="flex items-center gap-1 text-red-500 hover:underline font-semibold" onClick={() => handleDeleteClick(item.id, item.title)}><Trash2 className="w-4 h-4" /> Hapus</button>
                  </div>
                </li>
              ))}
              {filteredArtikel.length === 0 && (
                <li className="text-slate-400 text-center py-8">
                  {artikel.length === 0 ? 'Belum ada artikel.' : 'Tidak ada artikel yang sesuai dengan filter.'}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModal.show && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 animate-scale-up">
            <h3 className={`text-xl font-bold mb-2 ${confirmModal.type === 'delete' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {confirmModal.type === 'delete' ? 'Hapus Artikel?' : 'Simpan Artikel?'}
            </h3>
            <p className="text-slate-600 mb-6">
              {confirmModal.type === 'delete' 
                ? `Apakah Anda yakin ingin menghapus "${confirmModal.name}"? Tindakan ini tidak dapat dibatalkan.`
                : `Apakah Anda yakin ingin menyimpan perubahan untuk "${confirmModal.name}"?`}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmModal({ show: false, type: '', id: null, name: '' })}
                className="px-6 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmModal.type === 'delete' ? handleConfirmDelete : handleConfirmSubmit}
                className={`px-6 py-2 rounded-xl text-white font-semibold transition flex items-center gap-2 ${
                  confirmModal.type === 'delete'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {confirmModal.type === 'delete' ? (
                  <>
                    <X className="w-4 h-4" /> Hapus
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" /> Simpan
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
