'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminAuthGuard({ children }) {
  const router = useRouter();

  useEffect(() => {
    function checkSession() {
      const session = localStorage.getItem('admin_session');
      if (!session) {
        router.replace('/admin/login');
      }
    }
    checkSession();
  }, [router]);

  return children;
}
