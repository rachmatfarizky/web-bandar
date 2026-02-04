'use client';
import React, { useEffect, useState } from 'react';

export default function AdminArtikel() {
  const [artikel, setArtikel] = useState([]);
  const [form, setForm] = useState({ judul: '', isi: '', gambar: '', video: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchArtikel();
  }, []);

  async function fetchArtikel() {
    try {
      const res = await fetch('/api/artikel');
      const data = await res.json();
      if (data.artikel) setArtikel(data.artikel);
    } catch (err) {
      // handle error
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editId) {
        await fetch('/api/artikel', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editId, ...form })
        });
      } else {
        await fetch('/api/artikel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        });
      }
      setForm({ judul: '', isi: '', gambar: '', video: '' });
      setEditId(null);
      fetchArtikel();
    } catch (err) {
      // handle error
    }
  }

  async function handleDelete(id) {
    try {
      await fetch('/api/artikel', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      fetchArtikel();
    } catch (err) {
      // handle error
    }
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
