import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllResources } from '@/lib/resources'
import { toSearchRecord, search } from '@/lib/search'
import ResourceCard from '@/components/ResourceCard'
import SearchBar from '@/components/SearchBar'
import { Suspense } from 'react'

export function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Metadata {
  const q = searchParams.q
  return {
    title: q ? `"${q}" — Search — PulsePit` : 'Search — PulsePit',
  }
}

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q       = searchParams.q?.trim() ?? ''
  const records = getAllResources().map(toSearchRecord)
  const results = q.length >= 2 ? search(records, q) : []

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Search</h1>

      <Suspense>
        <SearchBar defaultValue={q} placeholder="Search resources…" />
      </Suspense>

      {q && (
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
            {results.length > 0
              ? <>{results.length} result{results.length !== 1 ? 's' : ''} for <strong className="text-gray-700 dark:text-gray-300">&ldquo;{q}&rdquo;</strong></>
              : <>No results for <strong className="text-gray-700 dark:text-gray-300">&ldquo;{q}&rdquo;</strong></>
            }
          </p>

          {results.length === 0 ? (
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Try different keywords or{' '}
                <Link href="/resources" className="text-blue-600 dark:text-blue-400 hover:underline">
                  browse all resources
                </Link>.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map(r => {
                // getAllResources() still has full Resource objects; look up by slug
                const full = getAllResources().find(res => res.slug === r.item.slug)
                return full ? <ResourceCard key={r.item.slug} resource={full} /> : null
              })}
            </div>
          )}
        </div>
      )}

      {!q && (
        <div className="mt-8 text-center text-sm text-gray-400 dark:text-gray-500">
          Use the search bar above, or press{' '}
          <kbd className="rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 font-mono text-xs">⌘K</kbd>
          {' '}from anywhere.
        </div>
      )}
    </main>
  )
}
