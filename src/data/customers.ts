import type { Customer } from '../types';

const live = (path: string) => `https://work.seanmerriam.com/${path}/`;

const gh = (repo: string) => `https://github.com/seanrobmerriam/${repo}`;

/** Selected work shown on the homepage. Entries without an image get a typographic panel. */
export const customers: Customer[] = [
  {
    company: 'Postbox',
    title: 'Postbox — a message queue that agents can trust',
    sector: 'Architecture · Build',
    description:
      'Autonomous agents need somewhere durable to put work they can’t finish yet. Postbox is a persistent, lease-based queue exposing HTTP, gRPC, and MCP interfaces over SQLite — messages survive restarts, leases expire cleanly, and at-least-once delivery is the default rather than an accident. Internal agent pipelines stopped losing in-flight work to restarts.',
    metrics: [
      { value: 'Rust', label: 'SQLite · gRPC · HTTP · MCP' },
      { value: '2025', label: 'Year' },
    ],
    featured: true,
  },
  {
    company: 'ContextGraph',
    title: 'ContextGraph — version control for what an agent knows',
    sector: 'Architecture · Build',
    description:
      'Conversation context isn’t a blob — it’s a history. ContextGraph stores agent conversations as a versioned, git-like graph, so a workflow can branch, merge, replay, and roll back. When a prompt regresses, you can find the exact commit that caused it instead of guessing — “the agent got worse” becomes a diff anyone can read.',
    metrics: [
      { value: 'Rust', label: 'DAG · JSON-RPC · Replay' },
      { value: '2025', label: 'Year' },
    ],
  },
  {
    company: 'AgentChaos',
    title: 'AgentChaos — breaking agents on purpose',
    sector: 'Design · Build',
    description:
      'Recovery logic that has never been tested is a guess. AgentChaos is a transparent MCP fault-injection proxy: it corrupts responses, injects latency, drops connections, and returns malformed payloads — so you can watch whether an agent genuinely recovers or merely retries forever. Failure becomes a test fixture instead of a surprise.',
    metrics: [
      { value: 'Go', label: 'MCP · Proxy · Fault injection' },
      { value: '2026', label: 'Year' },
    ],
  },
  {
    company: 'Freshfonts',
    title: 'Freshfonts — typography without the CDN',
    sector: 'Product · Design · Build',
    description:
      'Fonts delivered over the network are a single point of failure and a page-weight tax. Freshfonts serves self-hosted fonts and SVG icons with zero-config filesystem discovery — drop a file in, get it into the build, no manifest, no plugin. One less dependency on the critical path to first paint.',
    metrics: [
      { value: 'TypeScript', label: 'WOFF2 · SVG · Zero-config' },
      { value: '2026', label: 'Year' },
    ],
  },
  {
    company: 'Production Ready Go',
    title: 'Production Ready Go — the book',
    sector: 'Book',
    description:
      'Patterns and Practices for Shipping Reliable Software. Most AI-generated code is a sketch that happens to compile; this book is about the discipline required to build software that lasts — the parts that don’t show up in a demo but decide whether a system is still running in two years.',
    metrics: [
      { value: 'Go', label: 'Test-first · Security-first' },
      { value: 'Read', label: 'On GitHub' },
    ],
    url: gh('Production-Ready-Go'),
  },
];

