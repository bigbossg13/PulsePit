import { getAllResources, getResourceBySlug, getRelatedResources } from '@/lib/resources'
import ResourceCard from '@/components/ResourceCard'
import TagBadge from '@/components/TagBadge'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateStaticParams() {
  return getAllResources().map(r => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resource = getResourceBySlug(params.slug)
  if (!resource) return {}
  return {
    title: `${resource.title} — PulsePit`,
    description: resource.description,
  }
}

export default function ResourcePage({ params }: { params: { slug: string } }) {
  const resource = getResourceBySlug(params.slug)
  if (!resource) notFound()
  const related = getRelatedResources(resource)

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap gap-2">
        <TagBadge label={resource.type} variant="type" />
        <TagBadge label={resource.competition} variant="competition" />
        <TagBadge label={resource.difficulty} variant="difficulty" />
        {resource.topics.map(t => <TagBadge key={t} label={t} variant="topic" />)}
      </div>
      <h1 className="text-3xl font-bold">{resource.title}</h1>
      <p className="mt-3 text-lg text-gray-600 dark:text-gray-400">{resource.description}</p>
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">Updated {resource.date_updated}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        {resource.tags.map(tag => <TagBadge key={tag} label={tag} />)}
      </div>

      {resource.source_url && (
        <a href={resource.source_url} target="_blank" rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
          View Source →
        </a>
      )}

      {resource.video_url && (
        <div className="mt-8 aspect-video">
          <iframe src={resource.video_url} className="w-full h-full rounded-lg" allowFullScreen />
        </div>
      )}

      {resource.content && (
        <article className="mt-8 prose dark:prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-base leading-relaxed">{resource.content}</pre>
        </article>
      )}

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Related Resources</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {related.map(r => <ResourceCard key={r.slug} resource={r} />)}
          </div>
        </section>
      )}
    </main>
  )
}
