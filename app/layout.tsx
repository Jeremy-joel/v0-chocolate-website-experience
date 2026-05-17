import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Cold Glaze Chocolate | Luxury Artisan Chocolate Experience',
  description: 'Experience the pinnacle of chocolate craftsmanship. Cold Glaze brings you ultra-premium artisan chocolates with unparalleled flavor and luxury.',
  keywords: ['luxury chocolate', 'artisan chocolate', 'premium chocolate', 'cold glaze', 'gourmet'],
}

export const viewport: Viewport = {
  themeColor: '#0d0806',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased overflow-x-hidden`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
