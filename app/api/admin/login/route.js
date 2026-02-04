import pool from '../../../../lib/mysql';
import bcrypt from 'bcryptjs';
import { signJwt } from '../../../../lib/jwt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username dan password wajib diisi' }, { status: 400 });
    }
    const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
    if (!user) {
      return NextResponse.json({ error: 'Username tidak ditemukan' }, { status: 401 });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Password salah' }, { status: 401 });
    }
    // Sukses login, return JWT token (and user data for convenience)
    const { password: _, ...userData } = user;
    const token = signJwt({ id: user.id, username: user.username, name: user.name });
    
    // Set secure HTTP-only cookie dengan token JWT
    const response = NextResponse.json({ user: userData, token });
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });
    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
