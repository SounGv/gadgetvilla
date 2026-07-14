import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GADGET VILLA',
    short_name: 'GadgetVilla',
    description: 'ตัวแทนจำหน่าย Fantech & UGREEN ของแท้ ประกันศูนย์ไทย',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0d12',
    theme_color: '#0b0d12',
    lang: 'th',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
