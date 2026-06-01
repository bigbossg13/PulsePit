import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar         from '@/components/Navbar'
import SearchProvider from '@/components/SearchProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:       'PulsePit — FRC & FTC Resource Hub',
  description: 'The central knowledge base for FIRST Robotics teams. Find guides, code, videos, and docs.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <Navbar />
        {/* SearchProvider = server component that builds index + mounts modal */}
        <SearchProvider />
        {children}
      </body>
    </html>
  )
}
