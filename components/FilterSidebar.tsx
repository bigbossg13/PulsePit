'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const FILTERS = {
  competition: ['frc', 'ftc', 'both'],
  type: ['guide', 'code', 'video', 'doc'],
  difficulty: ['beginner', 'intermediate', 'advanced'],
  topic: ['programming', 'mechanical', 'electrical', 'strategy', 'scouting', 'business'],
  language: ['java', 'python', 'c++', 'kotlin', 'blocks'],
}

export default function FilterSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get(key) === value) {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    router.push(`/resources?${params.toString()}`)
  }

  return (
    <aside className="w-full md:w-56 shrink-0">
      {Object.entries(FILTERS).map(([key, values]) => (
        <div key={key} className="mb-6">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 capitalize">{key}</h3>
          <div className="flex flex-wrap gap-2">
            {values.map(value => {
              const active = searchParams.get(key) === value
              return (
                <button
                  key={value}
                  onClick={() => updateFilter(key, value)}
                  className={`rounded-full px-3 py-1 text-xs capitalize transition-colors ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </aside>
  )
}
