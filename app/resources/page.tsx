import { Suspense } from 'react'
import { getAllResources } from '@/lib/resources'
import type { Resource } from '@/lib/resources'
import ResourceCard from '@/components/ResourceCard'
import FilterSidebar from '@/components/FilterSidebar'
import SearchBar from '@/components/SearchBar'
import ActiveFilters from '@/components/ActiveFilters'

// All known filter keys that live in URL params
const FILTER_KEYS = ['competition', 'type', 'difficulty', 'topic', 'language'] as const

type SortOption = 'newest' | 'oldest' | 'alpha'

interface SearchParams {
  q?: string
  sort?: SortOption
  competition?: string
  type?: string
  difficulty?: string
  topic?: string
  language?: string
}

function applyFilters(resources: Resource[], params: SearchParams): Resource[] {
  let result = resources

  // Text search across title, description, and tags
  if (params.q) {
    const q = params.q.toLowerCase()
    result = result.filter(r =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.tags.some(t => t.toLowerCase().includes(q)) ||
      r.topics.some(t => t.toLowerCase().includes(q))
    )
  }

  if (params.competition) result = result.filter(r => r.competition === params.competition)
  if (params.type)        result = result.filter(r => r.type === params.type as Resource['type'])
  if (params.difficulty)  result = result.filter(r => r.difficulty === params.difficulty as Resource['difficulty'])
  if (params.topic)       result = result.filter(r => r.topics.includes(params.topic as Resource['topics'][number]))
  if (params.language)    result = result.filter(r => r.language === params.language)

  // Sort
  switch (params.sort) {
    case 'oldest': result = [...result].sort((a, b) => new Date(a.date_added).getTime() - new Date(b.date_added).getTime()); break
    case 'alpha':  result = [...result].sort((a, b) => a.title.localeCompare(b.title)); break
    default:       /* newest — already sorted by getAllResources() */ break
  }

  return result
}

function SortSelect({ current }: { current: string }) {
  // Server component can't use onChange — render as a form with a submit button
  // or use a client component. We use a tiny inline client wrapper via a link trick.
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <span>Sort:</span>
      {(['newest', 'alpha', 'oldest'] as const).map(opt => (
        <a
          key={opt}
          href={`?sort=${opt}`}
          className={`capitalize px-2 py-0.5 rounded transition-colors ${
            (current || 'newest') === opt
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
              : 'hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          {opt}
        </a>
      ))}
    </div>
  )
}

// Loading skeleton shown while client components (FilterSidebar, SearchBar) hydrate
function GridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse" />
      ))}
    </div>
  )
}

export default function ResourcesPage({ searchParams }: { searchParams: SearchParams }) {
  const allResources = getAllResources()
  const filtered = applyFilters(allResources, searchParams)

  const activeFilterCount = FILTER_KEYS.filter(k => searchParams[k]).length
  const hasQuery = Boolean(searchParams.q)

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Resources</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {allResources.length} resource{allResources.length !== 1 ? 's' : ''} across FRC &amp; FTC
        </p>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <Suspense>
          <SearchBar defaultValue={searchParams.q} placeholder="Search by title, topic, or tag…" />
        </Suspense>
      </div>

      {/* Active filter chips */}
      {(activeFilterCount > 0 || hasQuery) && (
        <div className="mb-4">
          <Suspense>
            <ActiveFilters searchParams={searchParams as Record<string, string>} />
          </Suspense>
        </div>
      )}

      {/* Layout: sidebar + grid */}
      <div className="flex flex-col md:flex-row gap-8">

        {/* Filter sidebar */}
        <Suspense>
          <FilterSidebar />
        </Suspense>

        {/* Resource grid */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length === allResources.length
                ? `${filtered.length} resource${filtered.length !== 1 ? 's' : ''}`
                : `${filtered.length} of ${allResources.length} resource${allResources.length !== 1 ? 's' : ''}`
              }
            </p>
            <SortSelect current={searchParams.sort ?? 'newest'} />
          </div>

          <Suspense fallback={<GridSkeleton />}>
            {filtered.length === 0 ? (
              <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
                <p className="text-gray-500 dark:text-gray-400 font-medium">No resources match your filters.</p>
                <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                  Try removing a filter or{' '}
                  <a href="/resources" className="text-blue-600 dark:text-blue-400 hover:underline">clear all</a>.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map(r => <ResourceCard key={r.slug} resource={r} />)}
              </div>
            )}
          </Suspense>
        </div>
      </div>
    </main>
  )
}
