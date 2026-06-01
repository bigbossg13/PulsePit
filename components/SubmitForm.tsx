'use client'
import { useState, useEffect, useCallback } from 'react'

// ── Constants ──────────────────────────────────────────────────────────────────

const REPO_OWNER = 'bigbossg13'
const REPO_NAME  = 'PulsePit'

const SUBCATEGORIES = ['design','mechanical','electrical','software','business','media','scouting','miscellaneous'] as const

const MINICATEGORIES: Record<string, string[]> = {
  design:        ['CAD', 'Prototyping', 'Ergonomics', 'Aesthetics'],
  mechanical:    ['Drivetrain', 'Intake', 'Shooter', 'Climber', 'Arm', 'Elevator', 'Bumpers'],
  electrical:    ['Wiring', 'Power', 'Sensors', 'Motors', 'Pneumatics'],
  software:      ['Autonomous', 'Teleop', 'Vision', 'Controls', 'Simulation'],
  business:      ['Impact', 'Outreach', 'Fundraising', 'Sustainability'],
  media:         ['Photography', 'Video', 'Social Media', 'Branding'],
  scouting:      ['Match Scouting', 'Pit Scouting', 'Data Analysis', 'Strategy', 'Alliance Selection'],
  miscellaneous: ['Superpit', 'How to Start a Team', 'Safety'],
}
const COMPETITIONS  = ['frc','ftc','both'] as const
const TYPES         = ['guide','code','video','doc','whitepaper','chief-delphi','link'] as const
const LANGUAGES     = ['java','python','c++','kotlin','blocks'] as const
const TYPE_TO_DIR: Record<string, string> = {
  guide: 'guides', code: 'code', video: 'videos', doc: 'docs',
  whitepaper: 'whitepapers', 'chief-delphi': 'chief-delphi', link: 'links',
}
// Types that are purely external links — no MDX body, just a URL
const LINK_TYPES = new Set(['video','whitepaper','chief-delphi','link'])

// ── Helpers ────────────────────────────────────────────────────────────────────

function today() {
  return new Date().toISOString().split('T')[0]
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function buildFrontmatter(f: FormState): string {
  const lines = [
    '---',
    `title: "${f.title.replace(/"/g, '\\"')}"`,
    `slug: ${f.slug}`,
    `competition: ${f.competition}`,
    `subcategory: ${f.subcategory}`,
    `description: "${f.description.replace(/"/g, '\\"')}"`,
    `date_added: "${today()}"`,
    `date_updated: "${today()}"`,
    `featured: ${f.featured}`,
    `tags: [${f.tags.split(',').map(t => `"${t.trim()}"`).filter(Boolean).join(', ')}]`,
  ]
  if (f.minicategory) lines.push(`minicategory: "${f.minicategory}"`)
  if (f.language)    lines.push(`language: ${f.language}`)
  if (f.source_url)  lines.push(`source_url: "${f.source_url}"`)
  if (f.video_url)   lines.push(`video_url: "${f.video_url}"`)
  lines.push('---')
  return lines.join('\n')
}

function buildContent(f: FormState): string {
  const fm = buildFrontmatter(f)
  const body = f.body.trim()
  return body ? `${fm}\n\n${body}\n` : `${fm}\n`
}

// ── Types ──────────────────────────────────────────────────────────────────────

interface FormState {
  title:        string
  slug:         string
  type:         typeof TYPES[number]
  competition:  typeof COMPETITIONS[number]
  subcategory:  typeof SUBCATEGORIES[number]
  minicategory: string
  description:  string
  tags:         string
  featured:     boolean
  language:     string
  source_url:   string
  video_url:    string
  body:         string
}

const EMPTY: FormState = {
  title: '', slug: '', type: 'guide', competition: 'both',
  subcategory: 'miscellaneous', minicategory: '',
  description: '', tags: '', featured: false,
  language: '', source_url: '', video_url: '', body: '',
}

// ── Token panel ────────────────────────────────────────────────────────────────

function TokenPanel({ token, onSave, onClear }: {
  token: string
  onSave: (t: string) => void
  onClear: () => void
}) {
  const [draft, setDraft] = useState('')
  const [show, setShow]   = useState(false)

  if (token) return (
    <div className="flex items-center justify-between rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 px-4 py-3 text-sm">
      <span className="text-green-700 dark:text-green-300 font-medium">GitHub token saved ✓</span>
      <button onClick={onClear} className="text-xs text-gray-400 hover:text-red-500 transition-colors">Remove</button>
    </div>
  )

  return (
    <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 space-y-3">
      <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">GitHub Personal Access Token required</p>
      <p className="text-xs text-amber-700 dark:text-amber-400">
        Create a token at{' '}
        <a href="https://github.com/settings/tokens/new?scopes=contents&description=PulsePit+Submit"
          target="_blank" rel="noopener noreferrer"
          className="underline hover:text-amber-900 dark:hover:text-amber-200">
          github.com/settings/tokens
        </a>
        {' '}with the <code className="rounded bg-amber-100 dark:bg-amber-900 px-1">contents</code> scope.
        It is stored only in your browser&rsquo;s localStorage and never sent anywhere except GitHub&rsquo;s API.
      </p>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="ghp_…"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm pr-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="button" onClick={() => setShow(s => !s)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            {show ? 'hide' : 'show'}
          </button>
        </div>
        <button
          onClick={() => draft.trim() && onSave(draft.trim())}
          className="rounded-lg bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm font-medium transition-colors">
          Save
        </button>
      </div>
    </div>
  )
}

// ── Field components ───────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{children}</label>
}

function Input({ value, onChange, placeholder, required, type = 'text' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; type?: string
}) {
  return (
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
  )
}

function Select<T extends string>({ value, onChange, options }: {
  value: T; onChange: (v: T) => void; options: readonly T[]
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value as T)}
      className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition capitalize">
      {options.map(o => <option key={o} value={o} className="capitalize">{o}</option>)}
    </select>
  )
}

