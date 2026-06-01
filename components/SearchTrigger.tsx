'use client'

export default function SearchTrigger() {
  const open = () => window.dispatchEvent(new CustomEvent('pulsepit:search:open'))

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
