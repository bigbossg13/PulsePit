import { getAllResources } from '@/lib/resources'
import ResourceCard from '@/components/ResourceCard'
import FilterSidebar from '@/components/FilterSidebar'
import SearchBar from '@/components/SearchBar'
import { Suspense } from 'react'
import type { Resource } from '@/lib/resources'

interface PageProps {
  searchParams: { [key: string]: string | undefined }
}

function ResourceGrid({ searchParams }: PageProps) {
  let resources = getAllResources()
  const { competition, type, difficulty, topic, language, q } = searchParams

  if (q) resources = resources.filter(r =>
    r.title.toLowerCase().includes(q.toLowerCase()) ||
    r.description.toLowerCase().includes(q.toLowerCase()) ||
    r.tags.some(t => t.toLowerCase().includes(q.toLowerCase()))
  )
  if (competition) resources = resources.filter(r => r.competition === competition)
  if (type) resources = resources.filter(r => r.type === (type === 'doc' ? 'doc' : type) as Resource['type'])
  if (difficulty) resources = resources.filter(r => r.difficulty === difficulty as Resource['difficulty'])
  if (topic) resources = resources.filter(r => r.topics.includes(topic as Resource['topics'][number]))
  if (language) resources = resources.filter(r => r.language === language)

  return (
    <div className="flex-1 min-w-0">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {resources.length} resource{resources.length !== 1 ? 's' : ''}
      </p>
      {resources.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500 dark:text-gray-400">
          No resources found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => <ResourceCard key={r.slug} resource={r} />)}
        </div>
      )}
    </div>
  )
}

export default function ResourcesPage({ searchParams }: PageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Resources</h1>
        <SearchBar defaultValue={searchParams.q} />
      </div>
      <div className="flex gap-8">
        <Suspense>
          <FilterSidebar />
        </Suspense>
        <Suspense>
          <ResourceGrid searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  )
}
