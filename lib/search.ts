import Fuse, { type IFuseOptions, type FuseResult } from 'fuse.js'
import type { Resource } from './resources'

// Subset of Resource that is safe to serialise to the client.
// Omit `content` — it can be large and isn't needed for search results.
export type SearchRecord = Pick<
  Resource,
  'slug' | 'title' | 'description' | 'type' | 'competition' | 'difficulty' | 'topics' | 'tags' | 'language'
>

export type SearchResult = FuseResult<SearchRecord>

const FUSE_OPTIONS: IFuseOptions<SearchRecord> = {
  keys: [
    { name: 'title',       weight: 3 },
    { name: 'description', weight: 2 },
    { name: 'tags',        weight: 1.5 },
    { name: 'topics',      weight: 1 },
  ],
  threshold:       0.35,   // 0 = exact, 1 = match anything
  distance:        200,    // characters to scan for threshold match
  minMatchCharLength: 2,
  includeMatches:  true,
  includeScore:    true,
}

/** Strip content and return only the fields the search index needs. */
export function toSearchRecord(r: Resource): SearchRecord {
  return {
    slug:        r.slug,
    title:       r.title,
    description: r.description,
    type:        r.type,
    competition: r.competition,
    difficulty:  r.difficulty,
    topics:      r.topics,
    tags:        r.tags,
    language:    r.language,
  }
}

/** Build a Fuse instance from a pre-serialised record array (client-safe). */
export function buildIndex(records: SearchRecord[]): Fuse<SearchRecord> {
  return new Fuse(records, FUSE_OPTIONS)
}

/** Run a query and return scored, matched results. */
export function search(records: SearchRecord[], query: string): SearchResult[] {
  if (!query.trim()) return []
  return buildIndex(records).search(query.trim())
}

/**
 * Highlight matching substrings in `text`.
 * Returns an array of { text, highlight } segments.
 */
export function highlight(
  text: string,
  indices: ReadonlyArray<[number, number]> | undefined,
): { text: string; highlight: boolean }[] {
  if (!indices?.length) return [{ text, highlight: false }]

  const segments: { text: string; highlight: boolean }[] = []
  let cursor = 0

  for (const [start, end] of indices) {
    if (start > cursor) segments.push({ text: text.slice(cursor, start), highlight: false })
    segments.push({ text: text.slice(start, end + 1), highlight: true })
    cursor = end + 1
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlight: false })

  return segments
}
