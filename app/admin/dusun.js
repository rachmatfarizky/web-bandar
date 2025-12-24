'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function AdminDusun() {
  const [dusun, setDusun] = useState([]);
  const [form, setForm] = useState({ name: '', population: '', head: '', description: '', commodities: '', image: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchDusun();
  }, []);

  async function fetchDusun() {
    const { data, error } = await supabase.from('dusun').select('*');
    if (!error) setDusun(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const dataForm = { ...form, commodities: form.commodities.split(',').map(s => s.trim()) };
    if (editId) {
      await supabase.from('dusun').update(dataForm).eq('id', editId);
    } else {
      await supabase.from('dusun').insert([dataForm]);
    }
    setForm({ name: '', population: '', head: '', description: '', commodities: '', image: '' });
    setEditId(null);
    fetchDusun();
  }

  async function handleDelete(id) {
    await supabase.from('dusun').delete().eq('id', id);
    fetchDusun();
  }

  function handleEdit(item) {
    setForm({
      name: item.name,
      population: item.population,
      head: item.head,
      description: item.description,
      commodities: item.commodities.join(', '),
      image: item.image
    });
    setEditId(item.id);
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dusun</h1>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input className="border p-2 w-full" placeholder="Nama Dusun" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
        <input className="border p-2 w-full" placeholder="Jumlah Penduduk" value={form.population} onChange={e => setForm(f => ({ ...f, population: e.target.value }))} required />
        <input className="border p-2 w-full" placeholder="Kepala Dusun" value={form.head} onChange={e => setForm(f => ({ ...f, head: e.target.value }))} required />
        <textarea className="border p-2 w-full" placeholder="Deskripsi" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
        <input className="border p-2 w-full" placeholder="Komoditas (pisahkan dengan koma)" value={form.commodities} onChange={e => setForm(f => ({ ...f, commodities: e.target.value }))} required />
        <input className="border p-2 w-full" placeholder="Link Gambar" value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded" type="submit">{editId ? 'Update' : 'Tambah'} Dusun</button>
        {editId && <button type="button" className="ml-2 text-red-500" onClick={() => { setEditId(null); setForm({ name: '', population: '', head: '', description: '', commodities: '', image: '' }); }}>Batal Edit</button>}
      </form>
      <ul>
        {dusun.map(item => (
          <li key={item.id} className="border-b py-2 flex justify-between items-center">
            <div>
              <strong>{item.name}</strong>
              <div className="text-xs text-gray-500">{item.population} | Kepala: {item.head}</div>
              <div>{item.description}</div>
              <div>Komoditas: {item.commodities.join(', ')}</div>
              {item.image && <img src={item.image} alt="Gambar Dusun" className="w-32 mt-2" />}
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
