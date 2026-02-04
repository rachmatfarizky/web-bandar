import pool from '../../../lib/mysql';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const count = searchParams.get('count');
    
    if (count === '1') {
      const [rows] = await pool.query('SELECT COUNT(*) as total FROM dusun');
      return NextResponse.json({ count: rows[0]?.total || 0 });
    }
    
    const [dusunRows] = await pool.query('SELECT id, name, population, head, description, commodities, images FROM dusun');
    
    // Parse JSON fields
    const dusun = dusunRows.map(row => ({
      ...row,
      commodities: typeof row.commodities === 'string' ? JSON.parse(row.commodities || '[]') : row.commodities,
      images: typeof row.images === 'string' ? JSON.parse(row.images || '[]') : row.images
    }));
    
    return NextResponse.json({ dusun });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    const { name, population, head, description, commodities, images } = await req.json();
    
    const [result] = await pool.query(
      'INSERT INTO dusun (name, population, head, description, commodities, images) VALUES (?, ?, ?, ?, ?, ?)',
      [name, population, head, description, JSON.stringify(commodities), JSON.stringify(images)]
    );
    
    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, name, population, head, description, commodities, images } = await req.json();
    
    await pool.query(
      'UPDATE dusun SET name = ?, population = ?, head = ?, description = ?, commodities = ?, images = ? WHERE id = ?',
      [name, population, head, description, JSON.stringify(commodities), JSON.stringify(images), id]
    );
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    
    await pool.query('DELETE FROM dusun WHERE id = ?', [id]);
    
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}