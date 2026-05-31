import Fuse from 'fuse.js'
import type { Resource } from './resources'

export function buildSearchIndex(resources: Resource[]) {
  return new Fuse(resources, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'description', weight: 1.5 },
      { name: 'tags', weight: 1 },
      { name: 'topics', weight: 1 },
      { name: 'content', weight: 0.5 },
    ],
    threshold: 0.3,
    includeMatches: true,
    includeScore: true,
  })
}

export function searchResources(resources: Resource[], query: string) {
  if (!query.trim()) return resources.map(item => ({ item, matches: [], score: 0 }))
  const fuse = buildSearchIndex(resources)
  return fuse.search(query)
}
