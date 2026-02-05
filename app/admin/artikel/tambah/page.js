"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SidebarAdmin from '../../../../components/SidebarAdmin';
import { ArrowLeft, CheckCircle, Link2, Pencil, PlusCircle, XCircle } from 'lucide-react';
import RichTextEditor from '../editor/RichTextEditor';
import Select from 'react-select';


function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminArtikelTambahPage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', content: '', dusun_id: '', image: '', authors: [] });
  const [dusunList, setDusunList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const redirectTimeoutRef = useRef(null);

  const [origin, setOrigin] = useState('');
  const [slug, setSlug] = useState('');
  const [slugEditing, setSlugEditing] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  useEffect(() => {
    fetchDusun();
    fetchAdmin();
  }, []);

  useEffect(() => {
    // Set origin for URL preview (client-only)
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!slugManuallyEdited) {
      setSlug(slugify(form.title));
    }
  }, [form.title, slugManuallyEdited]);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  async function fetchDusun() {
    try {
      const res = await fetch('/api/dusun');
      const data = await res.json();
      if (data.dusun) setDusunList(data.dusun);
    } catch (err) {
      setDusunList([]);
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
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
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

    const payload = {
      title: form.title,
      content: form.content,
      dusun_id: form.dusun_id || null,
      image: imageUrl || '',
      authors: Array.isArray(form.authors) ? form.authors : []
    };

    try {
      const res = await fetch('/api/artikel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        return;
      }
    } catch (err) {
      setError('Gagal menambah artikel');
      return;
    }

    setSuccess('Artikel baru berhasil ditambahkan! Mengarahkan ke daftar artikel...');
    setForm({ title: '', content: '', dusun_id: '', image: '', authors: [] });
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (redirectTimeoutRef.current) clearTimeout(redirectTimeoutRef.current);
    redirectTimeoutRef.current = setTimeout(() => {
      router.push('/admin/artikel');
    }, 1200);
  }

  return (
    <>
      <SidebarAdmin active="artikel" />
      <div
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-10 px-2 md:px-0"
        style={{ marginLeft: '224px' }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <PlusCircle className="w-8 h-8 text-emerald-600" />
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800">Tambah Artikel Baru</h1>
                <p className="text-slate-500 text-sm mt-1">Buat konten untuk website Desa Bandar.</p>
              </div>
            </div>
            <Link
              href="/admin/artikel"
              className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700 font-semibold"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: main content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                <input
                  className="w-full text-3xl font-extrabold text-slate-800 placeholder:text-slate-300 outline-none bg-transparent"
                  placeholder="Judul Artikel..."
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  required
                />

                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 flex-1 min-w-0">
                    <Link2 className="w-4 h-4 text-slate-400" />
                    {slugEditing ? (
                      <input
                        className="flex-1 min-w-0 bg-transparent outline-none text-sm text-slate-700"
                        value={slug}
                        onChange={(e) => {
                          setSlugManuallyEdited(true);
                          setSlug(slugify(e.target.value));
                        }}
                        onBlur={() => setSlugEditing(false)}
                      />
                    ) : (
                      <div className="flex-1 min-w-0 text-sm text-slate-600 truncate">
                        {(origin || 'https://website.com') + '/artikel/' + (slug || 'judul-artikel-otomatis')}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => setSlugEditing(v => !v)}
                      className="text-emerald-700 font-bold text-xs uppercase tracking-wide"
                      title="Edit slug"
                    >
                      {slugEditing ? 'Simpan' : 'Edit'}
                    </button>
                  </div>
                </div>
              </div>

              <RichTextEditor
                value={form.content}
                onChange={(html) => setForm(f => ({ ...f, content: html }))}
                placeholder="Mulai tulis cerita Anda..."
              />
            </div>

            {/* RIGHT: settings */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <label className="block text-slate-700 font-semibold mb-2">Dusun Terkait (opsional)</label>
                  <Select                    instanceId="dusun-select-tambah"                    options={dusunList.map(d => ({ value: d.id, label: d.name }))}
                    value={form.dusun_id ? { value: form.dusun_id, label: dusunList.find(d => d.id === form.dusun_id)?.name } : null}
                    onChange={option => setForm(f => ({ ...f, dusun_id: option ? option.value : '' }))}
                    isClearable
                    isSearchable
                    placeholder="Pilih Dusun"
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#cbd5e1',
                        borderRadius: '0.75rem',
                        padding: '0.25rem',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        '&:hover': {
                          borderColor: '#10b981'
                        },
                        '&:focus': {
                          borderColor: '#10b981',
                          boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.1)'
                        }
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isSelected ? '#10b981' : state.isFocused ? '#ecfdf5' : '#ffffff',
                        color: state.isSelected ? '#ffffff' : '#1e293b',
                        cursor: 'pointer',
                        padding: '0.75rem 1rem'
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: '0.75rem',
                        marginTop: '0.5rem',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                      }),
                      menuList: (base) => ({
                        ...base,
                        paddingTop: 0,
                        paddingBottom: 0
                      })
                    }}
                  />
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <label className="block text-slate-700 font-semibold mb-3">Pilih Penulis (Author)</label>
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 max-h-64 overflow-y-auto">
                    {adminList.length > 0 ? (
                      adminList.map(admin => (
                        <div key={admin.id} className="flex items-center gap-3 mb-3">
                          <input
                            type="checkbox"
                            id={`author-${admin.id}`}
                            checked={Array.isArray(form.authors) && form.authors.includes(admin.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setForm(f => ({
                                  ...f,
                                  authors: Array.isArray(f.authors) ? [...f.authors, admin.id] : [admin.id]
                                }));
                              } else {
                                setForm(f => ({
                                  ...f,
                                  authors: Array.isArray(f.authors)
                                    ? f.authors.filter(id => id !== admin.id)
                                    : []
                                }));
                              }
                            }}
                            className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                          />
                          <label htmlFor={`author-${admin.id}`} className="cursor-pointer flex-1">
                            <span className="font-medium text-slate-800">{admin.name}</span>
                            <span className="text-xs text-slate-500 ml-2">({admin.username})</span>
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400 text-sm">Tidak ada penulis tersedia</div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <label className="block text-slate-700 font-semibold mb-2">Upload Gambar (opsional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                  />
                  {form.image && (
                    <img
                      src={form.image}
                      alt="Preview"
                      className="w-28 h-28 object-cover rounded-xl border border-slate-200 shadow mt-3"
                    />
                  )}
                  {uploading && <div className="text-emerald-600 text-sm mt-2">Mengupload gambar...</div>}
                </div>

                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
                  <button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow transition"
                    type="submit"
                    disabled={uploading}
                  >
                    Tambah Artikel
                  </button>

                  {success && (
                    <div className="flex items-center gap-2 text-green-600 mt-4">
                      <CheckCircle className="w-5 h-5" /> {success}
                    </div>
                  )}
                  {error && (
                    <div className="flex items-center gap-2 text-red-500 mt-4">
                      <XCircle className="w-5 h-5" /> {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
