# PulsePit

Two things live in this repo:

- **PulsePit display** (`/display/`): a live, customizable pit display for
  *FIRST* Tech Challenge teams. Part of the Pulse suite with
  [PulsePoint](https://github.com/bigbossg13/pulsepoint) and uses the same
  look.
- **Resource hub** (`/`): FRC & FTC pit and build resources (development in progress).

## Pit display

Open `/display/`, enter your team number (optional), pick your event and open
the display. `/display/view/?demo=1` runs a made-up event in real time if you
want to try it without a live competition.

What it shows (each one is a widget you can move, add or remove):

| Widget | |
| --- | --- |
| Next match | Your alliance, partners and opponents, and a queue call: "3 matches away", "Queue in 4 min", "Queue now", "On the field now" |
| Standing | Rank, ranking score, record, event OPR and season OPR with world rank |
| Match preview | Predicted score and win chance from OPR, with each team's auto/teleop OPR |
| Our matches | Every match for your team with times (adjusted for delays) and results |
| Last result | Score breakdown of your latest match |
| Rankings | Full event rankings, your team highlighted, slow auto-scroll with a pause button |
| Coming up on the field | The next matches at the event with estimated start times |
| Alliances | Playoff alliances after selection |
| Pre-match checklist | Your own list, reset for every match |
| Welcome | A message and logo for visitors to your pit |

The header always shows the next match on the field, how far the event is
running behind, and the time at the event.

### Data

| Source | Used for |
| --- | --- |
| [FTCScout API](https://ftcscout.org/api) | Schedule, results, rankings, event and season OPR, team names. Called directly from the browser. |
| [FTC Events API](https://ftc-events.firstinspires.org/services/API) (official) | Schedule, results, official rankings and alliance selections, within seconds of being posted. Needs a key, so it goes through the small proxy in [`proxy/`](proxy/README.md). Optional. |

When both are available the official schedule and rankings win if they're at
least as far along as FTCScout (which syncs about once a minute); OPR always
comes from FTCScout. Match delays are estimated from the actual start times of
recent matches; breaks in the schedule absorb the delay. The last data is
cached on the device, so a reload on flaky venue Wi-Fi still shows something.

### Customizing for your team

Everything is under ⚙ **Settings** on the display and is saved per team on the
device:

- Layout: presets (pit overview, match focus, scouting, visitors, whole event) or arrange up to three columns of widgets.
- Team color, logo, name, welcome message, pre-match checklist and teams to highlight.
- Queue rules (minutes before the match and/or matches ahead), delay adjustment, refresh rate, OPR type.
- **Share & backup**: a link that opens the same display and settings on another screen, or a settings file.

### Accessibility

- Themes: light, dark, and high contrast (black/white/yellow); follows the device by default.
- Text size up to 150%, on top of text that already scales with the screen.
- Optional [Atkinson Hyperlegible](https://www.brailleinstitute.org/freefont/) font for low-vision readers.
- Color is never the only signal: alliances say "Red"/"Blue", results say W/L/T, your team is labeled.
- Team colors get black or white text automatically, whichever passes WCAG AA.
- Reduced motion (device setting or toggle) swaps scrolling for page flips; every moving list can be paused.
- Keyboard and screen-reader friendly: skip link, headings per widget, labelled tables, a polite live region for queue calls, new results and rank changes.
- Keeps the screen awake and hides an idle mouse pointer (both optional).

Checked with axe-core (WCAG 2.2 AA) in every theme.

## Development

```bash
npm install
npm run dev          # http://localhost:3000 (pit display at /display/)
npm test             # unit tests (data layer + proxy)
npm run typecheck
npm run lint
```

To use the FTC Events API locally, run the proxy and point the display at it:

```bash
FTC_EVENTS_USERNAME=... FTC_EVENTS_TOKEN=... npm run proxy   # http://localhost:8787
echo NEXT_PUBLIC_FTC_EVENTS_PROXY=http://localhost:8787 > .env.local
```

Deploying the proxy (Cloudflare Workers, free tier) is covered in
[`proxy/README.md`](proxy/README.md). For the GitHub Pages build, set the
repository variable `FTC_EVENTS_PROXY_URL`.

### Layout

```
app/(hub)/           resource hub pages (own root layout)
app/(pit)/           pit display: setup (/display) and display (/display/view)
components/pit/      display UI: widgets, settings dialog, setup flow
lib/pit/             data layer: FTCScout + FTC Events clients, merging, timing, settings
proxy/               FTC Events API proxy (Cloudflare Worker or Node)
```

## Adding resources to the hub

Create a `.mdx` file in the appropriate `content/` subdirectory with the required frontmatter. See `/about` in the running app for the full schema.
