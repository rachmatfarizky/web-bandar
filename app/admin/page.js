'use client';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <ul className="space-y-4">
        <li>
          <Link href="/admin/login" className="text-emerald-600 hover:underline">Login Admin</Link>
        </li>
        <li>
          <Link href="/admin/artikel" className="text-emerald-600 hover:underline">Kelola Artikel</Link>
        </li>
        <li>
          <Link href="/admin/dusun" className="text-emerald-600 hover:underline">Kelola Dusun</Link>
        </li>
      </ul>
    </div>
  );
}
