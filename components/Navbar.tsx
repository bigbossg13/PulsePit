'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { href: '/',          label: 'Home' },
  { href: '/resources', label: 'Resources' },
  { href: '/guides',    label: 'Guides' },
  { href: '/code',      label: 'Code' },
  { href: '/videos',    label: 'Videos' },
  { href: '/docs',      label: 'Docs' },
]

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const active   = href === '/' ? pathname === '/' : pathname.startsWith(href)
  return (
    <Link
      href={href}
      className={`text-sm transition-colors hover:text-gray-900 dark:hover:text-gray-100 ${
        active
          ? 'text-gray-900 dark:text-gray-100 font-medium'
          : 'text-gray-500 dark:text-gray-400'
      }`}
    >
      {label}
    </Link>
  )
}

// Rendered inside Navbar (server context), so SearchProvider is imported
// dynamically at the Navbar level. We import it here since Navbar is already
// a client component — SearchProvider itself is a server component.
// To keep the import clean we re-export the trigger only in the Navbar and
// mount SearchModal + SearchProvider in layout.tsx separately.
import SearchTrigger from './SearchTrigger'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-gray-100 shrink-0">
            <span className="text-blue-600">⚡</span>
            PulsePit
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            {NAV_LINKS.map(l => <NavLink key={l.href} {...l} />)}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <SearchTrigger />

            {/* GitHub link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-3 space-y-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
