import CopyButton from './CopyButton'
import { codeToHtml } from 'shiki'

// Slug helper: strip non-alphanumeric and collapse spaces → hyphens
function toId(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
}

function Heading({ level, children }: { level: 2 | 3 | 4; children: React.ReactNode }) {
  const text  = typeof children === 'string' ? children : ''
  const id    = toId(text)
  const Tag   = `h${level}` as const
  const sizes = { 2: 'text-2xl mt-10 mb-4', 3: 'text-xl mt-8 mb-3', 4: 'text-lg mt-6 mb-2' }
  return (
    <Tag id={id} className={`font-semibold text-gray-900 dark:text-gray-100 scroll-mt-24 group ${sizes[level]}`}>
      <a href={`#${id}`} className="no-underline hover:underline">{children}</a>
    </Tag>
  )
}

async function Code({ className, children }: { className?: string; children?: React.ReactNode }) {
  const lang   = className?.replace('language-', '') ?? 'text'
  const source = String(children ?? '').trimEnd()

  let html: string
  try {
    html = await codeToHtml(source, {
      lang,
      theme: 'github-dark',
    })
  } catch {
    html = await codeToHtml(source, { lang: 'text', theme: 'github-dark' })
  }

  return (
    <div className="relative my-6 group">
      {lang !== 'text' && (
        <span className="absolute left-4 top-3 text-xs text-gray-500 font-mono select-none">{lang}</span>
      )}
      <CopyButton text={source} />
      {/* Shiki outputs a <pre><code>…</code></pre> */}
      <div
        className="rounded-xl overflow-auto text-sm [&>pre]:p-5 [&>pre]:pt-10 [&>pre]:overflow-x-auto [&>pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}

// Inline code (no className = not a fenced block)
function InlineCode({ children }: { children?: React.ReactNode }) {
  return (
    <code className="rounded bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 text-sm font-mono text-gray-800 dark:text-gray-200">
      {children}
    </code>
  )
}

export const mdxComponents = {
  h2: ({ children }: { children?: React.ReactNode }) => <Heading level={2}>{children}</Heading>,
  h3: ({ children }: { children?: React.ReactNode }) => <Heading level={3}>{children}</Heading>,
  h4: ({ children }: { children?: React.ReactNode }) => <Heading level={4}>{children}</Heading>,

  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="my-4 leading-7 text-gray-700 dark:text-gray-300">{children}</p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="my-4 ml-6 list-disc space-y-1 text-gray-700 dark:text-gray-300">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="my-4 ml-6 list-decimal space-y-1 text-gray-700 dark:text-gray-300">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-7">{children}</li>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-4 border-l-4 border-blue-500 pl-4 text-gray-600 dark:text-gray-400 italic">
      {children}
    </blockquote>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <a href={href} className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300">
      {children}
    </a>
  ),
  hr: () => <hr className="my-8 border-gray-200 dark:border-gray-800" />,
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100">{children}</strong>
  ),

  // Fenced blocks come through as <pre><code className="language-xxx">…</code></pre>
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  code: ({ className, children }: { className?: string; children?: React.ReactNode }) =>
    className ? <Code className={className}>{children}</Code> : <InlineCode>{children}</InlineCode>,
}
