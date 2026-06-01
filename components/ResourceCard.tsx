import Link from 'next/link'
import type { Resource } from '@/lib/resources'
import TagBadge from './TagBadge'

const TYPE_ICON: Record<string, string> = {
  guide: '📖',
  code:  '💻',
  video: '▶️',
  doc:   '📄',
}

export default function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-sm transition-all"
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex flex-wrap gap-1.5">
          <TagBadge label={resource.type} variant="type" />
          <TagBadge label={resource.competition.toUpperCase()} variant="competition" />
          <TagBadge label={resource.difficulty} variant="difficulty" />
        </div>
        <span className="text-lg shrink-0" aria-hidden="true">{TYPE_ICON[resource.type]}</span>
      </div>

      {/* Title + description */}
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
        {resource.title}
      </h3>
      <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
        {resource.description}
      </p>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {resource.tags.slice(0, 3).map(tag => (
            <TagBadge key={tag} label={tag} />
          ))}
        </div>
        {resource.date_updated && (
          <span className="text-xs text-gray-400 dark:text-gray-600 shrink-0">
            {new Date(resource.date_updated).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </span>
        )}
      </div>
    </Link>
  )
}
