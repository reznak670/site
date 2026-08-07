import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono, Oswald, Rubik_Wet_Paint } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import Nav from '@/components/Nav'

// Condensed poster grotesque — гиг-афиша, а не sci-fi. Есть кириллица.
const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
})

// Хоррор-заголовки: Cattedrale — готический блэклеттер с кириллицей (RUS-версия
// от Penka220, полный набор А-Я/а-я). Локальный файл, поэтому подключаем через
// next/font/local, а не Google Fonts.
const cattedrale = localFont({
  src: './fonts/Cattedrale-Regular.ttf',
  weight: '400',
  style: 'normal',
  variable: '--font-horror',
  display: 'swap',
})

const rubikWetPaint = Rubik_Wet_Paint({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  variable: '--font-blood',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Bloody Scissors — Сургутский Ньюметал',
  description: 'Официальный сайт группы Bloody Scissors. Тяжелая музыка из Сургута. КОЗААА!',
  keywords: ['Bloody Scissors', 'нюметал', 'Сургут', 'метал', 'группа', 'концерт'],
  authors: [{ name: 'Bloody Scissors' }],
  openGraph: {
    title: 'Bloody Scissors — Сургутский Ньюметал',
    description: 'Официальный сайт группы Bloody Scissors. КОЗААА!',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Bloody Scissors',
  },
  metadataBase: new URL('https://bloody-scissors.vercel.app'),
  manifest: '/manifest.json',
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Bloody Scissors',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/img/favicon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/img/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#08080d',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      className={`${oswald.variable} ${inter.variable} ${jetbrainsMono.variable} ${cattedrale.variable} ${rubikWetPaint.variable}`}
    >
      <body className="bg-ink text-paper">
        <Nav />
        {children}
        <footer className="border-t border-line px-5 py-8 text-center">
          <p className="font-mono text-xs uppercase tracking-widest2 text-mute">
            Bloody Scissors © {new Date().getFullYear()} · Сургут
          </p>
        </footer>
      </body>
    </html>
  )
}
