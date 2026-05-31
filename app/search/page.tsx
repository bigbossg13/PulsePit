import { getAllResources } from '@/lib/resources'
import ResourceCard from '@/components/ResourceCard'
import SearchBar from '@/components/SearchBar'

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q ?? ''
  const all = getAllResources()
  const results = q
    ? all.filter(r =>
        r.title.toLowerCase().includes(q.toLowerCase()) ||
        r.description.toLowerCase().includes(q.toLowerCase()) ||
        r.tags.some(t => t.toLowerCase().includes(q.toLowerCase())) ||
        r.topics.some(t => t.toLowerCase().includes(q.toLowerCase()))
      )
    : []

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Search</h1>
      <SearchBar defaultValue={q} />
      {q && (
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{q}&quot;
          </p>
          {results.length === 0 ? (
            <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500 dark:text-gray-400">
              No results found. Try different keywords or browse by <a href="/resources" className="text-blue-600 dark:text-blue-400 hover:underline">all resources</a>.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {results.map(r => <ResourceCard key={r.slug} resource={r} />)}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
