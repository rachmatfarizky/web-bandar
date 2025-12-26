"use client";

import React, { useEffect, useState, useRef } from 'react';
import SidebarAdmin from '../../../components/SidebarAdmin';
import { createClient } from '@supabase/supabase-js';
import { Edit, Trash2, CheckCircle, XCircle, PlusCircle } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminArtikel() {
  const [artikel, setArtikel] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', dusun_id: '', image: '' });
  const [dusunList, setDusunList] = useState([]);
  const [editId, setEditId] = useState(null);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchArtikel();
    fetchDusun();
  }, []);

  async function fetchArtikel() {
    const { data, error } = await supabase.from('artikel').select('*');
    if (!error) setArtikel(data);
  }

  async function fetchDusun() {
    const { data, error } = await supabase.from('dusun').select('id, name');
    if (!error) setDusunList(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    let imageUrl = form.image;
    if (fileInputRef.current && fileInputRef.current.files.length > 0) {
      setUploading(true);
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.url) imageUrl = data.url;
        else throw new Error(data.error || 'Upload gagal');
      } catch (err) {
        setError('Gagal upload gambar: ' + err.message);
        setUploading(false);
        return;
      }
      setUploading(false);
    }
    const dataForm = { ...form, image: imageUrl };
    let res;
    if (editId) {
      res = await supabase.from('artikel').update(dataForm).eq('id', editId);
      setSuccess('Artikel berhasil diupdate!');
    } else {
      res = await supabase.from('artikel').insert([dataForm]);
      setSuccess('Artikel baru berhasil ditambahkan!');
    }
    if (res.error) {
      setError(res.error.message);
      setSuccess('');
    } else {
      setForm({ title: '', content: '', dusun_id: '', image: '' });
      setEditId(null);
      setModalOpen(false);
      fetchArtikel();
    }
  }

  async function handleDelete(id) {
    await supabase.from('artikel').delete().eq('id', id);
    fetchArtikel();
  }

  function handleEdit(item) {
    setForm({
      title: item.title,
      content: item.content,
      dusun_id: item.dusun_id || '',
      image: item.image || ''
    });
    setEditId(item.id);
    setSuccess('');
    setError('');
    setModalOpen(true);
  }

  function handleAdd() {
    setForm({ title: '', content: '', dusun_id: '', image: '' });
    setEditId(null);
    setSuccess('');
    setError('');
    setModalOpen(true);
  }

  return (
    <>
      <SidebarAdmin active="artikel" />
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-10 px-2 md:px-0" style={{ marginLeft: '224px' }}>
        <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-8 text-slate-800 flex items-center gap-3"><PlusCircle className="w-8 h-8 text-emerald-600" /> Kelola Artikel</h1>
        <div className="flex justify-end mb-6">
          <button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow transition flex items-center gap-2">
            + Tambah Artikel
          </button>
        </div>
        {/* Modal Form Tambah/Edit */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-scale-up border border-slate-100">
              <button onClick={() => { setModalOpen(false); setEditId(null); setForm({ title: '', content: '', dusun_id: '', image: '' }); setSuccess(''); setError(''); }} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-xl font-bold">&times;</button>
              <h2 className="text-xl font-bold mb-6 text-emerald-700">{editId ? 'Edit Artikel' : 'Tambah Artikel Baru'}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Judul Artikel</label>
                  <input className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50" placeholder="Judul Artikel" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Isi Artikel</label>
                  <textarea className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50" placeholder="Isi Artikel" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} required rows={5} />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Dusun Terkait (opsional)</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition shadow-sm bg-slate-50" value={form.dusun_id} onChange={e => setForm(f => ({ ...f, dusun_id: e.target.value }))}>
                    <option value="">-- Pilih Dusun --</option>
                    {dusunList.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Upload Gambar (opsional)</label>
                  <input type="file" accept="image/*" ref={fileInputRef} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                  {form.image && <img src={form.image} alt="Preview" className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow mt-2" />}
                  {uploading && <div className="text-emerald-600 text-sm mt-2">Mengupload gambar...</div>}
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow transition" type="submit">{editId ? 'Update' : 'Tambah'} Artikel</button>
                  {editId && <button type="button" className="ml-2 text-red-500 font-semibold hover:underline" onClick={() => { setEditId(null); setForm({ title: '', content: '', dusun_id: '', image: '' }); setSuccess(''); setError(''); setModalOpen(false); }}>Batal Edit</button>}
                </div>
                {success && <div className="flex items-center gap-2 text-green-600 mt-3"><CheckCircle className="w-5 h-5" /> {success}</div>}
                {error && <div className="flex items-center gap-2 text-red-500 mt-3"><XCircle className="w-5 h-5" /> {error}</div>}
              </form>
            </div>
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
          <h2 className="text-xl font-bold mb-6 text-emerald-700">Daftar Artikel</h2>
          <ul className="divide-y divide-slate-100">
            {artikel.map(item => (
              <li key={item.id} className="py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start gap-5 flex-1">
                  {item.image && <img src={item.image} alt="Gambar Artikel" className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow" />}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-lg text-slate-800">{item.title}</span>
                      {item.dusun_id && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full ml-2">Dusun: {dusunList.find(d => d.id === item.dusun_id)?.name || '-'}</span>}
                    </div>
                    <div className="text-slate-600 text-sm mb-1 line-clamp-2">{item.content}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 md:mt-0">
                  <button className="flex items-center gap-1 text-blue-600 hover:underline font-semibold" onClick={() => handleEdit(item)}><Edit className="w-4 h-4" /> Edit</button>
                  <button className="flex items-center gap-1 text-red-500 hover:underline font-semibold" onClick={() => handleDelete(item.id)}><Trash2 className="w-4 h-4" /> Hapus</button>
                </div>
              </li>
            ))}
            {artikel.length === 0 && <li className="text-slate-400 text-center py-8">Belum ada artikel.</li>}
          </ul>
        </div>
        </div>
      </div>
    </>
  );
}
