import pool from '../../../lib/mysql';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { authorIds } = await req.json();

  if (!Array.isArray(authorIds) || authorIds.length === 0) {
    return NextResponse.json({ authors: [] });
  }

  try {
    const [authors] = await pool.query(
      `SELECT id, name FROM users WHERE id IN (${authorIds.map(() => '?').join(',')})`,
      authorIds
    );

    // Map back to original order and add fallback names
    const authorMap = Object.fromEntries(authors.map(a => [a.id, a.name]));
    const result = authorIds.map(id => ({
      id,
      name: authorMap[id] || `User ${id}`
    }));

    return NextResponse.json({ authors: result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
