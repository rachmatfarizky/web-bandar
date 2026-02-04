'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, Shield, Briefcase, Heart, Users, Zap, Award, Target, Compass } from 'lucide-react';
import Link from 'next/link';
import SidebarInfo from '@/components/SidebarInfo';

const iconMap = {
  Shield, Briefcase, Heart, Users, Zap, Award, Target, Compass
};

export default function StrukturOrganisasi() {
  const [strStructure, setStrStructure] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/struktur-organisasi');
        const result = await response.json();
        if (result.data) {
          setStrStructure(result.data);
        }
      } catch (err) {
        setError('Gagal memuat data struktur organisasi');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-32 pb-20">
        <div className="container mx-auto px-6 flex justify-center items-center h-96">
          <div className="text-slate-500">Memuat data...</div>
        </div>
      </div>
    );
  }

if (error) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white pt-32 pb-20">
      <div className="container mx-auto px-6 flex justify-center items-center h-96">
        <div className="text-rose-500">{error}</div>
      </div>
    </div>
  );
}
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-emerald-900 shadow-lg py-3">
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
          <Link href="/" className="text-white hover:text-emerald-300 transition font-medium">
            Kembali ke Beranda
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-4 text-emerald-600">
              <ChevronRight size={20} />
              <span className="text-sm font-semibold uppercase tracking-wide">Struktur Organisasi</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Struktur Organisasi Pemerintahan Desa Bandar
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl">
              Berikut adalah susunan perangkat pemerintahan Desa Bandar yang siap melayani dan membangun masyarakat
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {strStructure.length > 0 && (
                <>
                  {/* Leadership Section */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Struktur Organisasi</h2>
                    <div className="space-y-6">
                      {strStructure.map((item, idx) => {
                        const Icon = iconMap[item.icon] || Users;
                        
                        return (
                          <div key={item.id} className="relative">
                            <div className={`bg-gradient-to-r from-${item.color}-50 to-${item.color}-100 border-2 border-${item.color}-200 rounded-xl p-6 hover:shadow-lg transition`}>
                              <div className="flex items-start gap-4">
                                {item.photo_url ? (
                                  <img 
                                    src={item.photo_url} 
                                    alt={item.name}
                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border-2 border-white shadow-md"
                                  />
                                ) : (
                                  <div className={`bg-${item.color}-600 p-3 rounded-xl text-white flex-shrink-0`}>
                                    <Icon size={24} />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h3 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h3>
                                  <p className="text-emerald-700 font-semibold mb-1">{item.name}</p>
                                  <p className="text-sm text-slate-500 mb-2">{item.position}</p>
                                  <p className="text-sm text-slate-600">{item.description}</p>
                                </div>
                              </div>
                            </div>
                            {idx < strStructure.length - 1 && (
                              <div className="flex justify-center py-2">
                                <div className={`w-1 h-8 bg-gradient-to-b from-${item.color}-300 to-${item.color}-100`}></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SidebarInfo />
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Desa Bandar</h3>
              <p className="text-slate-400">Kecamatan Bandar, Kabupaten Pacitan, Provinsi Jawa Timur</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Tautan Cepat</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/" className="hover:text-white transition">Beranda</Link></li>
                <li><Link href="/berita" className="hover:text-white transition">Berita</Link></li>
                <li><Link href="/layanan-surat" className="hover:text-white transition">Layanan Surat</Link></li>
                <li><Link href="/pengaduan-masyarakat" className="hover:text-white transition">Pengaduan Masyarakat</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Hubungi Kami</h3>
              <p className="text-slate-400 text-sm">WhatsApp: 0852-3504-8661</p>
              <p className="text-slate-400 text-sm">Email: layanandesabandar@gmail.com</p>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; {new Date().getFullYear()} Desa Bandar. Dikembangkan oleh KKN-PPM UGM Swarna Bandar 2025.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
