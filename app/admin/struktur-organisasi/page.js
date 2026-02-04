'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ChevronLeft, AlertCircle, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import SidebarAdmin from '@/components/SidebarAdmin';
import Select from 'react-select';

const iconOptions = [
  'Shield', 'Briefcase', 'Heart', 'Users', 'Zap', 'Award', 'Target', 'Compass'
];

const colorOptions = [
  'emerald', 'blue', 'rose', 'amber', 'purple', 'cyan', 'indigo', 'violet'
];

export default function StrukturOrganisasiAdminPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [uploading, setUploading] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ show: false, type: '', id: null, name: '' });
  
  const [formData, setFormData] = useState({
    title: '',
    name: '',
    position: '',
    description: '',
    icon: 'Shield',
    color: 'emerald',
    photo_url: '',
    display_order: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/struktur-organisasi');
      const result = await response.json();
      setData(result.data || []);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal memuat data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.name || !formData.position) {
      setMessage({ type: 'error', text: 'Isi semua field yang diperlukan' });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
      return;
    }

    // Show confirmation modal
    setConfirmModal({ 
      show: true, 
      type: editId ? 'update' : 'create', 
      name: formData.name 
    });
  };

  const handleConfirmSubmit = async () => {
    setConfirmModal({ show: false, type: '', id: null, name: '' });
    
    try {
      const url = editId ? '/api/struktur-organisasi' : '/api/struktur-organisasi';
      const method = editId ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          id: editId,
          display_order: parseInt(formData.display_order)
        })
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data');
      }

      setMessage({ 
        type: 'success', 
        text: editId ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan' 
      });
      
      resetForm();
      fetchData();
      setTimeout(() => {
        setShowForm(false);
        setMessage({ type: '', text: '' });
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditId(item.id);
    setShowForm(true);
    setMessage({ type: '', text: '' });
  };

  const handleDeleteClick = (id, name) => {
    setConfirmModal({ 
      show: true, 
      type: 'delete', 
      id, 
      name 
    });
  };

  const handleConfirmDelete = async () => {
    const { id } = confirmModal;
    setConfirmModal({ show: false, type: '', id: null, name: '' });

    try {
      const response = await fetch(`/api/struktur-organisasi?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus data');
      }

      setMessage({ type: 'success', text: 'Data berhasil dihapus' });
      fetchData();
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formDataObj = new FormData();
      formDataObj.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj
      });

      if (!response.ok) {
        throw new Error('Gagal upload foto');
      }

      const result = await response.json();
      setFormData({...formData, photo_url: result.url});
      setMessage({ type: 'success', text: 'Foto berhasil diupload' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      name: '',
      position: '',
      description: '',
      icon: 'Shield',
      color: 'emerald',
      photo_url: '',
      display_order: data.length + 1
    });
    setEditId(null);
  };

  if (loading) {
    return (
      <>
        <SidebarAdmin active="struktur-organisasi" />
        <div className="min-h-screen bg-slate-50 p-6" style={{ marginLeft: '224px' }}>
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-slate-200 rounded w-1/4"></div>
              <div className="h-96 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SidebarAdmin active="struktur-organisasi" />
      <div className="min-h-screen bg-slate-50 p-6" style={{ marginLeft: '224px' }}>
        <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-slate-600 hover:text-slate-900">
              <ChevronLeft size={24} />
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Kelola Struktur Organisasi</h1>
          </div>
          {!showForm && (
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <Plus size={20} /> Tambah Struktur
            </button>
          )}
        </div>

        {/* Message */}
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

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8 border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">
              {editId ? 'Edit Struktur' : 'Tambah Struktur Baru'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Jabatan / Posisi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kepala Desa"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Posisi / Divisi
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Pemerintahan Desa"
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Display Order */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Urutan Tampil
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({...formData, display_order: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Icon */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Ikon
                  </label>
                  <Select
                    options={iconOptions.map(icon => ({ value: icon, label: icon }))}
                    value={{ value: formData.icon, label: formData.icon }}
                    onChange={(option) => setFormData({...formData, icon: option?.value || 'Shield'})}
                    isSearchable
                    isClearable={false}
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#cbd5e1',
                        borderRadius: '0.5rem',
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

                {/* Color */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Warna
                  </label>
                  <Select
                    options={colorOptions.map(color => ({ value: color, label: color }))}
                    value={{ value: formData.color, label: formData.color }}
                    onChange={(option) => setFormData({...formData, color: option?.value || 'emerald'})}
                    isSearchable
                    isClearable={false}
                    classNamePrefix="react-select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderColor: '#cbd5e1',
                        borderRadius: '0.5rem',
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

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Foto Profil
                </label>
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {uploading && <span className="text-slate-500">Uploading...</span>}
                </div>
                {formData.photo_url && (
                  <div className="mt-4 relative">
                    <img src={formData.photo_url} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-slate-300" />
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, photo_url: ''})}
                      className="mt-2 text-rose-600 hover:text-rose-700 text-sm font-semibold"
                    >
                      Hapus Foto
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Deskripsi / Tugas
                </label>
                <textarea
                  placeholder="Deskripsi tugas dan tanggung jawab..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                >
                  {editId ? 'Perbarui' : 'Tambahkan'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-slate-300 hover:bg-slate-400 text-slate-800 px-6 py-2 rounded-lg font-semibold transition"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">No</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Jabatan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nama</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Posisi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Deskripsi</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Urutan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                      Belum ada data struktur organisasi
                    </td>
                  </tr>
                ) : (
                  data.map((item, idx) => (
                    <tr key={item.id} className="border-b border-slate-200 hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-sm text-slate-600">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">{item.title}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{item.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{item.position}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">{item.description}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.display_order}</td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item.id, item.name)}
                          className="text-rose-600 hover:text-rose-700 p-2 hover:bg-rose-50 rounded transition"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

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
                    ? 'Apakah Anda yakin ingin menghapus data ' 
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
      </div>
      </div>
    </>
  );
}
