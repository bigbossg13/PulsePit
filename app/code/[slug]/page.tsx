import { redirect } from 'next/navigation'
import { getAllResources } from '@/lib/resources'

export async function generateStaticParams() {
  return getAllResources().filter(r => r.type === 'code').map(r => ({ slug: r.slug }))
}

export default function CodeSlugPage({ params }: { params: { slug: string } }) {
  redirect(`/resources/${params.slug}`)
}
