'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useTransition } from 'react'
import type { Resource } from '@/lib/resources'
import ResourceCard from './ResourceCard'

// ── Types ──────────────────────────────────────────────────────────────────────

const FILTER_GROUPS = [
  { key: 'competition', label: 'Competition', values: ['frc', 'ftc', 'both'] },
  { key: 'type',        label: 'Type',        values: ['guide', 'code', 'video', 'doc'] },
  { key: 'difficulty',  label: 'Difficulty',  values: ['beginner', 'intermediate', 'advanced'] },
  { key: 'topic',       label: 'Topic',       values: ['programming', 'mechanical', 'electrical', 'strategy', 'scouting', 'business'] },
  { key: 'language',    label: 'Language',    values: ['java', 'python', 'c++', 'kotlin', 'blocks'] },
] as const

const FILTER_KEYS = FILTER_GROUPS.map(g => g.key)
type SortOption  = 'newest' | 'oldest' | 'alpha'

// ── URL param helpers ──────────────────────────────────────────────────────────

function useFilterParams() {
  const sp     = useSearchParams()
  const router = useRouter()
  const [,startTransition] = useTransition()

  const push = (params: URLSearchParams) =>
    startTransition(() => router.push(`/resources/?${params}`, { scroll: false }))

  const setFilter = (key: string, value: string) => {
    const p = new URLSearchParams(sp.toString())
    if (p.get(key) === value) { p.delete(key) } else { p.set(key, value) }
    p.delete('page')
    push(p)
  }

  const clearFilters = () => {
    const p = new URLSearchParams(sp.toString())
    FILTER_KEYS.forEach(k => p.delete(k))
    push(p)
  }

  const setSort = (sort: SortOption) => {
    const p = new URLSearchParams(sp.toString())
    if (sort === 'newest') { p.delete('sort') } else { p.set('sort', sort) }
    push(p)
  }

  const setQuery = (q: string) => {
    const p = new URLSearchParams(sp.toString())
    if (q.trim()) { p.set('q', q.trim()) } else { p.delete('q') }
    push(p)
  }

  const removeParam = (key: string) => {
    const p = new URLSearchParams(sp.toString())
    p.delete(key)
    push(p)
  }

  return {
    sp,
    setFilter,
    clearFilters,
    setSort,
    setQuery,
    removeParam,
    activeFilterCount: FILTER_KEYS.filter(k => sp.has(k)).length,
    sort: (sp.get('sort') ?? 'newest') as SortOption,
    query: sp.get('q') ?? '',
  }
}

// ── Filter + sort logic (runs client-side) ─────────────────────────────────────

function applyFilters(resources: Resource[], sp: URLSearchParams): Resource[] {
  let result = [...resources]
  const q = sp.get('q')?.toLowerCase()

  if (q) result = result.filter(r =>
    r.title.toLowerCase().includes(q) ||
    r.description.toLowerCase().includes(q) ||
    r.tags.some(t => t.toLowerCase().includes(q)) ||
    r.topics.some(t => t.toLowerCase().includes(q))
  )

  for (const key of FILTER_KEYS) {
    const val = sp.get(key)
    if (!val) continue
    if (key === 'competition') result = result.filter(r => r.competition === val)
    if (key === 'type')        result = result.filter(r => r.type === val)
    if (key === 'difficulty')  result = result.filter(r => r.difficulty === val)
    if (key === 'topic')       result = result.filter(r => r.topics.includes(val as Resource['topics'][number]))
    if (key === 'language')    result = result.filter(r => r.language === val)
  }

  const sort = sp.get('sort') as SortOption | null
  if (sort === 'oldest') result.sort((a, b) => new Date(a.date_added).getTime() - new Date(b.date_added).getTime())
  if (sort === 'alpha')  result.sort((a, b) => a.title.localeCompare(b.title))
  // newest: already sorted by lib/resources.ts

  return result
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SearchInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <form
      onSubmit={e => { e.preventDefault(); onChange((e.currentTarget.elements.namedItem('q') as HTMLInputElement).value) }}
      role="search"
      className="relative w-full"
    >
      <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        name="q"
        type="search"
        defaultValue={value}
        key={value}           // re-mount when cleared externally
        placeholder="Search by title, topic, or tag…"
        aria-label="Search resources"
        className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 pl-10 pr-24 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
      />
      <button type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 text-xs font-medium transition-colors">
        Search
      </button>
    </form>
  )
}

