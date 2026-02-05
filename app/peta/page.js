'use client';

import React, { useMemo, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { pointsOfInterest, desaBandarMap } from '../../components/content';

const DesaBandarMap = dynamic(() => import('../../components/bandar-map.tsx'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-slate-200 rounded-lg flex items-center justify-center">
      <p className="text-slate-600">Memuat peta...</p>
    </div>
  ),
});

const categories = ['Semua', 'Pemerintahan', 'Pendidikan', 'Kesehatan', 'Ibadah', 'Wisata', 'UMKM'];

function openGmaps(lat, lng) {
  window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
}

export default function PetaPage() {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchTerm, setSearchTerm] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredPOI = useMemo(() => {
    let filtered = pointsOfInterest;
    
    // Filter by category
    if (selectedCategory !== 'Semua') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header scrolled={scrolled} />

      {/* Hero Section */}
      <header className="relative h-72 flex items-center justify-center text-center text-white bg-gradient-to-r from-emerald-700 to-emerald-900 pt-20">
        <div className="container px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Peta Desa Bandar</h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            Penjelajahi Point of Interest (POI) dan lokasi penting di Desa Bandar
          </p>
        </div>
      </header>

      <main className="relative pb-12">
        <div className="container mx-auto px-4 max-w-7xl py-8 relative z-0">
          <a 
            href="/pdf/peta_kerawanan_longsor_desa_bandar.pdf" 
            download 
            className="inline-flex items-center gap-2 px-4 py-3 mb-4 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Peta Kerawanan Longsor
          </a>

          {/* Map Section */}
          <div className="relative z-0 bg-white rounded-2xl shadow-lg p-4 mb-8 overflow-hidden h-96 md:h-[500px] border border-slate-200">
            <DesaBandarMap
              center={desaBandarMap.center}
              pois={pointsOfInterest}
              zoom={13}
            />
          </div>

          {/* Categories Filter & Search */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">Pencarian & Filter</h2>
            
            {/* Search Input */}
            <div className="mb-6">
              <input
                type="text"
                placeholder="Cari nama lokasi atau alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-800"
              />
            </div>

            {/* Category Filter */}
            <div>
              <p className="text-sm font-semibold text-slate-600 mb-3">Filter Kategori:</p>
              <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* POI List */}
          <div>
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              Daftar Lokasi ({filteredPOI.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPOI.map((poi) => (
                <div 
                  key={poi.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200 hover:border-emerald-300"
                >
                  {/* Category Badge */}
                  <div className={`px-4 py-2 font-semibold text-white text-sm ${
                    poi.category === 'Pemerintahan' ? 'bg-emerald-600' :
                    poi.category === 'Pendidikan' ? 'bg-blue-600' :
                    poi.category === 'Kesehatan' ? 'bg-red-600' :
                    poi.category === 'Ibadah' ? 'bg-violet-600' :
                    poi.category === 'Wisata' ? 'bg-amber-600' :
                    'bg-cyan-600'
                  }`}>
                    {poi.category}
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Name */}
                    <h3 className="font-bold text-lg text-slate-900">{poi.name}</h3>

                    {/* Address */}
                    {poi.address && (
                      <div className="flex items-start gap-3 text-sm text-slate-600">
                        <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        <span>{poi.address}</span>
                      </div>
                    )}

                    {/* Phone */}
                    {poi.phone && (
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span>{poi.phone}</span>
                      </div>
                    )}

                    {/* Google Maps Button */}
                    <button
                      onClick={() => openGmaps(poi.lat, poi.lng)}
                      className="w-full mt-4 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Lihat di Google Maps
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPOI.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500 text-lg">Tidak ada lokasi ditemukan untuk kategori ini</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
