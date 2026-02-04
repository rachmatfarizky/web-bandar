import React from 'react';
import { notFound } from 'next/navigation';
import pool from '../../../lib/mysql';
import { MapPin, User } from 'lucide-react';
import sanitizeHtml from 'sanitize-html';

// Generate metadata untuk halaman artikel dinamis
export async function generateMetadata({ params }) {
  const { id } = await params;
  
  // Fetch artikel by ID or slug
  let artikel = null;
  
  if (!isNaN(id)) {
    const [artikelRows] = await pool.query('SELECT * FROM artikel WHERE id = ?', [parseInt(id)]);
    artikel = artikelRows[0];
  }
  
  if (!artikel) {
    const [artikelRows] = await pool.query('SELECT * FROM artikel WHERE slug = ?', [id]);
    artikel = artikelRows[0];
  }
  
  if (!artikel) {
    return {
      title: 'Artikel Tidak Ditemukan - Desa Bandar',
      description: 'Artikel yang Anda cari tidak ditemukan'
    };
  }

  // Strip HTML dari konten untuk description
  const plainContent = sanitizeHtml(artikel.content, { allowedTags: [] }).substring(0, 160);

  return {
    title: `${artikel.title} - Desa Bandar`,
    description: plainContent || 'Artikel dari Desa Bandar',
    keywords: [artikel.title, 'Desa Bandar', 'Artikel'],
    openGraph: {
      title: artikel.title,
      description: plainContent,
      type: 'article',
      url: `https://desabandar.id/artikel/${artikel.slug || artikel.id}`,
      images: artikel.image ? [{ url: artikel.image, alt: artikel.title }] : []
    }
  };
}

export default async function ArtikelDetailPage(props) {
  const { id } = await props.params;
  
  // Try to fetch by ID first (if it's a number), then by slug
  let artikel = null;
  
  // Check if id is numeric
  if (!isNaN(id)) {
    const [artikelRows] = await pool.query('SELECT * FROM artikel WHERE id = ?', [parseInt(id)]);
    artikel = artikelRows[0];
  }
  
  // If not found by ID, try to fetch by slug
  if (!artikel) {
    const [artikelRows] = await pool.query('SELECT * FROM artikel WHERE slug = ?', [id]);
    artikel = artikelRows[0];
  }
  
  if (!artikel) return notFound();

  // Fetch dusun name if exists
  let dusunName = '';
  if (artikel.dusun_id) {
    const [dusunRows] = await pool.query('SELECT name FROM dusun WHERE id = ?', [artikel.dusun_id]);
    dusunName = dusunRows[0]?.name || '';
  }

  // Handle authors saved as array, JSON string, or legacy single string
  let authorsList = [];
  if (artikel.authors) {
    let authorIds = [];
    
    // If authors is already an array (from JSON.parse in route), use it directly
    if (Array.isArray(artikel.authors)) {
      authorIds = artikel.authors.map(a => {
        if (typeof a === 'string') return a;
        if (typeof a === 'number') return a;
        if (a?.id) return a.id;
        return null;
      }).filter(Boolean);
    } else if (typeof artikel.authors === 'string') {
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(artikel.authors);
        if (Array.isArray(parsed)) {
          authorIds = parsed.map(a => {
            if (typeof a === 'string' || typeof a === 'number') return a;
            if (a?.id) return a.id;
            return null;
          }).filter(Boolean);
        } else {
          // Single value in JSON
          authorIds = [parsed];
        }
      } catch {
        // Not JSON, treat as single ID
        authorIds = [artikel.authors];
      }
    } else if (typeof artikel.authors === 'number') {
      authorIds = [artikel.authors];
    }
    
    if (authorIds.length > 0) {
      // Query admin table for author names
      const [adminRows] = await pool.query(
        `SELECT id, name FROM users WHERE id IN (${authorIds.map(() => '?').join(',')})`,
        authorIds
      );
      // Map IDs to names, keeping the order
      authorsList = authorIds.map(id => {
        const found = adminRows.find(a => String(a.id) === String(id));
        return { id, name: found?.name || `Admin ${id}` };
      });
    }
  } else if (artikel.author) {
    // Legacy single author field
    const [adminRows] = await pool.query(
      `SELECT id, name FROM users WHERE id = ?`,
      [artikel.author]
    );
    authorsList = [{ id: artikel.author, name: adminRows[0]?.name || artikel.author }];
  }

  const authorNames = authorsList.map(a => a.name).join(', ');

  const safeContentHtml = sanitizeHtml(artikel.content || '', {
    allowedTags: [
      'p',
      'br',
      'strong',
      'b',
      'em',
      'i',
      'u',
      'a',
      'ul',
      'ol',
      'li',
      'blockquote',
      'h1',
      'h2',
      'h3',
      'hr',
      'img'
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'data-width', 'style']
    },
    allowedStyles: {
      img: {
        width: [/^\d+(%|px)$/],
        height: [/^auto$/],
        'max-width': [/^100%$/],
        display: [/^block$/],
        'margin-left': [/^(auto|0|0px)$/],
        'margin-right': [/^(auto|0|0px)$/]
      }
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName, attribs) => {
        const next = { ...attribs };
        // Force safer link behavior
        next.rel = 'noopener noreferrer nofollow';
        next.target = '_blank';
        return { tagName, attribs: next };
      }
    }
  });

  return (
    <article>
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
      <div
        className="text-slate-700 leading-relaxed text-lg"
        dangerouslySetInnerHTML={{ __html: safeContentHtml }}
      />
    </article>
  );
}
