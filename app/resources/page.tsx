import { Suspense } from 'react'
import { getAllResources } from '@/lib/resources'
import ResourceBrowser from '@/components/ResourceBrowser'
import { ResourceGridSkeleton } from '@/components/Skeletons'

// Static page — no searchParams on the server. All filtering is client-side
// inside ResourceBrowser so this page can be exported as a plain HTML file.

export const metadata = {
  title:       'Resources — PulsePit',
  description: 'Browse all FRC and FTC guides, code examples, videos, and documentation.',
}

export default function ResourcesPage() {
  const resources = getAllResources()

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">Resources</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {resources.length} resource{resources.length !== 1 ? 's' : ''} across FRC &amp; FTC
        </p>
      </div>

      {/* ResourceBrowser is a client component: handles URL params, filtering,
          sorting, and search entirely in the browser. */}
      <Suspense fallback={<ResourceGridSkeleton count={6} />}>
        <ResourceBrowser resources={resources} />
      </Suspense>
    </main>
  )
}
