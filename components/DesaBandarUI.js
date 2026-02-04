import React from 'react';
import Link from 'next/link';
import { MapPin, Users, TreePine, ArrowRight, Menu, X, Phone, Mail, Facebook, Instagram, ChevronRight, ChevronDown, Search, User } from 'lucide-react';
import SidebarInfo from './SidebarInfo';

// Carousel untuk kartu dusun (auto-slide)
function DusunCardCarousel({ images, alt }) {
  const [idx, setIdx] = React.useState(0);
  React.useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setIdx(i => (i + 1) % images.length);
    }, 2500); // 2.5 detik
    return () => clearInterval(interval);
  }, [images]);
  if (!images || images.length === 0) {
    return <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">Tidak ada gambar</div>;
  }
  return (
    <div className="w-full h-full relative">
      <img src={images[idx]} alt={alt} className="w-full h-full object-cover transition duration-700" />
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
          {images.map((_, i) => (
            <span key={i} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'} block`} />
          ))}
        </div>
      )}
    </div>
  );
}

function DusunDetailModal({ dusun, onClose }) {
  const [idx, setIdx] = React.useState(0);
  const images = Array.isArray(dusun.images) && dusun.images.length > 0 ? dusun.images : (dusun.image ? [dusun.image] : []);
  const hasImages = images.length > 0;
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);
  React.useEffect(() => { setIdx(0); }, [dusun]);
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up">
        <div className="relative h-64">
          {hasImages ? (
            <>
              <img src={images[idx]} alt={dusun.name} className="w-full h-full object-cover transition duration-300" />
              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20"><ChevronRight className="rotate-180" /></button>
                  <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full z-20"><ChevronRight /></button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                    {images.map((_, i) => (
                      <span key={i} className={`w-2 h-2 rounded-full ${i === idx ? 'bg-white' : 'bg-white/50'} block`} />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">Tidak ada gambar</div>
          )}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-full transition"
          >
            <X size={24} />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <h3 className="text-3xl font-bold text-white">{dusun.name}</h3>
            <p className="text-emerald-300 font-medium">Kepala Dusun: {dusun.head}</p>
          </div>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h5 className="text-slate-400 text-xs uppercase font-bold mb-1">Jumlah Penduduk</h5>
              <p className="text-slate-800 font-semibold text-lg flex items-center gap-2">
                <Users size={18} className="text-emerald-500" /> {dusun.population}
              </p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h5 className="text-slate-400 text-xs uppercase font-bold mb-1">Komoditas Utama</h5>
              <div className="flex gap-2 mt-1">
                {(Array.isArray(dusun.commodities) ? dusun.commodities : JSON.parse(dusun.commodities || '[]')).map((item, idx) => (
                  <span key={idx} className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-md font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <h4 className="font-bold text-slate-800 mb-3">Tentang Dusun</h4>
          <p className="text-slate-600 leading-relaxed mb-8">
            {dusun.description}
          </p>
          <button 
            onClick={onClose}
            className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 transition font-medium"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
}

const DesaBandarUI = ({ dusunData, filteredDusun, artikelData = [], adminData = [], scrolled, isMenuOpen, setIsMenuOpen, selectedDusun, setSelectedDusun, searchTerm, setSearchTerm }) => {
  const [openDropdown, setOpenDropdown] = React.useState(null);
  
  function getDusunName(dusun_id) {
    const dusun = dusunData.find(d => d.id === dusun_id);
    return dusun ? dusun.name : '';
  }
  
  function getAuthorNames(authors) {
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
  }
  
  const stripHtml = (value) => {
    if (!value) return '';
    const text = String(value).replace(/<[^>]*>/g, '');
    return text.replace(/\s+/g, ' ').trim();
  };


  return (
  <div className="font-sans text-slate-800 bg-slate-50 min-h-screen">
      {/* --- NAVBAR --- */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-emerald-900 shadow-lg py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-full">
               {/* Logo Placeholder - Ganti dengan Logo Kab Pacitan */}
               <img src="/img/logo-kab-pacitan.png" alt="Logo Kabupaten Pacitan" className="w-8 h-8 rounded-full" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-lg leading-tight">Desa Bandar</h1>
              <p className="text-xs opacity-80 font-light">Kec. Bandar, Kab. Pacitan</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 text-white text-sm font-medium">
            <a href="#beranda" className="hover:text-emerald-300 transition">Beranda</a>
            <div className="relative group">
              <button className="hover:text-emerald-300 transition flex items-center gap-1">
                Profil Desa
                <span className="text-xs"><ChevronDown size={16} /></span>
              </button>
              <div className="absolute left-0 mt-0 w-56 bg-emerald-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40 py-2">
                <a href="#tentang" className="block px-4 py-3 text-white hover:bg-emerald-700 transition text-sm">Visi & Misi</a>
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
            <a href="#beranda" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-300 transition">Beranda</a>
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
                  <a href="#tentang" onClick={() => { setIsMenuOpen(false); setOpenDropdown(null); }} className="hover:text-emerald-300 transition py-1 text-sm">Visi & Misi</a>
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
            <a href="#dusun" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-300 transition">Data Dusun</a>
            <a href="#kontak" onClick={() => setIsMenuOpen(false)} className="hover:text-emerald-300 transition">Kontak</a>
          </div>
        )}
      </nav>

      {/* --- HERO SECTION --- */}
      <header id="beranda" className="relative h-[85vh] flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <video 
          src="/vid/drone.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline
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
              <h3 className="text-2xl font-bold text-slate-800">8234 <span className="text-sm font-normal">Jiwa (BPS, 2024)</span></h3>
            </div>
          </div>
          <div className="flex items-center gap-4 py-4 md:py-0 justify-center md:justify-start px-4">
            <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
              <MapPin size={32} />
            </div>
            <div>
              <p className="text-slate-500 text-sm">Luas Wilayah</p>
              <h3 className="text-2xl font-bold text-slate-800">100 <span className="text-sm font-normal">Ha (BPS, 2024)</span></h3>
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
                  <DusunCardCarousel images={Array.isArray(dusun.images) && dusun.images.length > 0 ? dusun.images : (dusun.image ? [dusun.image] : [])} alt={dusun.name} />
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

      {/* --- FEATURED BERITA + SIDEBAR --- */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-emerald-600 font-bold uppercase tracking-wide text-sm mb-2">Informasi Terkini</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Berita & Artikel Terbaru</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Featured Articles */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {artikelData.slice(0, 3).map((artikel) => (
                  <Link
                    key={artikel.id}
                    href={`/artikel/${artikel.slug}`}
                    className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col md:flex-row hover:shadow-2xl transition-all duration-300 group"
                  >
                    {artikel.image && (
                      <div className="relative h-48 md:h-auto md:w-48 flex-shrink-0 overflow-hidden">
                        <img
                          src={artikel.image}
                          alt={artikel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-600 transition line-clamp-2">
                        {artikel.title}
                      </h4>
                      <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">
                        {stripHtml(artikel.content)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{artikel.created_at && new Date(artikel.created_at).toLocaleDateString('id-ID')}</span>
                        <span className="text-emerald-600 font-semibold group-hover:gap-2 transition-all flex items-center gap-1">
                          Baca <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/berita" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition">
                  Lihat Semua Berita <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <SidebarInfo />
              </div>
            </div>
          </div>
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
          <div className="lg:w-1/2 grid grid-cols-1 gap-4">
            <div className="rounded-2xl shadow-lg overflow-hidden">
              <iframe 
                width="100%" 
                height="315" 
                src="https://www.youtube.com/embed/CVOqj84VfGE" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer id="kontak" className="bg-slate-900 text-slate-300 py-6">
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
                  <span>0852-3504-8661</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-emerald-500 w-5 h-5 shrink-0" />
                  <span>pelayanandesabandar@gmail.com</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-6">Akses Cepat</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/layanan-surat" className="hover:text-emerald-400 transition">Layanan Surat</Link></li>
                <li><Link href="/berita" className="hover:text-emerald-400 transition">Berita Desa</Link></li>
                <li><Link href="/pengaduan-masyarakat" className="hover:text-emerald-400 transition">Pengaduan Masyarakat</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Desa Bandar. Dikembangkan oleh KKN-PPM UGM Swarna Bandar 2025.
          </div>
        </div>
      </footer>

      {/* --- MODAL DETAIL DUSUN --- */}
      {selectedDusun && (
        <DusunDetailModal dusun={selectedDusun} onClose={() => setSelectedDusun(null)} />
      )}
      {/* ...existing code... */}

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
}

export default DesaBandarUI;
