import React from 'react';
import { notFound } from 'next/navigation';
import { fetchArtikelData, fetchDusunData } from '../../../lib/supabase';
import { MapPin, User } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Resolve author names using Supabase service role on the server component
async function fetchAuthorNames(authorIds) {
  if (!Array.isArray(authorIds) || authorIds.length === 0) return [];
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return authorIds.map(id => ({ id, name: id }));
  }

  const adminClient = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const authors = [];
  for (const id of authorIds) {
    try {
      const { data, error } = await adminClient.auth.admin.getUserById(id);
      if (error) {
        authors.push({ id, name: id });
        continue;
      }
      const user = data?.user ?? data;
      const name = user?.user_metadata?.name || user?.email || id;
      authors.push({ id, name });
    } catch (e) {
      authors.push({ id, name: id });
    }
  }
  return authors;
}

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

  // Handle authors saved as array, JSON string, or legacy single string
  let authorsList = [];
  if (artikel.authors) {
    if (Array.isArray(artikel.authors)) {
      const authorIds = artikel.authors.map(a => (typeof a === 'string' ? a : a?.id)).filter(Boolean);
      if (authorIds.length > 0) authorsList = await fetchAuthorNames(authorIds);
    } else if (typeof artikel.authors === 'string') {
      try {
        const parsed = JSON.parse(artikel.authors);
        const authorIds = Array.isArray(parsed)
          ? parsed.map(a => (typeof a === 'string' ? a : a?.id)).filter(Boolean)
          : [];
        if (authorIds.length > 0) authorsList = await fetchAuthorNames(authorIds);
        else if (artikel.authors) authorsList = [{ id: artikel.authors, name: artikel.authors }];
      } catch {
        authorsList = [{ id: artikel.authors, name: artikel.authors }];
      }
    }
  } else if (artikel.author) {
    // Legacy single author field
    authorsList = [{ id: artikel.author, name: artikel.author }];
  }

  const authorNames = authorsList.map(a => a.name).join(', ');

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      {artikel.image && (
        <img src={artikel.image} alt={artikel.title} className="w-full h-72 object-cover rounded-2xl mb-8" />
      )}
      <h1 className="text-3xl font-bold mb-4 text-slate-900">{artikel.title}</h1>
      <div className="flex flex-wrap items-center gap-3 mb-6 text-xs text-slate-500">
        {artikel.created_at && (
          <span>{new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        )}
        {dusunName && (
          <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
            <MapPin className="w-4 h-4" /> {dusunName}
          </span>
        )}
        {authorNames && (
          <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            <User className="w-4 h-4" /> {authorNames}
          </span>
        )}
      </div>
      <div className="text-slate-700 whitespace-pre-line leading-relaxed text-lg">
        {artikel.content}
      </div>
    </div>
  );
}
