"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, X, MapPin, Calendar, User, Menu, ChevronRight, ArrowRight } from 'lucide-react';
import SidebarInfo from '../../components/SidebarInfo';

export default function BeritaPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [artikelData, setArtikelData] = useState([]);
  const [adminData, setAdminData] = useState([]);
  const [dusunData, setDusunData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/public-data');
        const data = await res.json();
        if (data.artikel) {
          // Sort by created_at descending (newest first)
          const sorted = [...data.artikel].sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
          });
          setArtikelData(sorted);
        }
        if (data.dusun) setDusunData(data.dusun);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    }

    async function fetchAdmins() {
      try {
        const res = await fetch('/api/admins');
        const data = await res.json();
        if (data.admins) setAdminData(data.admins);
      } catch (err) {
        console.error('Error fetching admins:', err);
      }
    }

    Promise.all([fetchData(), fetchAdmins()]).finally(() => setLoading(false));
  }, []);

  // Filter artikel berdasarkan search term
  const filteredArtikel = useMemo(() => {
    return artikelData.filter(item => {
      const matchSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        stripHtml(item.content).toLowerCase().includes(searchTerm.toLowerCase());
      return matchSearch;
    });
  }, [artikelData, searchTerm]);

  const stripHtml = (value) => {
    if (!value) return '';
    const text = String(value).replace(/<[^>]*>/g, '');
    return text.replace(/\s+/g, ' ').trim();
  };

  const getDusunName = (dusun_id) => {
    const dusun = dusunData.find(d => d.id === dusun_id);
    return dusun ? dusun.name : '';
  };

  const getAuthorNames = (authors) => {
    if (!authors) return [];
    let authorsArray = [];
    if (Array.isArray(authors)) {
      authorsArray = authors;
    } else if (typeof authors === 'string') {
      try {
        authorsArray = JSON.parse(authors);
      } catch {
        authorsArray = authors ? [authors] : [];
      }
    }
    return authorsArray
      .map(id => adminData.find(a => a.id === id)?.name || null)
      .filter(Boolean);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="font-sans text-slate-800 bg-slate-50 min-h-screen">
      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-emerald-900 shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full">
              <img src="/img/logo-kab-pacitan.png" alt="Logo" className="w-8 h-8 rounded-full" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-lg leading-tight">Desa Bandar</h1>
              <p className="text-xs opacity-80 font-light">Kec. Bandar, Kab. Pacitan</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-white text-sm font-medium">
            <a href="/#beranda" className="hover:text-emerald-300 transition">Beranda</a>
            <a href="/#tentang" className="hover:text-emerald-300 transition">Profil Desa</a>
            <a href="/berita" className="text-emerald-300">Berita</a>
            <a href="/#dusun" className="hover:text-emerald-300 transition">Data Dusun</a>
            <a href="/#kontak" className="hover:text-emerald-300 transition">Kontak</a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-emerald-900 border-t border-emerald-800 p-6 md:hidden shadow-xl flex flex-col gap-4 text-white">
            <a href="/#beranda" onClick={() => setIsMenuOpen(false)}>Beranda</a>
            <a href="/#tentang" onClick={() => setIsMenuOpen(false)}>Profil Desa</a>
            <a href="/berita" onClick={() => setIsMenuOpen(false)} className="text-emerald-300 font-bold">Berita</a>
            <a href="/#dusun" onClick={() => setIsMenuOpen(false)}>Data Dusun</a>
            <a href="/#kontak" onClick={() => setIsMenuOpen(false)}>Kontak</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative h-72 flex items-center justify-center text-center text-white bg-gradient-to-r from-emerald-700 to-emerald-900 pt-20">
        <div className="container px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Berita & Artikel</h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            Informasi terbaru tentang perkembangan dan kegiatan Desa Bandar
          </p>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT SIDE - Articles */}
          <div className="lg:col-span-2">
            {/* Search Section */}
            <div className="mb-12">
              <div className="relative">
                <Search className="absolute left-4 top-4 w-6 h-6 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari artikel berdasarkan judul atau konten..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-14 pr-6 py-4 rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 outline-none transition bg-white shadow-md text-lg"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
              <p className="text-center text-slate-600 mt-3 text-sm">
                {filteredArtikel.length} artikel ditemukan
              </p>
            </div>

            {/* Articles Grid */}
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-600">Memuat artikel...</p>
              </div>
            ) : filteredArtikel.length > 0 ? (
              <div className="space-y-6">
            {filteredArtikel.map((artikel) => (
              <Link
                key={artikel.id}
                href={`/artikel/${artikel.slug}`}
                className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col cursor-pointer"
              >
                {artikel.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={artikel.image}
                      alt={artikel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition">
                    {artikel.title}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                    {stripHtml(artikel.content)}
                  </p>

                  {/* Meta Information */}
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    {artikel.created_at && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(artikel.created_at)}
                      </div>
                    )}

                    {artikel.dusun_id && getDusunName(artikel.dusun_id) && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <MapPin className="w-4 h-4" />
                        {getDusunName(artikel.dusun_id)}
                      </div>
                    )}

                    {getAuthorNames(artikel.authors).length > 0 && (
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <User className="w-4 h-4" />
                        {getAuthorNames(artikel.authors).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Read More Button */}
                  <button className="mt-4 inline-flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:gap-3 transition-all">
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </Link>
            ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-lg text-slate-600 mb-4">
                  {searchTerm ? 'Tidak ada artikel yang sesuai dengan pencarian Anda.' : 'Belum ada artikel.'}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold inline-flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Hapus pencarian
                  </button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT SIDE - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <SidebarInfo />
            </div>
          </div>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Desa Bandar</h3>
              <p className="text-slate-400 text-sm">Kecamatan Bandar, Kabupaten Pacitan, Jawa Timur</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Menu</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/#beranda" className="hover:text-emerald-400">Beranda</a></li>
                <li><a href="/berita" className="hover:text-emerald-400">Berita</a></li>
                <li><a href="/#dusun" className="hover:text-emerald-400">Data Dusun</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Hubungi Kami</h3>
              <p className="text-slate-400 text-sm">Email: info@desabandar.id</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Desa Bandar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
