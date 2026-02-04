import pool from '../../../../lib/mysql';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const [rows] = await pool.query('SELECT * FROM artikel WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return NextResponse.json({ error: 'Artikel tidak ditemukan' }, { status: 404 });
    }
    
    const artikel = rows[0];
    // Parse authors jika JSON string
    if (typeof artikel.authors === 'string') {
      try {
        artikel.authors = JSON.parse(artikel.authors);
      } catch {
        artikel.authors = [];
      }
    }
    
    return NextResponse.json({ artikel });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { title, slug, content, dusun_id, image, authors } = await req.json();
    
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

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM artikel WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}