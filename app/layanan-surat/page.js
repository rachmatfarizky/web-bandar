'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Check, Clock, MessageCircle, Phone, Mail, MapPin, ChevronRight, Menu, X } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SidebarInfo from '../../components/SidebarInfo';

const services = [
  {
    id: 1,
    title: 'Surat Keterangan Domisili',
    description: 'Surat bukti tempat tinggal/domisili untuk berbagai keperluan',
    estimasi: '1-2 hari kerja'
  },
  {
    id: 2,
    title: 'Surat Keterangan Usaha',
    description: 'Surat bukti kepemilikan usaha atau aktivitas usaha di desa',
    estimasi: '1-2 hari kerja'
  },
  {
    id: 3,
    title: 'Surat Keterangan Penghasilan',
    description: 'Surat keterangan penghasilan untuk keperluan melamar kerja atau pinjaman',
    estimasi: '2-3 hari kerja'
  },
  {
    id: 4,
    title: 'Surat Keterangan Tidak Mampu',
    description: 'Surat keterangan untuk program bantuan pemerintah atau pendidikan',
    estimasi: '2-3 hari kerja'
  },
  {
    id: 5,
    title: 'Surat Keterangan Kelahiran',
    description: 'Surat keterangan kelahiran untuk keperluan administrasi',
    estimasi: '1-2 hari kerja'
  },
  {
    id: 6,
    title: 'Surat Rekomendasi',
    description: 'Surat rekomendasi dari desa untuk berbagai keperluan',
    estimasi: '2-3 hari kerja'
  }
];

export default function LayananSuratPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header scrolled={scrolled} />

      {/* Hero Section */}
      <header className="relative h-72 flex items-center justify-center text-center text-white bg-gradient-to-r from-emerald-700 to-emerald-900 pt-20">
        <div className="container px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Layanan Surat Menyurat</h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            Kami menyediakan berbagai layanan surat untuk memenuhi kebutuhan administrasi masyarakat Desa Bandar
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">

              {/* WhatsApp Contact Card */}
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 text-white mb-12 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <MessageCircle size={28} />
                  </div>
                  <h2 className="text-2xl font-bold">Hubungi Kami Sekarang</h2>
                </div>
                <p className="mb-6 text-emerald-50">Silakan hubungi kami melalui WhatsApp untuk mengajukan permohonan layanan surat atau pertanyaan lainnya.</p>
                <a 
                  href="https://wa.me/628523504866?text=Saya%20ingin%20mengajukan%20permohonan%20layanan%20surat%20dari%20Desa%20Bandar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-lg font-semibold transition shadow-lg"
                >
                  <MessageCircle size={20} />
                  Hubungi via WhatsApp (0852-3504-8661)
                </a>
              </div>

              {/* Services List */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Daftar Layanan Surat</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-slate-100 overflow-hidden">
                      <div className="h-2 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                      <div className="p-6">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 flex-shrink-0">
                            <FileText size={20} />
                          </div>
                          <h3 className="font-bold text-slate-900 text-lg">{service.title}</h3>
                        </div>
                        <p className="text-slate-600 text-sm mb-4">{service.description}</p>
                        <div className="flex items-center gap-2 text-emerald-700 text-sm font-medium">
                          <Clock size={16} />
                          {service.estimasi}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Procedure Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Tata Cara Permohonan</h2>
                <div className="space-y-6">
                  {[
                    { step: 1, title: 'Hubungi Kami', desc: 'Hubungi kantor desa melalui WhatsApp dengan menyebutkan jenis surat yang dibutuhkan' },
                    { step: 2, title: 'Verifikasi Data', desc: 'Tim desa akan memverifikasi data dan dokumen yang Anda berikan' },
                    { step: 3, title: 'Proses Permohonan', desc: 'Kami akan memproses permohonan Anda sesuai dengan estimasi waktu yang diberikan' },
                    { step: 4, title: 'Pengambilan Surat', desc: 'Surat akan siap diambil di kantor desa pada waktu yang telah ditentukan' }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-600 text-white font-bold">
                          {item.step}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-slate-900 mb-1">{item.title}</h3>
                        <p className="text-slate-600">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SidebarInfo />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
