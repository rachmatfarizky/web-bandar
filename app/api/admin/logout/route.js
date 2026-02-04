import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const response = NextResponse.json({ success: true, message: 'Logout berhasil' });
    response.cookies.delete('admin_session');
    return response;
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
