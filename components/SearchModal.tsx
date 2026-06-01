'use client'
import {
  useState, useEffect, useRef, useCallback, useMemo,
  type KeyboardEvent,
} from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { buildIndex, highlight, type SearchRecord, type SearchResult } from '@/lib/search'

// ── Icons ──────────────────────────────────────────────────────────────────────

const TYPE_ICON: Record<string, string> = {
  guide: '📖', code: '💻', video: '▶️', doc: '📄',
}

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)

// ── Highlighted text ───────────────────────────────────────────────────────────

function HighlightedText({
  text,
  indices,
}: {
  text: string
  indices: ReadonlyArray<[number, number]> | undefined
}) {
  const parts = highlight(text, indices)
  return (
    <>
      {parts.map((p, i) =>
        p.highlight
          ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 text-inherit rounded-sm">{p.text}</mark>
          : <span key={i}>{p.text}</span>
      )}
    </>
  )
}

// ── Result row ─────────────────────────────────────────────────────────────────

function ResultRow({
  result,
  active,
  onClick,
}: {
  result: SearchResult
  active: boolean
  onClick: () => void
}) {
  const { item, matches } = result

  type Match = NonNullable<typeof matches>[number]
  const titleIndices   = matches?.find((m: Match) => m.key === 'title')?.indices
  const descIndices    = matches?.find((m: Match) => m.key === 'description')?.indices
  const tagMatch       = matches?.find((m: Match) => m.key === 'tags')
  const topicMatch     = matches?.find((m: Match) => m.key === 'topics')

  return (
    <Link
      href={`/resources/${item.slug}`}
      onClick={onClick}
      className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
        active
          ? 'bg-blue-50 dark:bg-blue-950/50'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
      }`}
      aria-selected={active}
    >
      {/* Icon */}
      <span className="text-lg mt-0.5 shrink-0" aria-hidden="true">
        {TYPE_ICON[item.type] ?? '📄'}
      </span>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          <HighlightedText text={item.title} indices={titleIndices} />
        </p>
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
          <HighlightedText text={item.description} indices={descIndices} />
        </p>
        {(tagMatch || topicMatch) && (
          <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
            {tagMatch   && <span>#{tagMatch.value}  </span>}
            {topicMatch && <span>{topicMatch.value}</span>}
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="shrink-0 flex flex-col items-end gap-1">
        <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:text-gray-400 capitalize">
          {item.type}
        </span>
        <span className="rounded-full bg-red-50 dark:bg-red-950 px-2 py-0.5 text-[10px] font-medium text-red-600 dark:text-red-400 uppercase">
          {item.competition}
        </span>
      </div>
    </Link>
  )
}

// ── Modal ──────────────────────────────────────────────────────────────────────

interface SearchModalProps {
  records: SearchRecord[]
}

export default function SearchModal({ records }: SearchModalProps) {
  const [open,    setOpen]    = useState(false)
  const [query,   setQuery]   = useState('')
  const [cursor,  setCursor]  = useState(0)
  const inputRef              = useRef<HTMLInputElement>(null)
  const router                = useRouter()

  // Build the Fuse index once per records array reference
  const index = useMemo(() => buildIndex(records), [records])

  const results: SearchResult[] = useMemo(
    () => query.trim().length >= 2 ? index.search(query.trim()) : [],
    [index, query],
  )

  // Reset cursor when results change
  useEffect(() => { setCursor(0) }, [results.length])

  // Global Cmd+K / Ctrl+K + custom event from SearchTrigger button
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    const onEvent = () => setOpen(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('pulsepit:search:open', onEvent)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pulsepit:search:open', onEvent)
    }
  }, [])

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor(c => Math.min(c + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor(c => Math.max(c - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const selected = results[cursor]
      if (selected) {
        close()
        router.push(`/resources/${selected.item.slug}/`)
      } else if (query.trim()) {
        close()
        router.push(`/search/?q=${encodeURIComponent(query.trim())}`)
      }
    } else if (e.key === 'Escape') {
      close()
    }
  }

  if (!open) return null

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4"
      onClick={close}
      aria-modal="true"
      role="dialog"
      aria-label="Search"
    >
      {/* Blur overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[70vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search input row */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <SearchIcon />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search resources…"
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5"
              aria-label="Clear"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
          <kbd className="hidden sm:flex items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] text-gray-500 font-mono">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1" role="listbox">
          {query.trim().length < 2 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
              Type at least 2 characters to search
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">
              No results for <span className="font-medium text-gray-600 dark:text-gray-300">&ldquo;{query}&rdquo;</span>
            </div>
          ) : (
            <div className="p-2 space-y-0.5">
              {results.slice(0, 8).map((result, i) => (
                <ResultRow
                  key={result.item.slug}
                  result={result}
                  active={i === cursor}
                  onClick={close}
                />
              ))}
            </div>
          )}

          {/* Footer: view all results */}
          {results.length > 0 && query.trim() && (
            <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2.5">
              <Link
                href={`/search?q=${encodeURIComponent(query.trim())}`}
                onClick={close}
                className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <span>View all {results.length} results for &ldquo;{query}&rdquo;</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          )}
        </div>

        {/* Keyboard hints */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 flex items-center gap-4 text-[10px] text-gray-400 dark:text-gray-600">
          <span className="flex items-center gap-1"><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span className="flex items-center gap-1"><kbd className="font-mono">↵</kbd> open</span>
          <span className="flex items-center gap-1"><kbd className="font-mono">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}
