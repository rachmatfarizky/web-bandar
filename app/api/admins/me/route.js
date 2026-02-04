import pool from '../../../../lib/mysql';
import { verifyJwt } from '../../../../lib/jwt';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = auth.replace('Bearer ', '').trim();
    const payload = verifyJwt(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    const [users] = await pool.query('SELECT id, username, name FROM users WHERE id = ?', [payload.id]);
    if (!users.length) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ user: users[0] });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
