import pool from '../../../lib/mysql';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, name, position, description, icon, color, photo_url, display_order FROM struktur_organisasi ORDER BY display_order ASC'
    );
    
    return NextResponse.json({ data: rows });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { title, name, position, description, icon, color, photo_url, display_order } = await req.json();
    
    const [result] = await pool.query(
      'INSERT INTO struktur_organisasi (title, name, position, description, icon, color, photo_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, name, position, description, icon, color, photo_url || null, display_order]
    );
    
    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, title, name, position, description, icon, color, photo_url, display_order } = await req.json();
    
    const [result] = await pool.query(
      'UPDATE struktur_organisasi SET title = ?, name = ?, position = ?, description = ?, icon = ?, color = ?, photo_url = ?, display_order = ? WHERE id = ?',
      [title, name, position, description, icon, color, photo_url || null, display_order, id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID diperlukan' }, { status: 400 });
    }
    
    const [result] = await pool.query(
      'DELETE FROM struktur_organisasi WHERE id = ?',
      [id]
    );
    
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
