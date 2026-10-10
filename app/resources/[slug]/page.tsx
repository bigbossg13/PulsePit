import { notFound }     from 'next/navigation'
import { Suspense }     from 'react'
import type { Metadata } from 'next'
import Link             from 'next/link'
import { MDXRemote }    from 'next-mdx-remote/rsc'
import readingTime      from 'reading-time'

import {
  getAllResources,
  getResourceBySlug,
  getRelatedResources,
  extractCodeBlock,
  toEmbedUrl,
  type Resource,
} from '@/lib/resources'

import TagBadge      from '@/components/TagBadge'
import ResourceCard  from '@/components/ResourceCard'
import TableOfContents from '@/components/TableOfContents'
import CodeBlock     from '@/components/CodeBlock'
import { mdxComponents } from '@/components/MdxComponents'

// ── Static params ──────────────────────────────────────────────────────────────

// With output: export, unknown slugs 404 — no server fallback.
export const dynamicParams = false

export function generateStaticParams() {
  return getAllResources().map(r => ({ slug: r.slug }))
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resource = getResourceBySlug(params.slug)
  if (!resource) return {}
  return {
    title:       `${resource.title} — PulsePit`,
    description: resource.description,
    openGraph: {
      title:       resource.title,
      description: resource.description,
      type:        'article',
    },
  }
}

// ── Shared header (all types) ──────────────────────────────────────────────────

function ResourceHeader({ resource, readTime }: { resource: Resource; readTime?: string }) {
  return (
    <header className="mb-8">
      {/* Breadcrumb */}
      <nav className="mb-4 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
        <Link href="/resources" className="hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
          Resources
        </Link>
        <span aria-hidden="true">›</span>
        <span className="capitalize">{resource.type}s</span>
      </nav>

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <TagBadge label={resource.type}        variant="type" />
        <TagBadge label={resource.competition.toUpperCase()} variant="competition" />
        {resource.difficulty && <TagBadge label={resource.difficulty} variant="difficulty" />}
        <TagBadge label={resource.subcategory} variant="topic" />{resource.topics.filter(t => t !== resource.subcategory).map(t => <TagBadge key={t} label={t} variant="topic" />)}
        {resource.language && <TagBadge label={resource.language} />}
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
        {resource.title}
      </h1>
      <p className="mt-3 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
        {resource.description}
      </p>

      {/* Meta row */}
      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 dark:text-gray-400">
        {resource.date_updated && (
          <span>
            Updated{' '}
            {new Date(resource.date_updated).toLocaleDateString('en-US', {
              month: 'long', day: 'numeric', year: 'numeric',
            })}
          </span>
        )}
        {readTime && <span>{readTime}</span>}
      </div>

      {/* Tags */}
      {resource.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {resource.tags.map(tag => <TagBadge key={tag} label={tag} />)}
        </div>
      )}

      {/* Links */}
      {((resource.links && resource.links.length > 0) || resource.source_url) && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {resource.source_url && (
            <a href={resource.source_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View source
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          )}
          {resource.links?.map((l, i) => (
            <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-1 text-xs text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {l.label}
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          ))}
        </div>
      )}

      {/* Edit link */}
      <div className="mt-3">
        <Link href={`/edit/${resource.slug}/`}
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          Edit
        </Link>
      </div>
    </header>
  )
}

// ── Share + copy-link button ───────────────────────────────────────────────────

function ShareRow() {
  return (
    <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-3">
      <Link
        href="/resources"
        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
      >
        ← Back to resources
      </Link>
    </div>
  )
}

// ── Related section ────────────────────────────────────────────────────────────

function RelatedResources({ resources }: { resources: Resource[] }) {
  if (!resources.length) return null
  return (
    <section className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Related resources</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map(r => <ResourceCard key={r.slug} resource={r} />)}
      </div>
    </section>
  )
}

// ── Type-specific renderers ────────────────────────────────────────────────────

