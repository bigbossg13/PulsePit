import { codeToHtml } from 'shiki'
import CopyButton from './CopyButton'

interface CodeBlockProps {
  code: string
  lang?: string
}

export default async function CodeBlock({ code, lang = 'text' }: CodeBlockProps) {
  let html: string
  try {
    html = await codeToHtml(code.trimEnd(), { lang, theme: 'github-dark' })
  } catch {
    html = await codeToHtml(code.trimEnd(), { lang: 'text', theme: 'github-dark' })
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-800 my-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-2 border-b border-gray-800">
        <span className="text-xs text-gray-400 font-mono">{lang}</span>
        <CopyButton text={code.trimEnd()} />
      </div>
      <div
        className="overflow-x-auto text-sm [&>pre]:p-6 [&>pre]:leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
