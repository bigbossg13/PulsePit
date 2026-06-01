import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// ── Types ──────────────────────────────────────────────────────────────────────

export type ResourceType  = 'guide' | 'code' | 'video' | 'doc' | 'whitepaper' | 'chief-delphi' | 'link'
export type Competition   = 'frc' | 'ftc' | 'both'
export type Difficulty    = 'beginner' | 'intermediate' | 'advanced'
export type Subcategory   = 'design' | 'mechanical' | 'electrical' | 'software' | 'business' | 'media' | 'scouting' | 'miscellaneous'
export type Language      = 'java' | 'python' | 'c++' | 'kotlin' | 'blocks'

// Keep Topic as an alias for Subcategory so existing content using `topics:`
// in frontmatter continues to work without migration.
export type Topic = Subcategory

export const SUBCATEGORIES: Subcategory[] = [
  'design',
  'mechanical',
  'electrical',
  'software',
  'business',
  'media',
  'scouting',
  'miscellaneous',
]

export const MINICATEGORIES: Record<Subcategory, string[]> = {
  design:        ['CAD', 'Prototyping', 'Ergonomics', 'Aesthetics'],
  mechanical:    ['Drivetrain', 'Intake', 'Shooter', 'Climber', 'Arm', 'Elevator'],
  electrical:    ['Wiring', 'Power', 'Sensors', 'Motors', 'Pneumatics'],
  software:      ['Autonomous', 'Teleop', 'Vision', 'Controls', 'Simulation'],
  business:      ['Impact', 'Outreach', 'Fundraising', 'Sustainability'],
  media:         ['Photography', 'Video', 'Social Media', 'Branding'],
  scouting:      ['Match Scouting', 'Pit Scouting', 'Data Analysis', 'Strategy', 'Alliance Selection'],
  miscellaneous: ['Superpit', 'How to Start a Team', 'Safety'],
}

export interface Resource {
  // Required frontmatter
  title:        string
  slug:         string
  type:         ResourceType
  competition:  Competition
  difficulty?:  Difficulty
  subcategory:  Subcategory    // primary subcategory (single value)
  topics:       Subcategory[]  // additional subcategories (multi-select)
  description:  string
  date_added:   string
  date_updated: string
  featured:     boolean
  tags:         string[]
  // Optional frontmatter
  minicategory?: string
  language?:    Language
  source_url?:  string
  video_url?:   string
  // Populated at load time — raw MDX body after the frontmatter block
  content?:     string
}

// ── Directory mapping ──────────────────────────────────────────────────────────

const TYPE_TO_DIR: Record<ResourceType, string> = {
  guide:         'guides',
  code:          'code',
  video:         'videos',
  doc:           'docs',
  whitepaper:    'whitepapers',
  'chief-delphi':'chief-delphi',
  link:          'links',
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

// ── Loader ────────────────────────────────────────────────────────────────────

/**
 * Reads every .mdx / .md file under /content and returns validated Resource
 * objects sorted newest-first by date_added.
 *
 * Skips files that are missing required frontmatter fields so a single bad
 * file never breaks the whole site.
 */
function loadAllResources(): Resource[] {
  const resources: Resource[] = []

  for (const [type, dir] of Object.entries(TYPE_TO_DIR) as [ResourceType, string][]) {
    const dirPath = path.join(CONTENT_DIR, dir)
    if (!fs.existsSync(dirPath)) continue

    const files = fs.readdirSync(dirPath).filter(f => /\.mdx?$/.test(f))

    for (const file of files) {
      const raw = fs.readFileSync(path.join(dirPath, file), 'utf8')
      const { data, content } = matter(raw)

      if (!data.title || !data.slug) {
        console.warn(`[resources] Skipping ${file}: missing required frontmatter (title, slug)`)
        continue
      }

      const d = data as Record<string, unknown>
      // `subcategory` is the primary category; `topics` is the legacy/multi field.
      // If only `topics` is set, use the first entry as subcategory.
      const topicsRaw = (d.topics ?? []) as Subcategory[]
      const subcategory = (d.subcategory ?? topicsRaw[0] ?? 'miscellaneous') as Subcategory
      resources.push({
        title:        d.title as string,
        slug:         d.slug as string,
        type,
        competition:  (d.competition ?? 'both') as Competition,
        difficulty:   d.difficulty as Difficulty | undefined,
        subcategory,
        topics:       topicsRaw,
        description:  (d.description ?? '') as string,
        date_added:   (d.date_added ?? '') as string,
        date_updated: (d.date_updated ?? '') as string,
        featured:     Boolean(d.featured),
        tags:         (d.tags ?? []) as string[],
        minicategory: d.minicategory as string | undefined,
        language:     d.language as Language | undefined,
        source_url:   d.source_url as string | undefined,
        video_url:    d.video_url as string | undefined,
        content,
      })
    }
  }

  return resources.sort(
    (a, b) => new Date(b.date_added).getTime() - new Date(a.date_added).getTime()
  )
}

// Cache so repeated calls within the same process don't re-read disk.
// In Next.js dev mode the module is reloaded on each request, giving fresh
// data without stale cache issues.
let _cache: Resource[] | null = null

export function getAllResources(): Resource[] {
  if (!_cache) _cache = loadAllResources()
  return _cache
}

// ── Convenience helpers ────────────────────────────────────────────────────────

export function getResourceBySlug(slug: string): Resource | undefined {
  return getAllResources().find(r => r.slug === slug)
}

export function getResourcesByType(type: ResourceType): Resource[] {
  return getAllResources().filter(r => r.type === type)
}

export function getFeaturedResources(): Resource[] {
  return getAllResources().filter(r => r.featured)
}

export function getRecentResources(count = 6): Resource[] {
  return getAllResources().slice(0, count)
}

/**
 * Returns up to `count` resources that share the most tags, topics, or
 * competition with the given resource, ranked by overlap score.
 */
export function getRelatedResources(resource: Resource, count = 5): Resource[] {
  return getAllResources()
    .filter(r => r.slug !== resource.slug)
    .map(r => ({
      resource: r,
      score:
        r.tags.filter(t => resource.tags.includes(t)).length +
        r.topics.filter(t => resource.topics.includes(t)).length +
        (r.competition === resource.competition ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map(s => s.resource)
}


// ── MDX content helpers ────────────────────────────────────────────────────────

/**
 * Extracts { lang, code } from a code-type resource whose MDX body is a
 * single fenced code block: ```java\n…\n```
 */
export function extractCodeBlock(content: string): { lang: string; code: string } {
  const match = content.trim().match(/^```(\w+)?\n([\s\S]*?)```\s*$/)
  if (!match) return { lang: 'text', code: content.trim() }
  return { lang: match[1] ?? 'text', code: match[2] }
}

/**
 * Converts a YouTube watch URL to its embed URL.
 * Passes embed URLs and other values through unchanged.
 */
export function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.searchParams.has('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed${u.pathname}`
    }
  } catch {
    // not a valid URL — return as-is
  }
  return url
}
