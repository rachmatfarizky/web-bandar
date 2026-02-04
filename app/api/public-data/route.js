import pool from '../../../lib/mysql';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const [dusunRows] = await pool.query('SELECT * FROM dusun');
    const [artikelRows] = await pool.query('SELECT * FROM artikel ORDER BY created_at DESC');
    
    // Parse JSON fields for dusun
    const dusun = dusunRows.map(row => ({
      ...row,
      commodities: typeof row.commodities === 'string' ? JSON.parse(row.commodities || '[]') : row.commodities,
      images: typeof row.images === 'string' ? JSON.parse(row.images || '[]') : row.images
    }));
    
    return NextResponse.json({ dusun, artikel: artikelRows });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
