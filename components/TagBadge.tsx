interface TagBadgeProps {
  label: string
  variant?: 'type' | 'competition' | 'difficulty' | 'topic' | 'default'
}

const variantStyles: Record<string, string> = {
  type: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  competition: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  difficulty: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  topic: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
}

export default function TagBadge({ label, variant = 'default' }: TagBadgeProps) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${variantStyles[variant]}`}>
      {label}
    </span>
  )
}
