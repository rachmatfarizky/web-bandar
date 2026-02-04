"use client";

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function SidebarInfo() {
  return (
    <div className="space-y-6">
      {/* Desa Info */}
      <a href="https://maps.app.goo.gl/nxzZrmNPLRgW8XmL8" target="_blank" rel="noopener noreferrer" className="block no-underline">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5" />
            <h3 className="font-bold text-lg">Desa Bandar</h3>
          </div>
          <p className="text-sm text-emerald-100 mb-4">Kecamatan Bandar, Kabupaten Pacitan</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-emerald-100">Kabupaten</span>
              <span className="font-semibold">Kabupaten Pacitan</span>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-100">Provinsi</span>
              <span className="font-semibold">Jawa Timur</span>
            </div>
          </div>
        </div>
      </a>

      {/* Kontak Desa */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">Kontak Desa</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-500">Telepon</p>
              <p className="font-semibold text-slate-800">0852-3504-8661</p>
            </div>
            <a href="https://wa.me/6285235048661" target="_blank" rel="noopener noreferrer" className="ml-auto text-emerald-600 text-xs font-bold hover:text-emerald-700">WhatsApp</a>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-semibold text-slate-800 break-all">pelayanandesabandar@gmail.com</p>
            </div>
            <button className="ml-auto text-emerald-600 text-xs font-bold hover:text-emerald-700 whitespace-nowrap">Kirim</button>
          </div>
        </div>
      </div>

      {/* Nomor Penting */}
      <div className="bg-red-50 rounded-2xl p-6 shadow-lg border border-red-100">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">!</div>
          <h3 className="font-bold text-red-900">Nomor Penting</h3>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-red-600 font-semibold mb-1">Puskesmas</p>
            <div className="flex justify-between items-center">
              <p className="text-slate-800 font-semibold">0813-3193-9978</p>
              <a href="https://wa.me/628133193978" target="_blank" rel="noopener noreferrer" className="text-red-600 text-xs font-bold hover:text-red-700">WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
