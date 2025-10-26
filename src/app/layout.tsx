import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { trpc } from '@/utils/trpc'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'REDMOON Agency',
  description: 'Influencer-Brand Collaboration Platform',
}

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

export default trpc.withTRPC(RootLayout)
