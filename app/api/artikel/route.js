import pool from '../../../lib/mysql';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const count = searchParams.get('count');
    
    if (count === '1') {
      const [rows] = await pool.query('SELECT COUNT(*) as total FROM artikel');
      return NextResponse.json({ count: rows[0]?.total || 0 });
    }
    
    const [artikelRows] = await pool.query('SELECT * FROM artikel');
    return NextResponse.json({ artikel: artikelRows });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, content, dusun_id, image, authors } = await req.json();
    
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    const authorsJson = Array.isArray(authors) ? JSON.stringify(authors) : '[]';
    
    const [result] = await pool.query(
      'INSERT INTO artikel (title, slug, content, dusun_id, image, authors) VALUES (?, ?, ?, ?, ?, ?)',
      [title, slug, content, dusun_id || null, image || '', authorsJson]
    );
    
    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, title, content, slug, dusun_id, image, authors } = await req.json();
    
    const authorsJson = Array.isArray(authors) ? JSON.stringify(authors) : '[]';
    
    await pool.query(
      'UPDATE artikel SET title = ?, slug = ?, content = ?, dusun_id = ?, image = ?, authors = ? WHERE id = ?',
      [title, slug, content, dusun_id || null, image || '', authorsJson, id]
    );
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

