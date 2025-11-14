// Temporarily disable global CSS import to avoid PostCSS/Sucrase build error
// Restore `globals.css` once the CSS is validated and compatible with the build pipeline
// import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Fira_Code } from 'next/font/google'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/ThemeProvider'
import Head from 'next/head'

// Load Google Fonts with Next.js font optimization
const orbitron = {
  variable: '--font-orbitron',
  className: 'font-sans', // Fallback
  preload: true,
  display: 'swap',
}

const rajdhani = {
  variable: '--font-rajdhani',
  className: 'font-sans', // Fallback
  preload: true,
  display: 'swap',
}

const audiowide = {
  variable: '--font-audiowide',
  className: 'font-sans', // Fallback
  preload: true,
  display: 'swap',
}

const pressStart2P = {
  variable: '--font-press-start-2p',
  className: 'font-mono', // Fallback
  preload: true,
  display: 'swap',
}

export const metadata: Metadata = {
  title: 'THE GOD EYE | Advanced Intelligence Platform',
  description: 'Multi-Mode Intelligence Platform - OSINT | SS7 | WiFi Security | Reverse Image Search',
  keywords: ['OSINT', 'SS7', 'Cybersecurity', 'Intelligence', 'Reconnaissance', 'Digital Forensics'],
  authors: [{ name: 'THE GOD EYE Team' }],
  creator: 'THE GOD EYE',
  publisher: 'THE GOD EYE',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'THE GOD EYE | Advanced Intelligence Platform',
    description: 'Multi-Mode Intelligence Platform - OSINT | SS7 | WiFi Security | Reverse Image Search',
    siteName: 'THE GOD EYE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'THE GOD EYE | Advanced Intelligence Platform',
    description: 'Multi-Mode Intelligence Platform - OSINT | SS7 | WiFi Security | Reverse Image Search',
    creator: '@godeye',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0a0e17' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={`${inter.variable} ${firaCode.variable}`}
    >
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0a0e17" />
      </Head>
      <body className={`min-h-screen bg-cyber-darker text-cyber-blue font-sans antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
