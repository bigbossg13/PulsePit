import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export type ResourceType = 'guide' | 'code' | 'video' | 'doc'
export type Competition = 'frc' | 'ftc' | 'both'
export type Difficulty = 'beginner' | 'intermediate' | 'advanced'
export type Topic = 'programming' | 'mechanical' | 'electrical' | 'strategy' | 'scouting' | 'business'
export type Language = 'java' | 'python' | 'c++' | 'kotlin' | 'blocks'

export interface Resource {
  title: string
  slug: string
  type: ResourceType
  competition: Competition
  difficulty: Difficulty
  topics: Topic[]
  language?: Language
  description: string
  source_url?: string
  video_url?: string
  date_added: string
  date_updated: string
  featured: boolean
  tags: string[]
  content?: string
}

const contentDir = path.join(process.cwd(), 'content')

export function getAllResources(): Resource[] {
  const types: ResourceType[] = ['guide', 'code', 'video', 'doc']
  const resources: Resource[] = []

  for (const type of types) {
    const dir = path.join(contentDir, type === 'guide' ? 'guides' : type === 'doc' ? 'docs' : type === 'video' ? 'videos' : 'code')
    if (!fs.existsSync(dir)) continue
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data, content } = matter(raw)
      resources.push({ ...data as Resource, content })
    }
  }

  return resources.sort((a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime())
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return getAllResources().find(r => r.slug === slug)
}

export function getFeaturedResources(): Resource[] {
  return getAllResources().filter(r => r.featured)
}

export function getRecentResources(count = 6): Resource[] {
  return getAllResources().slice(0, count)
}

export function getRelatedResources(resource: Resource, count = 5): Resource[] {
  const all = getAllResources().filter(r => r.slug !== resource.slug)
  const scored = all.map(r => ({
    resource: r,
    score: r.tags.filter(t => resource.tags.includes(t)).length +
           r.topics.filter(t => resource.topics.includes(t)).length +
           (r.competition === resource.competition ? 1 : 0)
  }))
  return scored.sort((a, b) => b.score - a.score).slice(0, count).map(s => s.resource)
}
