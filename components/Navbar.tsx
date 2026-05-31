'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            PulsePit
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/resources" className="hover:text-primary transition-colors">Resources</Link>
            <Link href="/guides" className="hover:text-primary transition-colors">Guides</Link>
            <Link href="/code" className="hover:text-primary transition-colors">Code</Link>
            <Link href="/videos" className="hover:text-primary transition-colors">Videos</Link>
            <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