function Sidebar({
  sp, setFilter, clearFilters, activeFilterCount,
}: {
  sp: URLSearchParams
  setFilter: (k: string, v: string) => void
  clearFilters: () => void
  activeFilterCount: number
}) {
  const inner = (
    <div className="space-y-6">
      {activeFilterCount > 0 && (
        <button onClick={clearFilters}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
          Clear {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
        </button>
      )}
      {FILTER_GROUPS.map(({ key, label, values }) => (
        <div key={key}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{label}</h3>
          <div className="flex flex-wrap gap-1.5">
            {values.map(value => {
              const active = sp.get(key) === value
              return (
                <button key={value} onClick={() => setFilter(key, value)}
                  className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${active
                    ? 'bg-blue-600 text-white font-medium'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}>
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Mobile accordion */}
      <details className="md:hidden group mb-4">
        <summary className="flex items-center gap-2 cursor-pointer list-none rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm font-medium select-none">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/>
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-auto rounded-full bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </summary>
        <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
          {inner}
        </div>
      </details>
      {/* Desktop */}
      <aside className="hidden md:block w-52 shrink-0">{inner}</aside>
    </>
  )
}

function ActiveChips({ sp, removeParam, clearFilters }: {
  sp: URLSearchParams
  removeParam: (k: string) => void
  clearFilters: () => void
}) {
  const LABEL: Record<string, string> = { competition:'Competition', type:'Type', difficulty:'Difficulty', topic:'Topic', language:'Language', q:'Search' }
  const active = [...FILTER_KEYS, 'q' as const].filter(k => sp.has(k))
  if (!active.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-xs text-gray-500 dark:text-gray-400">Active:</span>
      {active.map(key => (
        <button key={key} onClick={() => removeParam(key)}
          className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
          <span className="text-blue-400 dark:text-blue-500 text-[10px] uppercase tracking-wider">{LABEL[key]}:</span>
          {sp.get(key)}
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      ))}
      {active.length > 1 && (
        <button onClick={clearFilters} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline">
          Clear all
        </button>
      )}
    </div>
  )
}

function SortLinks({ sort, setSort }: { sort: SortOption; setSort: (s: SortOption) => void }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
      <span>Sort:</span>
      {(['newest', 'alpha', 'oldest'] as const).map(opt => (
        <button key={opt} onClick={() => setSort(opt)}
          className={`capitalize px-2 py-0.5 rounded transition-colors ${sort === opt
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-medium'
            : 'hover:text-gray-900 dark:hover:text-gray-100'
          }`}>
          {opt}
        </button>
      ))}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function ResourceBrowser({ resources }: { resources: Resource[] }) {
  const { sp, setFilter, clearFilters, setSort, setQuery, removeParam, activeFilterCount, sort, query } = useFilterParams()
  const filtered = useMemo(() => applyFilters(resources, sp), [resources, sp])

  return (
    <>
      {/* Search */}
      <div className="mb-4">
        <SearchInput value={query} onChange={setQuery} />
      </div>

      {/* Active chips */}
      <ActiveChips sp={sp} removeParam={removeParam} clearFilters={clearFilters} />

      <div className="flex flex-col md:flex-row gap-8">
        <Sidebar sp={sp} setFilter={setFilter} clearFilters={clearFilters} activeFilterCount={activeFilterCount} />

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length === resources.length
                ? `${filtered.length} resource${filtered.length !== 1 ? 's' : ''}`
                : `${filtered.length} of ${resources.length} resource${resources.length !== 1 ? 's' : ''}`}
            </p>
            <SortLinks sort={sort} setSort={setSort} />
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 font-medium">No resources match your filters.</p>
              <p className="mt-1 text-sm text-gray-400 dark:text-gray-500">
                Try removing a filter or{' '}
                <button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 hover:underline">clear all</button>.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(r => <ResourceCard key={r.slug} resource={r} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
