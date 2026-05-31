import Link from 'next/link'
import type { Resource } from '@/lib/resources'
import TagBadge from './TagBadge'

interface ResourceCardProps {
  resource: Resource
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link href={`/resources/${resource.slug}`} className="group block rounded-lg border border-border bg-card p-5 hover:border-primary transition-colors">
      <div className="flex flex-wrap gap-2 mb-3">
        <TagBadge label={resource.type} variant="type" />
        <TagBadge label={resource.competition} variant="competition" />
        <TagBadge label={resource.difficulty} variant="difficulty" />
      </div>
      <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
        {resource.title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{resource.description}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {resource.tags.slice(0, 3).map(tag => (
          <TagBadge key={tag} label={tag} />
        ))}
      </div>
    </Link>
  )
}