// ── Main form ─────────────────────────────────────────────────────────────────

type Status = { kind: 'idle' } | { kind: 'loading' } | { kind: 'success'; url: string } | { kind: 'error'; msg: string }

export default function SubmitForm() {
  const [token,  setToken]  = useState('')
  const [form,   setForm]   = useState<FormState>(EMPTY)
  const [status, setStatus] = useState<Status>({ kind: 'idle' })

  // Load token from localStorage on mount
  useEffect(() => {
    try { setToken(localStorage.getItem('pulsepit_gh_token') ?? '') } catch {}
  }, [])

  const saveToken = (t: string) => {
    try { localStorage.setItem('pulsepit_gh_token', t) } catch {}
    setToken(t)
  }
  const clearToken = () => {
    try { localStorage.removeItem('pulsepit_gh_token') } catch {}
    setToken('')
  }

  const set = useCallback(<K extends keyof FormState>(key: K, val: FormState[K]) => {
    setForm(prev => {
      const next = { ...prev, [key]: val }
      // Auto-generate slug from title if slug hasn't been manually edited
      if (key === 'title' && slugify(prev.title) === prev.slug) {
        next.slug = slugify(val as string)
      }
      return next
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) { setStatus({ kind: 'error', msg: 'Please add your GitHub token first.' }); return }
    if (!form.slug) { setStatus({ kind: 'error', msg: 'Slug is required.' }); return }

    setStatus({ kind: 'loading' })

    const dir      = TYPE_TO_DIR[form.type]
    const path     = `content/${dir}/${form.slug}.mdx`
    const content  = buildContent(form)
    const encoded  = btoa(unescape(encodeURIComponent(content)))
    const apiUrl   = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`

    // Check if file already exists (to get SHA for update)
    let sha: string | undefined
    try {
      const check = await fetch(apiUrl, {
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github+json' },
      })
      if (check.ok) {
        const data = await check.json() as { sha?: string }
        sha = data.sha
      }
    } catch {}

    const body: Record<string, unknown> = {
      message: `Add resource: ${form.title}`,
      content: encoded,
      branch:  'main',
    }
    if (sha) body.sha = sha

    const res = await fetch(apiUrl, {
      method:  'PUT',
      headers: {
        Authorization:  `token ${token}`,
        Accept:         'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      const data = await res.json() as { content?: { html_url?: string } }
      setStatus({ kind: 'success', url: data.content?.html_url ?? `https://github.com/${REPO_OWNER}/${REPO_NAME}` })
      setForm(EMPTY)
    } else {
      const err = await res.json() as { message?: string }
      setStatus({ kind: 'error', msg: err.message ?? `GitHub API error ${res.status}` })
    }
  }

  const isLinkType     = LINK_TYPES.has(form.type)
  const needsLanguage  = form.type === 'code'
  const needsVideo     = form.type === 'video'
  const needsSourceUrl = form.type === 'code' || form.type === 'doc' || form.type === 'whitepaper' || form.type === 'chief-delphi' || form.type === 'link'
  const needsBody      = !isLinkType

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Token */}
      <TokenPanel token={token} onSave={saveToken} onClear={clearToken} />

      {/* Success banner */}
      {status.kind === 'success' && (
        <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 px-4 py-4 text-sm text-green-800 dark:text-green-300 space-y-1">
          <p className="font-semibold">Resource added! 🎉</p>
          <p>
            GitHub Actions will rebuild and deploy the site in ~1–2 minutes.{' '}
            <a href={status.url} target="_blank" rel="noopener noreferrer" className="underline">View file on GitHub →</a>
          </p>
          <button onClick={() => setStatus({ kind: 'idle' })} className="text-xs text-green-600 dark:text-green-400 hover:underline mt-1">
            Add another resource
          </button>
        </div>
      )}

      {/* Error banner */}
      {status.kind === 'error' && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          <span className="font-medium">Error: </span>{status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core metadata */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Resource details</legend>

          <div>
            <Label>Title *</Label>
            <Input value={form.title} onChange={v => set('title', v)} placeholder="e.g. PID Tuning for FRC Drivetrains" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Slug *</Label>
              <Input value={form.slug} onChange={v => set('slug', slugify(v))} placeholder="auto-generated from title" required />
              <p className="mt-1 text-xs text-gray-400">URL-safe, lowercase, hyphens only</p>
            </div>
            <div>
              <Label>Type *</Label>
              <Select value={form.type} onChange={v => set('type', v)} options={TYPES} />
            </div>
          </div>

          <div>
            <Label>Description *</Label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} required rows={2}
              placeholder="One or two sentences shown on the resource card."
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none" />
          </div>
        </fieldset>

        {/* Classification */}
        <fieldset className="space-y-4">
          <legend className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Classification</legend>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Competition</Label>
              <Select value={form.competition} onChange={v => set('competition', v)} options={COMPETITIONS} />
            </div>
            <div>
              <Label>Subcategory</Label>
              <Select value={form.subcategory} onChange={v => { set('subcategory', v); set('minicategory', '') }} options={SUBCATEGORIES} />
            </div>
          </div>

          <div>
            <Label>Mini-category <span className="font-normal text-gray-400">(optional)</span></Label>
            <select value={form.minicategory} onChange={e => set('minicategory', e.target.value)}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
              <option value="">— none —</option>
              {(MINICATEGORIES[form.subcategory] ?? []).map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Tags <span className="font-normal text-gray-400">(comma-separated)</span></Label>
              <Input value={form.tags} onChange={v => set('tags', v)} placeholder="swerve, drivetrain, pid" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-600" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Featured on homepage</span>
              </label>
            </div>
          </div>
        </fieldset>

        {/* Type-specific fields */}
        {(needsLanguage || needsVideo || needsSourceUrl) && (
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {form.type.charAt(0).toUpperCase() + form.type.slice(1)} options
            </legend>
            <div className="grid grid-cols-2 gap-4">
              {needsLanguage && (
                <div>
                  <Label>Language</Label>
                  <select value={form.language} onChange={e => set('language', e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition">
                    <option value="">— select —</option>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              )}
              {needsVideo && (
                <div className={needsLanguage ? '' : 'col-span-2'}>
                  <Label>YouTube URL</Label>
                  <Input value={form.video_url} onChange={v => set('video_url', v)} placeholder="https://youtube.com/watch?v=…" type="url" />
                </div>
              )}
              {needsSourceUrl && (
                <div className={needsLanguage ? '' : 'col-span-2'}>
                  <Label>{form.type === 'whitepaper' ? 'Whitepaper URL' : form.type === 'chief-delphi' ? 'Chief Delphi Post URL' : form.type === 'link' ? 'Link URL' : 'Source URL'}</Label>
                  <Input value={form.source_url} onChange={v => set('source_url', v)}
                    placeholder={form.type === 'chief-delphi' ? 'https://chiefdelphi.com/t/…' : form.type === 'whitepaper' ? 'https://…/whitepaper.pdf' : form.type === 'link' ? 'https://…' : 'https://github.com/…'}
                    type="url" />
                </div>
              )}
            </div>
          </fieldset>
        )}

        {/* Body */}
        {needsBody && (
          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Content (MDX)</legend>
            <textarea value={form.body} onChange={e => set('body', e.target.value)} rows={10}
              placeholder={`## Introduction\n\nWrite your content here using Markdown.\n\n\`\`\`java\n// code blocks supported\n\`\`\``}
              className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 font-mono placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y" />
            <p className="text-xs text-gray-400">Supports full Markdown and fenced code blocks.</p>
          </fieldset>
        )}

        {/* Preview */}
        {form.slug && (
          <details className="group">
            <summary className="cursor-pointer text-xs text-blue-600 dark:text-blue-400 hover:underline list-none">
              Preview generated MDX ↓
            </summary>
            <pre className="mt-2 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 text-xs overflow-x-auto text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-all">
              {buildContent(form)}
            </pre>
          </details>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <button type="submit" disabled={status.kind === 'loading' || !token}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 text-sm font-medium transition-colors">
            {status.kind === 'loading' ? 'Publishing…' : 'Publish to GitHub'}
          </button>
          {!token && (
            <p className="text-xs text-gray-400">Add your GitHub token above to publish.</p>
          )}
        </div>
      </form>
    </div>
  )
}
