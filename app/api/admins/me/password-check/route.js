import pool from '../../../../../lib/mysql';
import bcrypt from 'bcryptjs';
import { verifyJwt } from '../../../../../lib/jwt';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Get token from header
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 401 });
    }

    // Verify JWT token
    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ valid: false, error: 'Invalid token' }, { status: 401 });
    }

    const { password } = await req.json();
    if (!password) {
      return NextResponse.json({ valid: false, error: 'Password is required' }, { status: 400 });
    }

    // Get current user from database
    const [rows] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [decoded.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ valid: false, error: 'User not found' }, { status: 404 });
    }

    // Compare password with stored hash
    const isValidPassword = await bcrypt.compare(password, rows[0].password);

    return NextResponse.json({ valid: isValidPassword });
  } catch (error) {
    console.error('Password check error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
