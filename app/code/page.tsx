import { getAllResources } from '@/lib/resources'
import ResourceCard from '@/components/ResourceCard'

export default function CodePage() {
  const resources = getAllResources().filter(r => r.type === 'code')
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Code</h1>
      {resources.length === 0 ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-500 dark:text-gray-400">
          No code yet. Check back soon!
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map(r => <ResourceCard key={r.slug} resource={r} />)}
        </div>
      )}
    </main>
  )
}
