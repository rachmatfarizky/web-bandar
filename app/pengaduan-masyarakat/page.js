'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, AlertCircle, Lightbulb, Megaphone, Heart, ChevronRight, CheckCircle, Zap, Lock } from 'lucide-react';
import SidebarInfo from '@/components/SidebarInfo';

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Header */}
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4 text-emerald-600">
                  <ChevronRight size={20} />
                  <span className="text-sm font-semibold uppercase tracking-wide">Partisipasi Masyarakat</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  Pengaduan & Aspirasi Masyarakat
                </h1>
                <p className="text-lg text-slate-600">
                  Kami membuka saluran komunikasi terbuka untuk mendengarkan keluhan, saran, dan aspirasi masyarakat Desa Bandar. Suara Anda sangat penting untuk kemajuan bersama.
                </p>
              </div>

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
                  href="https://wa.me/628523504866?text=Saya%20ingin%20menyampaikan%20pengaduan%2Fsaran%2Fasparasi%20kepada%20Desa%20Bandar"
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
                <li><Link href="/pengaduan-masyarakat" className="hover:text-white transition">Pengaduan</Link></li>
                <li><Link href="/layanan-surat" className="hover:text-white transition">Layanan Surat</Link></li>
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
