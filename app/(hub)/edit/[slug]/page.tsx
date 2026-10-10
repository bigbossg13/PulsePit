import { notFound }   from 'next/navigation'
import type { Metadata } from 'next'
import { getAllResources, getResourceBySlug } from '@/lib/resources'
import SubmitForm from '@/components/SubmitForm'
import type { SubmitFormInitialValues } from '@/components/SubmitForm'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllResources().map(r => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const r = getResourceBySlug(params.slug)
  if (!r) return {}
  return { title: `Edit: ${r.title} — PulsePit` }
}

export default function EditPage({ params }: { params: { slug: string } }) {
  const resource = getResourceBySlug(params.slug)
  if (!resource) notFound()

  const initial: SubmitFormInitialValues = {
    slug:         resource.slug,
    title:        resource.title,
    type:         resource.type,
    competition:  resource.competition,
    subcategory:  resource.subcategory,
    minicategory: resource.minicategory ?? '',
    description:  resource.description,
    tags:         resource.tags.join(', '),
    featured:     resource.featured,
    language:     resource.language ?? '',
    source_url:   resource.source_url ?? '',
    video_url:    resource.video_url ?? '',
    links:        resource.links ?? [],
    body:         resource.content ?? '',
  }

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Edit resource</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl">
          Update the fields below and hit <strong>Save changes to GitHub</strong>. The site will rebuild automatically (~1–2 min).
        </p>
      </div>
      <SubmitForm initialValues={initial} />
    </main>
  )
}
