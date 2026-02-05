import './globals.css';
import PageTransition from '../components/PageTransition';

export const viewport = 'width=device-width, initial-scale=1';

export const metadata = {
  title: 'Desa Bandar',
  description: 'Website resmi Desa Bandar - Informasi, berita, layanan, dan transparansi pemerintahan desa',
  keywords: ['Desa Bandar', 'Pemerintahan Desa', 'Berita Desa', 'Layanan Desa'],
  authors: [{ name: 'Desa Bandar' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Desa Bandar',
    description: 'Website resmi Desa Bandar - Informasi, berita, layanan, dan transparansi pemerintahan desa',
    url: 'https://desabandar.id',
    siteName: 'Desa Bandar',
    locale: 'id_ID',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desa Bandar',
    description: 'Website resmi Desa Bandar'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="theme-color" content="#10b981" />
      </head>
      <body>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
