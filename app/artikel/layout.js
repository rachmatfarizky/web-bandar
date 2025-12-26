
import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Instagram, Menu, X } from 'lucide-react';
import '../globals.css';

export default function ArtikelLayout({ children }) {
  return (
    <>
      {/* --- NAVBAR (sama seperti homepage, tanpa login admin) --- */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-emerald-900 shadow-lg py-3">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full">
              <img src="/img/logo-kab-pacitan.png" alt="Logo Kabupaten Pacitan" className="w-8 h-8 rounded-full" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-lg leading-tight">Desa Bandar</h1>
              <p className="text-xs opacity-80 font-light">Kec. Bandar, Kab. Pacitan</p>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-white text-sm font-medium">
            <Link href="/" className="hover:text-emerald-300 transition">Beranda</Link>
            <a href="/#tentang" className="hover:text-emerald-300 transition">Profil Desa</a>
            <a href="/#dusun" className="hover:text-emerald-300 transition">Data Dusun</a>
            <a href="/#kontak" className="hover:text-emerald-300 transition">Kontak</a>
          </div>
        </div>
      </nav>
      <div className="pt-20 min-h-screen bg-slate-50">
        {children}
      </div>
      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-slate-300 py-6 mt-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src="/img/logo-kab-pacitan.png" alt="Logo Kabupaten Pacitan" className="w-8 h-8 rounded-full" />
                <h2 className="text-2xl font-bold text-white">Desa Bandar</h2>
              </div>
              <p className="mb-6 max-w-sm">
                Website resmi Pemerintah Desa Bandar, Kecamatan Bandar, Kabupaten Pacitan, Jawa Timur.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"><Facebook size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"><Instagram size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition"><Mail size={20} /></a>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-6">Kontak Kami</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <MapPin className="text-emerald-500 w-5 h-5 mt-1 shrink-0" />
                  <span>Jl. Raya Bandar No. 02, Desa Bandar, Kec. Bandar, Kab. Pacitan, 63583</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-emerald-500 w-5 h-5 shrink-0" />
                  <span>(0357) 1234567</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-emerald-500 w-5 h-5 shrink-0" />
                  <span>admin@desabandar.pacitankab.go.id</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-6">Akses Cepat</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#" className="hover:text-emerald-400 transition">Layanan Surat</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Transparansi Anggaran</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Berita Desa</a></li>
                <li><a href="#" className="hover:text-emerald-400 transition">Pengaduan Masyarakat</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Pemerintah Desa Bandar. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
