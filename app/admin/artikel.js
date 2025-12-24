'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminArtikel() {
  const [artikel, setArtikel] = useState([]);
  const [form, setForm] = useState({ judul: '', isi: '', gambar: '', video: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchArtikel();
  }, []);

  async function fetchArtikel() {
    const { data, error } = await supabase.from('artikel').select('*').order('created_at', { ascending: false });
    if (!error) setArtikel(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editId) {
      await supabase.from('artikel').update(form).eq('id', editId);
    } else {
      await supabase.from('artikel').insert([form]);
    }
    setForm({ judul: '', isi: '', gambar: '', video: '' });
    setEditId(null);
    fetchArtikel();
  }

  async function handleDelete(id) {
    await supabase.from('artikel').delete().eq('id', id);
    fetchArtikel();
  }

  function handleEdit(item) {
    setForm({ judul: item.judul, isi: item.isi, gambar: item.gambar, video: item.video });
    setEditId(item.id);
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Artikel Desa</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input className="border p-2 w-full" placeholder="Judul" value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} required />
        <textarea className="border p-2 w-full" placeholder="Isi" value={form.isi} onChange={e => setForm(f => ({ ...f, isi: e.target.value }))} required />
        <input className="border p-2 w-full" placeholder="Link Gambar" value={form.gambar} onChange={e => setForm(f => ({ ...f, gambar: e.target.value }))} />
        <input className="border p-2 w-full" placeholder="Link Video" value={form.video} onChange={e => setForm(f => ({ ...f, video: e.target.value }))} />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded" type="submit">{editId ? 'Update' : 'Tambah'} Artikel</button>
        {editId && <button type="button" className="ml-2 text-red-500" onClick={() => { setEditId(null); setForm({ judul: '', isi: '', gambar: '', video: '' }); }}>Batal Edit</button>}
      </form>
      <ul>
        {artikel.map(item => (
          <li key={item.id} className="border-b py-2 flex justify-between items-center">
            <div>
              <strong>{item.judul}</strong>
              <div className="text-xs text-gray-500">{item.created_at}</div>
              <div>{item.isi}</div>
              {item.gambar && <img src={item.gambar} alt="Gambar" className="w-32 mt-2" />}
              {item.video && <a href={item.video} target="_blank" rel="noopener noreferrer" className="text-blue-500">Lihat Video</a>}
            </div>
            <div>
              <button className="text-blue-500 mr-2" onClick={() => handleEdit(item)}>Edit</button>
              <button className="text-red-500" onClick={() => handleDelete(item.id)}>Hapus</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
