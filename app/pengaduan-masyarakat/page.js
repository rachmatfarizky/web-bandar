'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, AlertCircle, Lightbulb, Megaphone, Heart, ChevronRight, CheckCircle, Zap, Lock, Menu, X } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SidebarInfo from '../../components/SidebarInfo';

const categories = [
  {
    id: 1,
    icon: AlertCircle,
    title: 'Pengaduan/Keluhan',
    desc: 'Laporkan masalah, ketidakadilan, atau kekurangan layanan publik di desa',
    color: 'rose'
  },
  {
    id: 2,
    icon: Lightbulb,
    title: 'Saran & Ide',
    desc: 'Berikan saran dan ide untuk perbaikan atau pengembangan desa',
    color: 'amber'
  },
  {
    id: 3,
    icon: Megaphone,
    title: 'Aspirasi Masyarakat',
    desc: 'Sampaikan aspirasi dan kebutuhan masyarakat kepada pemerintah desa',
    color: 'blue'
  },
  {
    id: 4,
    icon: Heart,
    title: 'Program Bantuan',
    desc: 'Informasi atau pertanyaan mengenai program bantuan pemerintah',
    color: 'emerald'
  }
];

export default function PengaduanMasyarakatPage() {
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
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Pengaduan & Aspirasi</h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            Kami mendengarkan keluhan, saran, dan aspirasi masyarakat untuk kemajuan bersama Desa Bandar
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
                  <h2 className="text-2xl font-bold">Hubungi Kami</h2>
                </div>
                <p className="mb-6 text-emerald-50">
                  Kirimkan pengaduan, saran, atau aspirasi Anda melalui WhatsApp. Tim desa siap mendengarkan dan merespon dengan cepat.
                </p>
                <a 
                  href="https://wa.me/6285235048661?text=Saya%20ingin%20menyampaikan%20pengaduan%2Fsaran%2Fasparasi%20kepada%20Desa%20Bandar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 px-6 py-3 rounded-lg font-semibold transition shadow-lg"
                >
                  <MessageCircle size={20} />
                  Hubungi via WhatsApp (0852-3504-8661)
                </a>
              </div>

              {/* Categories */}
              <div className="mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Kategori Pengaduan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const colorMap = {
                      rose: { bg: 'rose-100', icon: 'rose-600', border: 'rose-200' },
                      amber: { bg: 'amber-100', icon: 'amber-600', border: 'amber-200' },
                      blue: { bg: 'blue-100', icon: 'blue-600', border: 'blue-200' },
                      emerald: { bg: 'emerald-100', icon: 'emerald-600', border: 'emerald-200' }
                    };
                    const colors = colorMap[category.color];

                    return (
                      <div 
                        key={category.id}
                        className={`bg-${colors.bg} border border-${colors.border} rounded-xl p-6 hover:shadow-lg transition cursor-pointer`}
                      >
                        <div className={`bg-${colors.icon}/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                          <Icon className={`text-${colors.icon}`} size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-2">{category.title}</h3>
                        <p className="text-slate-600 text-sm">{category.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Information Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 mb-12">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Informasi Penting</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900 mb-3"><Lock color='gray' /> Privasi Terjamin</h3>
                    <p className="text-slate-600">
                      Identitas dan data pribadi Anda akan dijaga kerahasiaannya. Kami hanya menggunakan informasi untuk keperluan penanganan pengaduan.
                    </p>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-3"><Zap color='orange' /> Respon Cepat</h3>
                    <p className="text-slate-600">
                      Tim kami berkomitmen merespon setiap pengaduan dalam waktu maksimal 2x24 jam. Pengaduan urgent akan ditangani lebih cepat.
                    </p>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-3"><CheckCircle color='green' /> Tindak Lanjut</h3>
                    <p className="text-slate-600">
                      Setiap pengaduan akan ditindaklanjuti dengan serius. Kami akan memberikan update perkembangan kepada pelapor sesuai perkembangan kasus.
                    </p>
                  </div>
                  <div className="border-t pt-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-3"><MessageCircle color='blue' /> Konstruktif</h3>
                    <p className="text-slate-600">
                      Kami mengharapkan pengaduan dan saran yang konstruktif dan bermanfaat untuk kemajuan bersama. Hindari bahasa kasar atau ancaman.
                    </p>
                  </div>
                </div>
              </div>

              {/* Procedure Section */}
              <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
                <h2 className="text-3xl font-bold text-slate-900 mb-8">Prosedur Pengaduan</h2>
                <div className="space-y-6">
                  {[
                    { step: 1, title: 'Hubungi Kami', desc: 'Kirim pesan melalui WhatsApp dengan detail pengaduan/saran Anda' },
                    { step: 2, title: 'Verifikasi', desc: 'Tim desa akan memverifikasi dan mendokumentasikan pengaduan Anda' },
                    { step: 3, title: 'Investigasi', desc: 'Kami akan melakukan penyelidikan dan koordinasi terkait pengaduan' },
                    { step: 4, title: 'Tindak Lanjut', desc: 'Anda akan menerima update dan hasil penanganan pengaduan' }
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
