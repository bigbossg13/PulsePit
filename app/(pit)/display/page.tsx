import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import SetupClient from '@/components/pit/SetupClient'
import { CheckIcon, PulseLogo } from '@/components/pit/icons'

export const metadata: Metadata = {
  title: 'Set up your pit display',
}

const FEATURES = [
  'Live data from FTCScout and the official FTC Events API',
  'Queue reminders that follow a field running late',
  'Your layout, team color, logo and checklist, saved per team',
  'High contrast, large text, a low-vision font and reduced motion',
  'Made for a pit TV, and still works on a laptop, tablet or phone',
]

export default function SetupPage() {
  return (
    <div className="setup">
      <a className="skip-link" href="#setup">Skip to setup</a>
      <aside className="setup-brand" aria-label="About PulsePit">
        <div className="brand-row">
          <PulseLogo size={40} />
          <div>
            <h1>PulsePit</h1>
            <p>Live pit display for FTC teams</p>
          </div>
        </div>
        <p className="lead">Your next match, when to queue, where you stand and what to expect, on any screen in your pit.</p>
        <ul className="feature-list">
          {FEATURES.map(f => (
            <li key={f}><CheckIcon size={18} />{f}</li>
          ))}
        </ul>
        <div className="suite">
          <h2>Also from Pulse</h2>
          <a href="https://bigbossg13.github.io/pulsepoint/">PulsePoint</a>
          <span>Every FTC team and event on one map.</span>
          <Link href="/">PulsePit resource hub</Link>
        </div>
        <p className="credits">
          Data from <a href="https://ftcscout.org">FTCScout</a> and the{' '}
          <a href="https://ftc-events.firstinspires.org/services/API">FTC Events API</a>. Not affiliated with <i>FIRST</i>.
        </p>
      </aside>
      <Suspense fallback={<main className="setup-main" id="setup"><p>Loading…</p></main>}>
        <SetupClient />
      </Suspense>
    </div>
  )
}