async function GuideRenderer({ resource }: { resource: Resource }) {
  const rt = readingTime(resource.content ?? '')
  return (
    <div>
      <ResourceHeader resource={resource} readTime={rt.text} />
      <article className="leading-7 text-gray-700 dark:text-gray-300">
        <MDXRemote source={resource.content ?? ''} components={mdxComponents} />
      </article>
      <ShareRow />
    </div>
  )
}

async function CodeRenderer({ resource }: { resource: Resource }) {
  const { lang, code } = extractCodeBlock(resource.content ?? '')
  return (
    <div>
      <ResourceHeader resource={resource} />
      {resource.source_url && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Full repo:{' '}
          <a href={resource.source_url} target="_blank" rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline break-all">
            {resource.source_url}
          </a>
        </p>
      )}
      <CodeBlock code={code} lang={lang} />
      {/* Prose below the code block (description / context from MDX body text) */}
      {resource.content && !/^```/.test(resource.content.trim()) && (
        <article className="mt-6 leading-7 text-gray-700 dark:text-gray-300">
          <MDXRemote source={resource.content} components={mdxComponents} />
        </article>
      )}
      <ShareRow />
    </div>
  )
}

function VideoRenderer({ resource }: { resource: Resource }) {
  const embedUrl = resource.video_url ? toEmbedUrl(resource.video_url) : null
  return (
    <div>
      <ResourceHeader resource={resource} />
      {embedUrl ? (
        <div className="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-black my-6">
          <iframe
            src={embedUrl}
            title={resource.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="my-6 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center text-gray-500 dark:text-gray-400">
          No video URL provided.
        </div>
      )}
      {resource.content && (
        <article className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
          <MDXRemote source={resource.content} components={mdxComponents} />
        </article>
      )}
      <ShareRow />
    </div>
  )
}

async function DocRenderer({ resource }: { resource: Resource }) {
  const rt = readingTime(resource.content ?? '')
  return (
    <div className="flex gap-12">
      {/* Main content */}
      <div className="flex-1 min-w-0">
        <ResourceHeader resource={resource} readTime={rt.text} />
        <article className="leading-7 text-gray-700 dark:text-gray-300">
          <MDXRemote source={resource.content ?? ''} components={mdxComponents} />
        </article>
        <ShareRow />
      </div>
      {/* Sticky TOC — rendered client-side after hydration */}
      <div className="hidden xl:block w-52 shrink-0">
        <Suspense>
          <TableOfContents />
        </Suspense>
      </div>
    </div>
  )
}

function LinkRenderer({ resource }: { resource: Resource }) {
  const url = resource.source_url ?? resource.video_url
  const label =
    resource.type === 'chief-delphi' ? 'Open on Chief Delphi' :
    resource.type === 'whitepaper'   ? 'View whitepaper' :
                                       'Visit link'
  return (
    <div>
      <ResourceHeader resource={resource} />
      {url ? (
        <div className="my-8 flex flex-col items-center gap-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 p-10 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            className="text-gray-400" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400 break-all max-w-md">{url}</p>
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 text-sm font-medium transition-colors">
            {label}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>
        </div>
      ) : (
        <div className="my-8 rounded-xl border border-gray-200 dark:border-gray-800 p-8 text-center text-gray-500 dark:text-gray-400">
          No URL provided for this resource.
        </div>
      )}
      <ShareRow />
    </div>
  )
}



export default function ResourcePage({ params }: { params: { slug: string } }) {
  const resource = getResourceBySlug(params.slug)
  if (!resource) notFound()

  const related = getRelatedResources(resource, 3)

  let body: React.ReactNode
  switch (resource.type) {
    case 'guide':         body = <GuideRenderer resource={resource} />; break
    case 'code':          body = <CodeRenderer  resource={resource} />; break
    case 'video':         body = <VideoRenderer resource={resource} />; break
    case 'doc':           body = <DocRenderer   resource={resource} />; break
    case 'whitepaper':
    case 'chief-delphi':
    case 'link':          body = <LinkRenderer  resource={resource} />; break
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {body}
      <RelatedResources resources={related} />
    </main>
  )
}
