import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Bloody Scissors - Сургутский Ньюметал',
  description: 'Официальный сайт группы Bloody Scissors. Тяжелая музыка из Сургута. КОЗААА!',
  keywords: ['Bloody Scissors', 'нюметал', 'Сургут', 'метал', 'группа', 'концерт'],
  authors: [{ name: 'Bloody Scissors' }],
  openGraph: {
    title: 'Bloody Scissors - Сургутский Ньюметал',
    description: 'Официальный сайт группы Bloody Scissors. КОЗААА!',
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Bloody Scissors',
  },
  metadataBase: new URL('https://bloody-scissors.vercel.app'),
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=PT+Mono&family=Rubik+Distressed&family=Rubik+Dirt&family=Rubik+Burned&family=Rubik+Wet+Paint&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0a0000' }}>
        {children}
      </body>
    </html>
  )
}
