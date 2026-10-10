import { Suspense } from 'react'
import { getAllResources } from '@/lib/resources'
import { toSearchRecord } from '@/lib/search'
import SearchPageClient from '@/components/SearchPageClient'
import { ResourceGridSkeleton } from '@/components/Skeletons'

export const metadata = {
  title: 'Search — PulsePit',
}

export default function SearchPage() {
  const records = getAllResources().map(toSearchRecord)
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Search</h1>
      <Suspense fallback={<ResourceGridSkeleton count={4} />}>
        <SearchPageClient records={records} />
      </Suspense>
    </main>
  )
}
