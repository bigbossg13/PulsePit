import Link from 'next/link'
import SearchBar from '@/components/SearchBar'
import ResourceCard from '@/components/ResourceCard'
import { getFeaturedResources, getRecentResources, getAllResources } from '@/lib/resources'

export default function HomePage() {
  const featured = getFeaturedResources()
  const recent = getRecentResources(6)
  const all = getAllResources()

  return (
    <main>
      <section className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-b from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 px-4 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">FRC &amp; FTC Resource Hub</h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          The central knowledge base for FIRST Robotics teams. Find guides, code, videos, and docs — fast.
        </p>
        <div className="mt-8 max-w-xl mx-auto">
          <SearchBar placeholder="Search resources, topics, or tags..." />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {[
            { label: 'FRC', href: '/resources?competition=frc' },
            { label: 'FTC', href: '/resources?competition=ftc' },
            { label: 'Code', href: '/code' },
            { label: 'Guides', href: '/guides' },
          ].map(item => (
            <Link key={item.label} href={item.href}
              className="rounded-full border border-gray-300 dark:border-gray-700 px-4 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-16">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            { label: 'Total Resources', value: all.length },
            { label: 'Guides', value: all.filter(r => r.type === 'guide').length },
            { label: 'Code Examples', value: all.filter(r => r.type === 'code').length },
            { label: 'Videos', value: all.filter(r => r.type === 'video').length },
          ].map(stat => (
            <div key={stat.label} className="rounded-lg border border-gray-200 dark:border-gray-800 p-4">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-6">Browse by Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { href: '/guides', label: 'Guides', icon: '📖', desc: 'Step-by-step tutorials' },
              { href: '/code', label: 'Code', icon: '💻', desc: 'Libraries & examples' },
              { href: '/videos', label: 'Videos', icon: '▶️', desc: 'Visual walkthroughs' },
              { href: '/docs', label: 'Docs', icon: '📄', desc: 'Reference documentation' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="rounded-lg border border-gray-200 dark:border-gray-800 p-5 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-center group">
                <div className="text-3xl mb-2">{item.icon}</div>
                <div className="font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400">{item.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {featured.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold mb-6">Featured Resources</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featured.map(r => <ResourceCard key={r.slug} resource={r} />)}
            </div>
          </section>
        )}

        {recent.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recently Added</h2>
              <Link href="/resources" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">View all →</Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recent.map(r => <ResourceCard key={r.slug} resource={r} />)}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
