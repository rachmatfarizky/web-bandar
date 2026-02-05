import PageTransition from '../../components/PageTransition';

export const metadata = {
  title: 'Struktur Organisasi - Desa Bandar',
  description: 'Struktur organisasi pemerintahan Desa Bandar. Ketahui perangkat desa dan peran-peran mereka dalam melayani masyarakat.'
};

export default function StrukturLayout({ children }) {
  return <PageTransition>{children}</PageTransition>;
}
