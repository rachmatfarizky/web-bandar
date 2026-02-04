import pool from '../../../../../lib/mysql';
import { verifyJwt } from '../../../../../lib/jwt';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  try {
    const auth = req.headers.get('authorization');
    if (!auth || !auth.startsWith('Bearer ')) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = auth.replace('Bearer ', '').trim();
    const payload = verifyJwt(token);
    if (!payload || !payload.id) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    const { oldPassword, newPassword } = await req.json();
    if (!oldPassword || !newPassword) {
      return Response.json({ error: 'Password lama dan baru wajib diisi' }, { status: 400 });
    }
    // Get user
    const [users] = await pool.query('SELECT id, password FROM users WHERE id = ?', [payload.id]);
    if (!users.length) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }
    const user = users[0];
    const valid = await bcrypt.compare(oldPassword, user.password);
    if (!valid) {
      return Response.json({ error: 'Password lama salah' }, { status: 400 });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, payload.id]);
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
