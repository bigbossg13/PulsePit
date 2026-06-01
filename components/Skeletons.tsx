/** Shared skeleton primitives and composed skeletons for loading states. */

function Bone({ className }: { className: string }) {
  return <div className={`skeleton rounded ${className}`} aria-hidden="true" />
}

// ── ResourceCard skeleton ──────────────────────────────────────────────────────
// Mirrors the exact layout of ResourceCard so there's no layout shift on load.

export function ResourceCardSkeleton() {
  return (
    <div
      className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5"
      aria-hidden="true"
    >
      {/* Badge row + icon */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1.5">
          <Bone className="h-5 w-14" />
          <Bone className="h-5 w-10" />
          <Bone className="h-5 w-20" />
        </div>
        <Bone className="h-6 w-6 rounded-md" />
      </div>

      {/* Title */}
      <Bone className="h-4 w-full mb-1.5" />
      <Bone className="h-4 w-3/4 mb-3" />

      {/* Description */}
      <Bone className="h-3 w-full mb-1" />
      <Bone className="h-3 w-5/6 mb-auto" />

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <div className="flex gap-1">
          <Bone className="h-4 w-12" />
          <Bone className="h-4 w-14" />
          <Bone className="h-4 w-10" />
        </div>
        <Bone className="h-3 w-14" />
      </div>
    </div>
  )
}

// ── Grid skeleton ──────────────────────────────────────────────────────────────

export function ResourceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
      role="status"
      aria-label="Loading resources…"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ResourceCardSkeleton key={i} />
      ))}
    </div>
  )
}

// ── Search bar skeleton ────────────────────────────────────────────────────────

export function SearchBarSkeleton() {
  return (
    <div
      className="w-full h-10 rounded-lg border border-gray-200 dark:border-gray-800 skeleton"
      role="status"
      aria-label="Loading search…"
    />
  )
}

// ── Filter sidebar skeleton ────────────────────────────────────────────────────

export function FilterSidebarSkeleton() {
  const groups = [3, 4, 3, 6, 5]
  return (
    <aside className="hidden md:block w-52 shrink-0 space-y-6" aria-hidden="true">
      {groups.map((count, gi) => (
        <div key={gi}>
          <Bone className="h-3 w-20 mb-2" />
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: count }).map((_, ci) => (
              <Bone key={ci} className={`h-6 ${['w-8','w-12','w-10','w-14','w-9','w-16'][ci % 6]}`} />
            ))}
          </div>
        </div>
      ))}
    </aside>
  )
}

// ── Active filters skeleton ────────────────────────────────────────────────────

export function ActiveFiltersSkeleton() {
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      <Bone className="h-5 w-12" />
      <Bone className="h-5 w-20 rounded-full" />
      <Bone className="h-5 w-24 rounded-full" />
    </div>
  )
}

// ── Resources page full skeleton ───────────────────────────────────────────────

export function ResourcesPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6">
        <Bone className="h-7 w-32 mb-2" />
        <Bone className="h-4 w-48" />
      </div>

      {/* Search */}
      <div className="mb-4">
        <SearchBarSkeleton />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <FilterSidebarSkeleton />

        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <Bone className="h-4 w-28" />
            <Bone className="h-4 w-36" />
          </div>
          <ResourceGridSkeleton count={6} />
        </div>
      </div>
    </div>
  )
}
