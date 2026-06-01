'use client'

export default function SearchTrigger({ large = false }: { large?: boolean }) {
  const open = () => window.dispatchEvent(new CustomEvent('pulsepit:search:open'))

  if (large) {
    return (
      <button
        onClick={open}
        aria-label="Search (Cmd+K)"
        className="flex items-center gap-3 w-full max-w-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm hover:shadow-md px-4 py-3 text-sm text-gray-400 dark:text-gray-500 transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <span className="flex-1 text-left">Search by topic, language, or keyword…</span>
        <kbd className="flex items-center gap-0.5 text-[10px] font-mono opacity-60 shrink-0">
          <span>⌘</span><span>K</span>
        </kbd>
      </button>
    )
  }

  return (
    <button
      onClick={open}
      aria-label="Search (Cmd+K)"
      className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1.5 text-sm text-gray-500 dark:text-gray-400 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <span className="hidden sm:inline">Search</span>
      <kbd className="hidden md:flex items-center gap-0.5 text-[10px] font-mono opacity-60">
        <span>⌘</span><span>K</span>
      </kbd>
    </button>
  )
}