/** Sample product interfaces, live on work.seanmerriam.com. Shown on the homepage below the selected work. */
export const sampleInterfaces: Customer[] = [
  {
    company: 'Controlplane',
    title: 'Controlplane — admin console',
    sector: 'Dashboard',
    description:
      'A dark-mode production overview for a multi-tenant platform: tenant and job metrics, request volume, per-service health and an administrative queue that puts the next action one click away.',
    image: '/images/work-admin-dashboard.webp',
    imageAlt: 'Controlplane admin console showing metric cards, a request-volume bar chart and a service-health list',
    metrics: [
      { value: 'Admin', label: 'Type' },
      { value: 'App', label: 'Surface' },
    ],
    featured: true,
    url: live('admin-dashboard'),
  },
  {
    company: 'Common Ground',
    title: 'Common Ground — accessibility settings',
    sector: 'Accessibility',
    description:
      'A reading-preferences panel with a live preview: text size, higher contrast, reduced motion, captions and enhanced keyboard focus, saved on the device and fully operable from the keyboard.',
    image: '/images/work-accessibility-settings-page.webp',
    imageAlt: 'Common Ground settings page with a live reading preview beside text size, contrast, motion and focus options',
    metrics: [
      { value: 'Settings', label: 'Type' },
      { value: 'App', label: 'Surface' },
    ],
    url: live('accessibility-settings-page'),
  },
  {
    company: 'Threadwork',
    title: 'Threadwork — workflow builder',
    sector: 'Product UI',
    description:
      'An automation editor for finance teams: drop in connectors, chain triggers, conditions and actions on a canvas, and edit each step in a side panel with clear failure behaviour.',
    image: '/images/work-automation-workflow-builder.webp',
    imageAlt: 'Threadwork workflow canvas with schedule, filter and email steps and a node configuration panel',
    metrics: [
      { value: 'Editor', label: 'Type' },
      { value: 'App', label: 'Surface' },
    ],
    url: live('automation-workflow-builder'),
  },
  {
    company: 'fieldnotes',
    title: 'fieldnotes — growth report',
    sector: 'Analytics',
    description:
      'A product-analytics report on how teams find their first value: a headline trend chart, activation and retention figures, a segment table and a visit-to-value funnel.',
    image: '/images/work-analytics-dashboard.webp',
    imageAlt: 'fieldnotes growth report with an active-teams bar chart, key metrics and a segment table',
    metrics: [
      { value: 'Report', label: 'Type' },
      { value: 'App', label: 'Surface' },
    ],
    url: live('analytics-dashboard'),
  },
  {
    company: 'assembly',
    title: 'assembly — people directory',
    sector: 'Data table',
    description:
      'A workspace directory with search, status tabs, role controls, bulk actions and invitations — the everyday admin table, made calm and scannable.',
    image: '/images/work-admin-data-table.webp',
    imageAlt: 'assembly people table with status tabs, a search field, role dropdowns and status badges',
    metrics: [
      { value: 'Table', label: 'Type' },
      { value: 'App', label: 'Surface' },
    ],
    url: live('admin-data-table'),
  },
  {
    company: 'Recordkeeper',
    title: 'Recordkeeper — audit ledger',
    sector: 'Compliance',
    description:
      'An audit log for an organisation: search and filter every change, then open an event in the inspector to see the actor, origin and complete record of what changed.',
    image: '/images/work-audit-log.webp',
    imageAlt: 'Recordkeeper audit ledger listing events with an evidence inspector panel',
    metrics: [
      { value: 'Log', label: 'Type' },
      { value: 'App', label: 'Surface' },
    ],
    url: live('audit-log'),
  },
  {
    company: 'Request Lab',
    title: 'Request Lab — API playground',
    sector: 'Developer tools',
    description:
      'An API sandbox that sends sample requests to a local simulator: method and URL bar, editable JSON body, headers and code tabs, and a response panel that explains validation.',
    image: '/images/work-api-playground.webp',
    imageAlt: 'Request Lab playground with a POST request, JSON payload editor and response panel',
    metrics: [
      { value: 'Sandbox', label: 'Type' },
      { value: 'App', label: 'Surface' },
    ],
    url: live('api-playground'),
  },
  {
    company: 'Northstar Developers',
    title: 'Northstar — API reference',
    sector: 'Docs',
    description:
      'Developer documentation for the Northstar API v1: grouped endpoints with method badges, parameters, authentication notes and copyable example requests and responses.',
    image: '/images/work-api-reference.webp',
    imageAlt: 'Northstar API reference with an endpoint sidebar, the List projects page and an example cURL request',
    metrics: [
      { value: 'Docs', label: 'Type' },
      { value: 'Docs', label: 'Surface' },
    ],
    url: live('api-reference'),
  },
  {
    company: 'Folio',
    title: 'Folio — story editor',
    sector: 'CMS',
    description:
      'An editorial CMS screen for writing, previewing and publishing an article, with a content library, word count and a publication panel for slug, category, author and revisions.',
    image: '/images/work-cms-content-editor.webp',
    imageAlt: 'Folio story editor with a content library, article fields and a publication settings panel',
    metrics: [
      { value: 'Editor', label: 'Type' },
      { value: 'App', label: 'Surface' },
    ],
    url: live('cms-content-editor'),
  },
  {
    company: 'Claimwell',
    title: 'Claimwell — AI product landing',
    sector: 'Landing page',
    description:
      'A landing page for an AI claims product — “less paperwork, more judgment” — pairing a claim-review card with a clear message that people, not the model, make the decision.',
    image: '/images/work-ai-product-landing.webp',
    imageAlt: 'Claimwell landing page headline beside a claim review card with evidence and policy checks',
    metrics: [
      { value: 'Landing', label: 'Type' },
      { value: 'Site', label: 'Surface' },
    ],
    url: live('ai-product-landing'),
  },
  {
    company: 'Routeline',
    title: 'Routeline — business landing',
    sector: 'Landing page',
    description:
      'A landing page for field-service crews: a sample day on the books, feature cards for scheduling, updates and invoicing, and a single straightforward plan.',
    image: '/images/work-business-landing-page.webp',
    imageAlt: 'Routeline landing page with a “Less chasing. More doing.” headline and a sample day schedule card',
    metrics: [
      { value: 'Landing', label: 'Type' },
      { value: 'Site', label: 'Surface' },
    ],
    url: live('business-landing-page'),
  },
  {
    company: 'Good Form',
    title: 'Good Form — studio site',
    sector: 'Agency',
    description:
      'A site for an independent strategy, identity and digital studio: an editorial headline, a stats band and a grid of illustrative brand partnerships.',
    image: '/images/work-agency-services-landing.webp',
    imageAlt: 'Good Form studio homepage with a “Your next chapter. Better told.” headline and a stats band',
    metrics: [
      { value: 'Marketing', label: 'Type' },
      { value: 'Site', label: 'Surface' },
    ],
    url: live('agency-services-landing'),
  },
  {
    company: 'Northstar',
    title: 'Northstar — about page',
    sector: 'Company',
    description:
      'A company story page: “good work starts with clear ownership”, a founding-year feature card, a timeline and the people behind the product.',
    image: '/images/work-about-company-page.webp',
    imageAlt: 'Northstar about page with a large headline and a green 2018 field-notes card',
    metrics: [
      { value: 'About', label: 'Type' },
      { value: 'Site', label: 'Surface' },
    ],
    url: live('about-company-page'),
  },
  {
    company: 'Orbit',
    title: 'Orbit — app store listing',
    sector: 'App listing',
    description:
      'A listing page for a gentle focus app: a working focus timer, weekly time-spent stats, reviews and a privacy note — no streaks to feel guilty about.',
    image: '/images/work-app-store-listing-page.webp',
    imageAlt: 'Orbit app listing with a “A little space to focus” headline, a 25:00 focus timer and a weekly total card',
    metrics: [
      { value: 'Listing', label: 'Type' },
      { value: 'Site', label: 'Surface' },
    ],
    url: live('app-store-listing-page'),
  },
];
