import React from 'react';
import { notFound } from 'next/navigation';
import { fetchArtikelData, fetchDusunData } from '../../../lib/supabase';
import { MapPin } from 'lucide-react';


export default async function ArtikelDetailPage(props) {
  const { id } = await props.params;
  const artikelList = await fetchArtikelData();
  const artikel = artikelList.find(a => String(a.id) === String(id));
  if (!artikel) return notFound();

  let dusunName = '';
  if (artikel.dusun_id) {
    const dusunList = await fetchDusunData();
    const dusun = dusunList.find(d => d.id === artikel.dusun_id);
    dusunName = dusun?.name || '';
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      {artikel.image && (
        <img src={artikel.image} alt={artikel.title} className="w-full h-72 object-cover rounded-2xl mb-8" />
      )}
      <h1 className="text-3xl font-bold mb-4 text-slate-900">{artikel.title}</h1>
      <div className="flex items-center gap-3 mb-6 text-xs text-slate-500">
        {artikel.created_at && (
          <span>{new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        )}
        {dusunName && (
          <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
            <MapPin className="w-4 h-4" /> {dusunName}
          </span>
        )}
      </div>
      <div className="text-slate-700 whitespace-pre-line leading-relaxed text-lg">
        {artikel.content}
      </div>
    </div>
  );
}
