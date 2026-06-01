'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const FILTER_GROUPS: { key: string; label: string; values: string[] }[] = [
  { key: 'competition', label: 'Competition',  values: ['frc', 'ftc', 'both'] },
  { key: 'type',        label: 'Type',         values: ['guide', 'code', 'video', 'doc'] },
  { key: 'difficulty',  label: 'Difficulty',   values: ['beginner', 'intermediate', 'advanced'] },
  { key: 'topic',       label: 'Subcategory',  values: ['design', 'mechanical', 'electrical', 'software', 'business', 'media', 'miscellaneous'] },
  { key: 'language',    label: 'Language',     values: ['java', 'python', 'c++', 'kotlin', 'blocks'] },
]

const FILTER_KEYS = FILTER_GROUPS.map(g => g.key)

function useFilterParams() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const set = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    // keep page at top when filters change
    params.delete('page')
    router.push(`/resources/?${params.toString()}`, { scroll: false })
  }

  const clear = () => {
    const params = new URLSearchParams(searchParams.toString())
    FILTER_KEYS.forEach(k => params.delete(k))
    // preserve search query
    router.push(`/resources/?${params.toString()}`, { scroll: false })
  }

  const activeCount = FILTER_KEYS.filter(k => searchParams.has(k)).length

  return { searchParams, set, clear, activeCount }
}

export default function FilterSidebar() {
  const { searchParams, set, clear, activeCount } = useFilterParams()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebar = (
    <div className="space-y-6">
      {/* Clear all */}
      {activeCount > 0 && (
        <button
          onClick={clear}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          Clear {activeCount} filter{activeCount !== 1 ? 's' : ''}
        </button>
      )}

      {FILTER_GROUPS.map(({ key, label, values }) => (
        <div key={key}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {label}
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {values.map(value => {
              const active = searchParams.get(key) === value
              return (
                <button
                  key={value}
                  onClick={() => set(key, value)}
                  className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                    active
                      ? 'bg-blue-600 text-white font-medium'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
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
      {/* Mobile toggle */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-800 px-4 py-2 text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="20" y2="12"/><line x1="12" y1="18" x2="20" y2="18"/></svg>
          Filters
          {activeCount > 0 && (
            <span className="ml-1 rounded-full bg-blue-600 text-white text-xs w-4 h-4 flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>

        {mobileOpen && (
          <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            {sidebar}
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:block w-52 shrink-0">
        {sidebar}
      </aside>
    </>
  )
}
