import React from 'react';
import { MapPin, Users, TreePine, ArrowRight, Menu, X, Phone, Mail, Facebook, Instagram, ChevronRight, Search } from 'lucide-react';


const DesaBandarUI = ({ dusunData, filteredDusun, scrolled, isMenuOpen, setIsMenuOpen, selectedDusun, setSelectedDusun, searchTerm, setSearchTerm }) => (
  <div className="font-sans text-slate-800 bg-slate-50 min-h-screen">
      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-emerald-900 shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full">
               {/* Logo Placeholder - Ganti dengan Logo Kab Pacitan */}
               <TreePine className="text-emerald-700 w-6 h-6" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-lg leading-tight">Desa Bandar</h1>
              <p className="text-xs opacity-80 font-light">Kec. Bandar, Kab. Pacitan</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-white text-sm font-medium">
            <a href="#beranda" className="hover:text-emerald-300 transition">Beranda</a>
            <a href="#tentang" className="hover:text-emerald-300 transition">Profil Desa</a>
            <a href="#dusun" className="hover:text-emerald-300 transition">Data Dusun</a>
            <a href="#kontak" className="hover:text-emerald-300 transition">Kontak</a>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-emerald-900 border-t border-emerald-800 p-6 md:hidden shadow-xl flex flex-col gap-4 text-white">
            <a href="#beranda" onClick={() => setIsMenuOpen(false)}>Beranda</a>
            <a href="#tentang" onClick={() => setIsMenuOpen(false)}>Profil Desa</a>
            <a href="#dusun" onClick={() => setIsMenuOpen(false)}>Data Dusun</a>
            <a href="#kontak" onClick={() => setIsMenuOpen(false)}>Kontak</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header id="beranda" className="relative h-[85vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1520262494112-968cc5806f8e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
          alt="Pemandangan Desa Bandar" 
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="relative z-20 container px-6 mt-16">
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/80 backdrop-blur-sm text-xs font-bold tracking-wider mb-4 uppercase">
            Official Website
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Selamat Datang di <br/> <span className="text-emerald-400">Desa Bandar</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-slate-100 font-light">
            Menjelajahi potensi alam, budaya, dan kearifan lokal masyarakat Desa Bandar, Pacitan.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="#dusun" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg flex items-center justify-center gap-2">
              Jelajahi Dusun <ArrowRight size={18} />
            </a>
            <a href="#tentang" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-3 rounded-full font-semibold transition flex items-center justify-center">
              Profil Desa
            </a>
          </div>
        </div>
      </header>

      {/* --- STATISTIK SINGKAT --- */}
      <section className="relative z-30 -mt-16 container mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex items-center gap-4 py-4 md:py-0 justify-center md:justify-start px-4">
            <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
              <Users size={32} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Total Penduduk</p>
              <h3 className="text-2xl font-bold text-slate-800">3,450+ <span className="text-sm font-normal">Jiwa</span></h3>
            </div>
          </div>
          <div className="flex items-center gap-4 py-4 md:py-0 justify-center md:justify-start px-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <MapPin size={32} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Luas Wilayah</p>
              <h3 className="text-2xl font-bold text-slate-800">850 <span className="text-sm font-normal">Ha</span></h3>
            </div>
          </div>
          <div className="flex items-center gap-4 py-4 md:py-0 justify-center md:justify-start px-4">
            <div className="bg-orange-100 p-3 rounded-xl text-orange-600">
              <TreePine size={32} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Jumlah Dusun</p>
              <h3 className="text-2xl font-bold text-slate-800">{dusunData.length} <span className="text-sm font-normal">Wilayah</span></h3>
            </div>
          </div>
        </div>
      </section>

      {/* --- DAFTAR DUSUN SECTION --- */}
      <section id="dusun" className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-emerald-600 font-bold uppercase tracking-wide text-sm mb-2">Wilayah Administratif</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Dusun di Desa Bandar</h3>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8">
            Desa Bandar terbagi menjadi beberapa wilayah dusun yang masing-masing memiliki potensi dan karakteristik unik.
          </p>
          {/* Search Box */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Cari nama dusun..." 
              className="w-full pl-12 pr-6 py-3 rounded-full border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {/* Grid Dusun */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDusun.length > 0 ? (
            filteredDusun.map((dusun) => (
              <div 
                key={dusun.id} 
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-900/20 group-hover:bg-emerald-900/10 transition z-10"></div>
                  <img 
                    src={dusun.image} 
                    alt={dusun.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="bg-white/90 backdrop-blur-sm text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Dusun
                    </span>
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <h4 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition">{dusun.name}</h4>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{dusun.description}</p>
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center text-sm text-slate-600 border-t border-slate-100 pt-4">
                      <Users className="w-4 h-4 mr-2 text-emerald-500" />
                      <span>{dusun.population}</span>
                    </div>
                    <button 
                      onClick={() => setSelectedDusun(dusun)}
                      className="w-full mt-4 py-2.5 rounded-xl border border-emerald-600 text-emerald-600 font-semibold hover:bg-emerald-600 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      Lihat Detail <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-500">
              <p>Nama dusun tidak ditemukan.</p>
            </div>
          )}
        </div>
      </section>

      {/* --- VISI MISI / TENTANG --- */}
      <section id="tentang" className="bg-emerald-900 py-20 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold leading-tight">Membangun Desa, <br/> Mensejahterakan Warga</h2>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Pemerintah Desa Bandar berkomitmen untuk menciptakan tata kelola pemerintahan yang transparan, akuntabel, dan inovatif demi kemajuan bersama. Dengan semangat gotong royong khas Pacitan, kami membangun desa dari pinggiran.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <h4 className="text-xl font-bold text-yellow-400 mb-1">Visi</h4>
                <p className="text-sm text-emerald-200">Terwujudnya Desa Bandar yang Mandiri, Sejahtera, dan Berbudaya.</p>
              </div>
              <div>
                <h4 className="text-xl font-bold text-yellow-400 mb-1">Misi</h4>
                <p className="text-sm text-emerald-200">Meningkatkan kualitas SDM dan pemanfaatan SDA berkelanjutan.</p>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
             <img src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" className="rounded-2xl shadow-lg transform translate-y-8" alt="Pertanian" />
             <img src="https://images.unsplash.com/photo-1599586120429-48285b6a8a81?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" className="rounded-2xl shadow-lg" alt="Kegiatan Desa" />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="kontak" className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                 <TreePine className="text-emerald-500 w-8 h-8" />
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
                  <span>Jl. Raya Bandar No. 1, Desa Bandar, Kec. Bandar, Kab. Pacitan, 63583</span>
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

      {/* --- MODAL DETAIL DUSUN --- */}
      {selectedDusun && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">
            <div className="relative h-64">
              <img src={selectedDusun.image} alt={selectedDusun.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setSelectedDusun(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition"
              >
                <X size={24} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-3xl font-bold text-white">{selectedDusun.name}</h3>
                <p className="text-emerald-300 font-medium">Kepala Dusun: {selectedDusun.head}</p>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h5 className="text-slate-400 text-xs uppercase font-bold mb-1">Jumlah Penduduk</h5>
                  <p className="text-slate-800 font-semibold text-lg flex items-center gap-2">
                    <Users size={18} className="text-emerald-500" /> {selectedDusun.population}
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h5 className="text-slate-400 text-xs uppercase font-bold mb-1">Komoditas Utama</h5>
                  <div className="flex gap-2 mt-1">
                    {selectedDusun.commodities.map((item, idx) => (
                      <span key={idx} className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-md font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <h4 className="font-bold text-slate-800 mb-3">Tentang Dusun</h4>
              <p className="text-slate-600 leading-relaxed mb-8">
                {selectedDusun.description}
              </p>
              <button 
                onClick={() => setSelectedDusun(null)}
                className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition font-medium"
              >
                Tutup Informasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style CSS Tambahan untuk Animasi */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-up {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out forwards;
        }
        .animate-scale-up {
          animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
);

export default DesaBandarUI;
