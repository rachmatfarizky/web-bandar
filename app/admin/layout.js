import AdminPageTransition from '../../components/AdminPageTransition';

export const metadata = {
  title: 'Admin Dashboard - Desa Bandar',
  description: 'Halaman administrator Desa Bandar'
};

export default function AdminLayout({ children }) {
  return <AdminPageTransition>{children}</AdminPageTransition>;
}
