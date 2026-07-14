// ============================================================
// GADGET VILLA — Tailwind config (standalone สำหรับ apps/web)
// preset ถูก inline ไว้ในไฟล์นี้เพื่อให้ build บน Vercel ได้จาก root = apps/web
// สีอ้างอิงจาก CSS variables ใน app/tokens.css
// ============================================================
import type { Config } from 'tailwindcss';

const rgb = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', lg: '1.5rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        brand: { DEFAULT: rgb('--brand'), fg: rgb('--brand-fg') },
        accent: { DEFAULT: rgb('--accent'), fg: rgb('--accent-fg') },
        accent2: { DEFAULT: rgb('--accent-2'), fg: rgb('--accent-2-fg') },
        fantech: '#E4002B',
        ugreen: '#16A34A',
        gray: {
          50: rgb('--gray-50'), 100: rgb('--gray-100'), 200: rgb('--gray-200'),
          300: rgb('--gray-300'), 400: rgb('--gray-400'), 500: rgb('--gray-500'),
          600: rgb('--gray-600'), 700: rgb('--gray-700'), 800: rgb('--gray-800'),
          900: rgb('--gray-900'), 950: rgb('--gray-950'),
        },
        success: rgb('--success'),
        warning: rgb('--warning'),
        error: rgb('--error'),
        info: rgb('--info'),
        bg: { DEFAULT: rgb('--bg'), subtle: rgb('--bg-subtle') },
        card: rgb('--card'),
        fg: { DEFAULT: rgb('--fg'), muted: rgb('--fg-muted') },
        border: rgb('--border'),
        ring: rgb('--ring'),
      },
      borderRadius: {
        sm: 'var(--radius-sm)', md: 'var(--radius-md)', lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)', full: 'var(--radius-full)',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)', sm: 'var(--shadow-sm)', md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)', xl: 'var(--shadow-xl)',
      },
      fontFamily: {
        sans: ['var(--font-kanit)', '"Noto Sans Thai"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        h1: ['2.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '800' }],
        h2: ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        h3: ['1.5rem', { lineHeight: '1.25', fontWeight: '700' }],
        h4: ['1.25rem', { lineHeight: '1.3', fontWeight: '600' }],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        fast: '150ms', base: '220ms', slow: '350ms',
      },
      keyframes: {
        'fade-rise': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-rise': 'fade-rise var(--dur-base) var(--ease-out) both',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
};

export default config;
