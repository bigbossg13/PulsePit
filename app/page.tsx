import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import SearchBar from '@/components/SearchBar'
import ResourceCard from '@/components/ResourceCard'
import { getFeaturedResources, getRecentResources, getAllResources, getResourcesByType } from '@/lib/resources'

export const metadata: Metadata = {
  title: 'PulsePit — FRC & FTC Resource Hub',
  description:
    'The central knowledge base for FIRST Robotics teams. Find guides, code examples, videos, and reference docs — all in one place.',
}

// ── Sub-sections ───────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  href,
  linkLabel = 'View all',
}: {
  title: string
  href?: string
  linkLabel?: string
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {href && (
        <Link
          href={href}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
        >
          {linkLabel}
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </Link>
      )}
    </div>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────────

function Hero() {
  const quickFilters = [
    { label: 'FRC',    href: '/resources?competition=frc',  color: 'bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/50' },
    { label: 'FTC',    href: '/resources?competition=ftc',  color: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50' },
    { label: 'Guides', href: '/guides',                     color: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100 dark:hover:bg-purple-900/50' },
    { label: 'Code',   href: '/code',                       color: 'bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50' },
    { label: 'Videos', href: '/videos',                     color: 'bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/50' },
  ]

  return (
    <section className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950/30" aria-hidden="true" />
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07]"
        style={{
          backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-4 py-20 sm:py-28 text-center sm:px-6 lg:px-8">
        {/* Label chip */}
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/50 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          FRC &amp; FTC Season 2024–25
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl lg:text-6xl">
          The FIRST Robotics
          <br />
          <span className="text-blue-600 dark:text-blue-400">Knowledge Hub</span>
        </h1>

        <p className="mt-5 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Guides, code examples, videos, and reference docs for FRC and FTC teams —
          all in one place. Find what you need in seconds, not hours.
        </p>

        {/* Search */}
        <div className="mt-8 max-w-xl mx-auto">
          <Suspense>
            <SearchBar placeholder="Search by topic, language, or keyword…" />
          </Suspense>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            Press{' '}
            <kbd className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            {' '}from anywhere to search
          </p>
        </div>

        {/* Quick filter chips */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {quickFilters.map(f => (
            <Link
              key={f.label}
              href={f.href}
              className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${f.color}`}
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Stats bar ──────────────────────────────────────────────────────────────────

function StatsBar() {
  const all = getAllResources()
  const stats = [
    { value: all.length,                                     label: 'Resources' },
    { value: all.filter(r => r.type === 'guide').length,     label: 'Guides' },
    { value: all.filter(r => r.type === 'code').length,      label: 'Code examples' },
    { value: all.filter(r => r.type === 'video').length,     label: 'Videos' },
    { value: all.filter(r => r.competition === 'frc').length + all.filter(r => r.competition === 'both').length, label: 'FRC resources' },
    { value: all.filter(r => r.competition === 'ftc').length + all.filter(r => r.competition === 'both').length, label: 'FTC resources' },
  ]

  return (
    <section className="border-b border-gray-100 dark:border-gray-800/60 bg-gray-50 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <dl className="grid grid-cols-3 md:grid-cols-6 divide-x divide-gray-200 dark:divide-gray-800">
          {stats.map(s => (
            <div key={s.label} className="flex flex-col items-center py-5 px-2 text-center">
              <dt className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{s.value}</dt>
              <dd className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-tight">{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

// ── Quick-link grid ────────────────────────────────────────────────────────────

function QuickLinks() {
  const guides = getResourcesByType('guide')
  const code   = getResourcesByType('code')
  const videos = getResourcesByType('video')
  const docs   = getResourcesByType('doc')

  const links = [
    {
      href:  '/guides',
      icon:  '📖',
      label: 'Guides',
      desc:  'Step-by-step tutorials for programming, mechanical, and strategy',
      count: guides.length,
      color: 'hover:border-purple-400 dark:hover:border-purple-600 group-hover:text-purple-600 dark:group-hover:text-purple-400',
      bg:    'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      href:  '/code',
      icon:  '💻',
      label: 'Code',
      desc:  'Reusable libraries and examples in Java, Python, Kotlin, and more',
      count: code.length,
      color: 'hover:border-green-400 dark:hover:border-green-600 group-hover:text-green-600 dark:group-hover:text-green-400',
      bg:    'bg-green-50 dark:bg-green-950/30',
    },
    {
      href:  '/videos',
      icon:  '▶️',
      label: 'Videos',
      desc:  'Visual walkthroughs and competition breakdowns',
      count: videos.length,
      color: 'hover:border-orange-400 dark:hover:border-orange-600 group-hover:text-orange-600 dark:group-hover:text-orange-400',
      bg:    'bg-orange-50 dark:bg-orange-950/30',
    },
    {
      href:  '/docs',
      icon:  '📄',
      label: 'Docs',
      desc:  'API references, framework guides, and technical specifications',
      count: docs.length,
      color: 'hover:border-blue-400 dark:hover:border-blue-600 group-hover:text-blue-600 dark:group-hover:text-blue-400',
      bg:    'bg-blue-50 dark:bg-blue-950/30',
    },
  ]

  return (
    <section>
      <SectionHeader title="Browse by type" href="/resources" linkLabel="All resources" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {links.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative rounded-xl border border-gray-200 dark:border-gray-800 p-5 transition-all ${item.color} hover:shadow-sm`}
          >
            {/* Icon chip */}
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${item.bg} text-xl mb-3`}>
              {item.icon}
            </div>

            <div className="flex items-baseline justify-between gap-2">
              <h3 className={`font-semibold text-gray-900 dark:text-gray-100 transition-colors ${item.color.split(' ').filter(c => c.startsWith('group')).join(' ')}`}>
                {item.label}
              </h3>
              <span className="text-xs text-gray-400 dark:text-gray-600 tabular-nums shrink-0">
                {item.count}
              </span>
            </div>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
              {item.desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ── Featured resources ─────────────────────────────────────────────────────────

function FeaturedResources() {
  const featured = getFeaturedResources()
  if (featured.length === 0) return null

  return (
    <section>
      <SectionHeader title="Featured" href="/resources?featured=true" linkLabel="Browse all" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {featured.slice(0, 6).map(r => (
          <ResourceCard key={r.slug} resource={r} />
        ))}
      </div>
    </section>
  )
}

// ── Recently added ─────────────────────────────────────────────────────────────

function RecentlyAdded() {
  const featured = getFeaturedResources()
  const featuredSlugs = new Set(featured.map(r => r.slug))
  // Show recent resources that aren't already shown in Featured
  const recent = getRecentResources(9).filter(r => !featuredSlugs.has(r.slug)).slice(0, 6)

  if (recent.length === 0) return null

  return (
    <section>
      <SectionHeader title="Recently added" href="/resources?sort=newest" linkLabel="View all" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recent.map(r => <ResourceCard key={r.slug} resource={r} />)}
      </div>
    </section>
  )
}

// ── Contribute CTA ─────────────────────────────────────────────────────────────

function ContributeCTA() {
  return (
    <section className="rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/20 p-8 text-center">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        Know a great resource we&rsquo;re missing?
      </h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-5">
        PulsePit is community-maintained. Submit a pull request with your resource and help
        other teams build faster.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-4 py-2 text-sm font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Contribute on GitHub
        </a>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 px-4 py-2 text-sm font-medium transition-colors"
        >
          Learn how it works
        </Link>
      </div>
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        <QuickLinks />
        <FeaturedResources />
        <RecentlyAdded />
        <ContributeCTA />
      </div>
    </>
  )
}
