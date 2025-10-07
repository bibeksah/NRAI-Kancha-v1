import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NRAI Kancha - AI Assistant',
  description: 'Bilingual AI Assistant with voice support for English and Nepali',
  generator: 'NRAI Kancha',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.className}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
