import type { Metadata } from 'next'
import { Suspense } from 'react'
import SubmitForm from '@/components/SubmitForm'

export const metadata: Metadata = {
  title: 'Add a Resource — PulsePit',
  description: 'Submit a new guide, code example, video, or doc directly to the PulsePit library.',
}

export default function SubmitPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Add a resource</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl">
          Fill out the form below and hit <strong>Publish to GitHub</strong>. The file will be committed
          directly to the repo and the site will rebuild automatically via GitHub Actions (~1–2 min).
        </p>
      </div>
      <Suspense>
        <SubmitForm />
      </Suspense>
    </main>
  )
}
