'use client'
import { useState, useMemo, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { buildIndex, type SearchRecord } from '@/lib/search'
import ResourceCard from './ResourceCard'

// We receive serialised SearchRecord[] from the server; we need full Resource
// objects for ResourceCard. We look them up client-side from the same data.
// Since this page is statically exported, getAllResources() isn't available
// on the client — we reconstruct cards from the records prop directly.
// ResourceCard only needs the fields present in SearchRecord + content (unused
// in the card), so we cast safely.

export default function SearchPageClient({ records }: { records: SearchRecord[] }) {
  const sp     = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState(sp.get('q') ?? '')

  // Keep input in sync with URL (e.g. browser back)
  useEffect(() => { setQuery(sp.get('q') ?? '') }, [sp])

  const index   = useMemo(() => buildIndex(records), [records])
  const results = useMemo(
    () => query.trim().length >= 2 ? index.search(query.trim()) : [],
    [index, query],
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (query.trim()) p.set('q', query.trim())
    router.push(`/search/?${p}`, { scroll: false })
  }

  const handleClear = () => {
    setQuery('')
    router.push('/search/', { scroll: false })
  }

  return (
    <>
      {/* Search input */}
      <form onSubmit={handleSubmit} role="search" className="relative mb-8">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search resources…"
          aria-label="Search resources"
          className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-24 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        {query && (
          <button type="button" onClick={handleClear} aria-label="Clear search"
            className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
        <button type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-medium transition-colors">
          Search
        </button>
      </form>

      {/* Results */}
      {query.trim().length < 2 ? (
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 py-12">
          Type at least 2 characters to search. Or press{' '}
          <kbd className="rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 font-mono text-xs">⌘K</kbd>
          {' '}from anywhere.
        </p>
      ) : results.length === 0 ? (
        <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No results for <strong className="text-gray-700 dark:text-gray-300">&ldquo;{query}&rdquo;</strong>.
          </p>
          <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
            Try different keywords or{' '}
            <Link href="/resources/" className="text-blue-600 dark:text-blue-400 hover:underline">browse all resources</Link>.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            {results.length} result{results.length !== 1 ? 's' : ''} for{' '}
            <strong className="text-gray-700 dark:text-gray-300">&ldquo;{query}&rdquo;</strong>
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {results.map(r => (
              // Cast SearchRecord to Resource — ResourceCard only uses the shared fields
              <ResourceCard key={r.item.slug} resource={r.item as unknown as import('@/lib/resources').Resource} />
            ))}
          </div>
        </>
      )}
    </>
  )
}
