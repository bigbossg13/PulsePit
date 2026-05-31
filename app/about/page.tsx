export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">About PulsePit</h1>
      <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
        PulsePit is a community-driven knowledge hub for FIRST Robotics Competition (FRC) and FIRST Tech Challenge (FTC) teams.
        Our goal is to centralize the best guides, code examples, video tutorials, and reference documentation so teams can spend less time searching and more time building.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Who is this for?</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
        Student team members, mentors, coaches, and alumni across FRC and FTC. Whether you&apos;re a rookie team learning the basics or a veteran looking for advanced control theory resources, PulsePit has you covered.
      </p>

      <h2 className="mt-8 text-xl font-semibold">How to Contribute</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400 leading-relaxed">
        All content is stored as MDX files in the <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm">/content</code> directory.
        Submit a pull request with your resource following the frontmatter schema in the README.
        Resources are reviewed and merged by maintainers.
      </p>

      <h2 className="mt-8 text-xl font-semibold">Content Model</h2>
      <pre className="mt-2 rounded-lg bg-gray-100 dark:bg-gray-800 p-4 text-sm overflow-x-auto">{`---
title: "Your Resource Title"
slug: "your-resource-slug"
type: guide          # guide | code | video | doc
competition: frc     # frc | ftc | both
difficulty: beginner # beginner | intermediate | advanced
topics:
  - programming
description: "A short description of your resource."
date_added: "2025-01-01"
date_updated: "2025-01-01"
featured: false
tags:
  - wpilib
---`}</pre>
    </main>
  )
}
