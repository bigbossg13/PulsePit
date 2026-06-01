'use client'
import { useEffect, useState } from 'react'

interface Heading { id: string; text: string; level: number }

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [active, setActive]     = useState('')

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('article h2, article h3'))
    setHeadings(els.map(el => ({
      id:    el.id,
      text:  el.textContent ?? '',
      level: parseInt(el.tagName[1]),
    })))

    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.find(e => e.isIntersecting)
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-10% 0% -80% 0%' },
    )
    els.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  if (!headings.length) return null

  return (
    <nav aria-label="On this page" className="sticky top-24 text-sm max-h-[calc(100vh-7rem)] overflow-y-auto">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        On this page
      </p>
      <ul className="space-y-1 border-l border-gray-200 dark:border-gray-800">
        {headings.map(h => (
          <li key={h.id} style={{ paddingLeft: `${(h.level - 2) * 12 + 12}px` }}>
            <a
              href={`#${h.id}`}
              className={`block py-1 pr-2 transition-colors hover:text-gray-900 dark:hover:text-gray-100 leading-tight ${
                active === h.id
                  ? 'text-blue-600 dark:text-blue-400 font-medium border-l-2 border-blue-600 dark:border-blue-400 -ml-px pl-[calc(var(--indent)+1px)]'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
              style={{ '--indent': `${(h.level - 2) * 12 + 12}px` } as React.CSSProperties}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
