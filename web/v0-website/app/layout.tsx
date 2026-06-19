import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'HealthByte - Your Biology, Decoded',
  description: 'HealthByte fuses food photos, wearable HRV/sleep data, and AI to deliver your Weekly Impact Score — the only metric that shows what actually moves the needle.',
  generator: 'v0.app',
  keywords: ['health tracking', 'biohacking', 'HRV', 'sleep tracking', 'nutrition', 'AI', 'food recognition'],
  openGraph: {
    title: 'HealthByte - Your Biology, Decoded',
    description: 'Track your biology, not just calories. Get your Weekly Impact Score.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  themeColor: '#000000',
  colorScheme: 'dark' as const,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen flex flex-col items-center">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
