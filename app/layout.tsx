import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar          from '@/components/Navbar'
import SearchProvider  from '@/components/SearchProvider'
import { ThemeProvider } from '@/components/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title:       'PulsePit — FRC & FTC Resource Hub',
  description: 'The central knowledge base for FIRST Robotics teams. Find guides, code, videos, and docs.',
}

// Runs synchronously before React hydrates — sets `dark` class on <html> to
// prevent a flash of wrong theme. Must be an inline script, not a module.
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (t === 'dark' || (!t && prefersDark) || (t === 'system' && prefersDark)) {
      document.documentElement.classList.add('dark');
    }
  } catch(e) {}
})();
`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Blocking theme script — prevents flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100`}>
        <ThemeProvider>
          <Navbar />
          <SearchProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
