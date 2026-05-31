import { redirect } from 'next/navigation'
import { getAllResources } from '@/lib/resources'

export async function generateStaticParams() {
  return getAllResources().filter(r => r.type === 'doc').map(r => ({ slug: r.slug }))
}

export default function DocsSlugPage({ params }: { params: { slug: string } }) {
  redirect(`/resources/${params.slug}`)
}
