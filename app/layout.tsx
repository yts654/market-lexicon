import type { Metadata } from 'next'
import { Fraunces, Inter, IBM_Plex_Mono, Noto_Sans_JP, Noto_Serif_JP } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-sans',
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jp',
})

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jp-serif',
})

export const metadata: Metadata = {
  title: 'Market Lexicon — Global Financial Intelligence',
  description: 'An institutional-grade learning environment for financial markets vocabulary, analysis, and investment terminology.',
  generator: 'v0.app',
}

export const viewport = {
  themeColor: '#0F1419',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html className={`${fraunces.variable} ${inter.variable} ${ibmPlexMono.variable} ${notoSansJP.variable} ${notoSerifJP.variable} bg-bg-primary`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
