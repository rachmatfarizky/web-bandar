import pool from '../../../lib/mysql';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const [users] = await pool.query('SELECT id, username, name FROM users');
    // For compatibility, return as admins
    return NextResponse.json({ admins: users });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
