'use client';

import React, { useEffect, useState } from 'react';
import { ChevronRight, Shield, Briefcase, Heart, Users, Zap, Award, Target, Compass, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SidebarInfo from '../../components/SidebarInfo';

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

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    <div className="min-h-screen bg-slate-50">
      <Header scrolled={scrolled} />

      {/* Hero Section */}
      <header className="relative h-72 flex items-center justify-center text-center text-white bg-gradient-to-r from-emerald-700 to-emerald-900 pt-20">
        <div className="container px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Struktur Organisasi</h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-2xl mx-auto">
            Susunan perangkat pemerintahan Desa Bandar yang siap melayani masyarakat
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-16">
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

      <Footer />
    </div>
  );
}
