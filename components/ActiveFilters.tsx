'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const FILTER_KEYS = ['competition', 'type', 'topic', 'language', 'q'] as const

const LABEL: Record<string, string> = {
  competition: 'Competition',
  type:        'Type',
  topic:       'Topic',
  language:    'Language',
  q:           'Search',
}

export default function ActiveFilters({ searchParams }: { searchParams: Record<string, string> }) {
  const router = useRouter()
  const sp = useSearchParams()

  const active = FILTER_KEYS.filter(k => searchParams[k])
  if (active.length === 0) return null

  const remove = (key: string) => {
    const params = new URLSearchParams(sp.toString())
    params.delete(key)
    router.push(`/resources/?${params}`, { scroll: false })
  }

  const clearAll = () => {
    const params = new URLSearchParams(sp.toString())
    FILTER_KEYS.forEach(k => params.delete(k))
    router.push(`/resources/?${params}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-500 dark:text-gray-400">Active:</span>
      {active.map(key => (
        <button
          key={key}
          onClick={() => remove(key)}
          className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-2.5 py-0.5 text-xs font-medium hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
        >
          <span className="text-blue-400 dark:text-blue-500 text-[10px] uppercase tracking-wider">
            {LABEL[key]}:
          </span>
          {searchParams[key]}
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      ))}
      {active.length > 1 && (
        <button
          onClick={clearAll}
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 underline"
        >
          Clear all
        </button>
      )}
    </div>
  )
}
