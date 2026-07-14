import type { Metadata, Viewport } from 'next';
import { Kanit } from 'next/font/google';
import { Providers } from '@/components/providers';
import { AnnouncementBar } from '@/components/layout/announcement-bar';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const kanit = Kanit({
  subsets: ['thai', 'latin'],
  variable: '--font-kanit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://gadgetvilla.co.th'),
  title: {
    default: 'GADGET VILLA — ตัวแทนจำหน่าย Fantech & UGREEN ของแท้',
    template: '%s | GADGET VILLA',
  },
  description:
    'ศูนย์รวมเกมมิ่งเกียร์ Fantech และอุปกรณ์ชาร์จ/NAS UGREEN ของแท้ ประกันศูนย์ไทย ส่งไวทั่วประเทศ',
  keywords: ['Fantech', 'UGREEN', 'เกมมิ่งเกียร์', 'ที่ชาร์จ', 'GadgetVilla'],
  openGraph: {
    type: 'website',
    locale: 'th_TH',
    siteName: 'GADGET VILLA',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0d12' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning className={kanit.variable}>
      <body>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
