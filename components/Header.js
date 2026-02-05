'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Header({ scrolled = false }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-emerald-900 shadow-lg py-3' : 'bg-transparent py-5'}`}>
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

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-white text-sm font-medium">
          <a href="/" className="hover:text-emerald-300 transition">Beranda</a>
          <div className="relative group">
            <button className="hover:text-emerald-300 transition flex items-center gap-1">
              Profil Desa
              <span className="text-xs"><ChevronDown size={16} /></span>
            </button>
            <div className="absolute left-0 mt-0 w-56 bg-emerald-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40 py-2">
              <a href="/#tentang" className="block px-4 py-3 text-white hover:bg-emerald-700 transition text-sm">Visi & Misi</a>
              <a href="/struktur-organisasi" className="block px-4 py-3 text-white hover:bg-emerald-700 transition text-sm">Struktur Organisasi</a>
            </div>
          </div>
          <a href="/berita" className="hover:text-emerald-300 transition">Berita</a>
          <div className="relative group">
            <button className="hover:text-emerald-300 transition flex items-center gap-1">
              Layanan
              <span className="text-xs"><ChevronDown size={16} /></span>
            </button>
            <div className="absolute left-0 mt-0 w-56 bg-emerald-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40 py-2">
              <a href="/layanan-surat" className="block px-4 py-3 text-white hover:bg-emerald-700 transition text-sm">Layanan Surat</a>
              <a href="/pengaduan-masyarakat" className="block px-4 py-3 text-white hover:bg-emerald-700 transition text-sm">Pengaduan Masyarakat</a>
            </div>
          </div>
          <a href="/#dusun" className="hover:text-emerald-300 transition">Data Dusun</a>
          <a href="/peta" className="hover:text-emerald-300 transition">Peta</a>
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
          <a href="/" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-300 transition">Beranda</a>
          <div>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'profil' ? null : 'profil')}
              className="flex items-center justify-between w-full hover:text-emerald-300 transition py-1 text-left"
            >
              <span>Profil Desa</span>
              <span className={`text-xs transition-transform ${openDropdown === 'profil' ? 'rotate-180' : ''}`}><ChevronDown size={16} /></span>
            </button>
            {openDropdown === 'profil' && (
              <div className="pl-4 flex flex-col gap-2 mt-2 border-l-2 border-emerald-600">
                <a href="/#tentang" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }} className="hover:text-emerald-300 transition py-1 text-sm">Visi & Misi</a>
                <a href="/struktur-organisasi" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }} className="hover:text-emerald-300 transition py-1 text-sm">Struktur Organisasi</a>
              </div>
            )}
          </div>
          <a href="/berita" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-300 transition">Berita</a>
          <div>
            <button 
              onClick={() => setOpenDropdown(openDropdown === 'layanan' ? null : 'layanan')}
              className="flex items-center justify-between w-full hover:text-emerald-300 transition py-1 text-left"
            >
              <span>Layanan</span>
              <span className={`text-xs transition-transform ${openDropdown === 'layanan' ? 'rotate-180' : ''}`}><ChevronDown size={16} /></span>
            </button>
            {openDropdown === 'layanan' && (
              <div className="pl-4 flex flex-col gap-2 mt-2 border-l-2 border-emerald-600">
                <a href="/layanan-surat" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }} className="hover:text-emerald-300 transition py-1 text-sm">Layanan Surat</a>
                <a href="/pengaduan-masyarakat" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }} className="hover:text-emerald-300 transition py-1 text-sm">Pengaduan Masyarakat</a>
              </div>
            )}
          </div>
          <a href="/#dusun" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-300 transition">Data Dusun</a>
          <a href="/peta" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-300 transition">Peta</a>
          <a href="/#kontak" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-300 transition">Kontak</a>
        </div>
      )}
    </nav>
  );
}
