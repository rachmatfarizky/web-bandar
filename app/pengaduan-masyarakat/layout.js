import PageTransition from '../../components/PageTransition';

export const metadata = {
  title: 'Pengaduan Masyarakat - Desa Bandar',
  description: 'Saluran pengaduan resmi untuk masyarakat Desa Bandar. Sampaikan masalah, keluhan, atau saran Anda kepada pemerintah desa.'
};

export default function PengaduanLayout({ children }) {
  return <PageTransition>{children}</PageTransition>;
}
