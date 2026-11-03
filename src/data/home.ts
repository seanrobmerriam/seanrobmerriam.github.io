import type { HeroStat, SectionHeading } from '../types';

/** Copy for the homepage hero. Line breaks in the headline are intentional. */
export const hero = {
  eyebrow: 'Available for Q1 2027 engagements',
  /** Each entry is one line of the headline; `tint` lines use the light-peach accent. */
  headline: [
    { text: 'I design systems', tint: false },
    { text: 'that survive', tint: false },
    { text: 'production —', tint: false },
     { text: ' and product teams.', tint: true },
  ],
  lead: 'Senior software engineer and designer working at the intersection of reliability and LLM-enabled development. I turn ambiguous problems into working software — then write about the discipline it takes to keep it working.',
  primaryCta: { label: 'Start a conversation', href: '/#contact' },
  secondaryCta: { label: 'See selected work', href: '/#work' },
  image: '/images/ai-agency-hero.jpg',
  credentials: [
    { icon: 'clock', label: 'Santa Cruz, CA' },
    { icon: 'shield-check', label: 'Software Engineering · Design' },
    { icon: 'bars', label: 'LLM integration · Agent infrastructure' },
  ] as const,
};

/** The four figures pinned to the bottom of the hero. */
export const heroStats: HeroStat[] = [
  { value: '12+', label: 'Years writing and shipping production software' },
  { value: '40+', label: 'Projects delivered, from first brief to running system' },
  { value: '6', label: 'Systems still in production after handover' },
  { value: '1', label: 'Book published — Production Ready Go' },
];

export const clients = {
  label: 'Working with',
  /** Word-mark strip of the languages I build with. */
  names: ['Rust', 'Go', 'Erlang', 'TypeScript', 'Zig', 'C'],
};

export const sections: Record<
  'solutions' | 'platform' | 'process' | 'work' | 'samples' | 'sectors' | 'testimonial' | 'team' | 'pricing' | 'insights' | 'faq' | 'contact',
  SectionHeading
> = {
  solutions: {
    kicker: 'Capabilities',
    title: 'Where I can help a team move faster without lowering the bar.',
    lead: 'I work with teams that want LLMs in order to make their teams work faster and to make them more certain about what they’re shipping.',
  },
  platform: {
    kicker: 'Positioning',
    title: 'Most software is<br>written twice.',
    lead: 'Once to prove it works, and again to survive production. The interesting work is rarely the code itself — it’s deciding what the system must do before anyone can write a line of it, and then building the feedback loops that keep it honest once the real world pushes back.',
  },
  process: {
    kicker: 'How I work',
    title: 'Ambiguity out.<br>Reliability in.',
    lead: 'Better decisions, tighter feedback loops, and more reliable delivery — in that order.',
  },
  work: {
    kicker: 'Selected work',
    title: 'Infrastructure for<br>teams that build with AI.',
    lead: 'Queues, context and fault injection for autonomous agents — plus the book on what it takes to keep software running.',
  },
  samples: {
    kicker: 'Sample interfaces',
    title: 'Fourteen sites,<br>fourteen brands.',
    lead: 'Working product interfaces and marketing pages — dashboards, data tables, editors, docs and landing pages — each with its own palette and interactions.',
  },
  sectors: {
    kicker: 'Where I work',
    title: 'Teams that build with AI',
    lead: 'Teams that want LLMs to make them faster and more certain about what they ship.',
  },
  testimonial: { kicker: 'Kind words', title: '' },
  team: {
    kicker: 'About',
    title: 'Engineer by training. Designer by instinct.',
    lead: 'Senior software engineer and designer in Santa Cruz, California.',
  },
  pricing: {
    kicker: 'Engagements',
    title: 'Ways to work together',
    lead: 'A small number of engagements at a time, scoped to what is actually stuck.',
  },
  insights: {
    kicker: 'Writing',
    title: 'Notes on production discipline',
    lead: 'On reliability, testing and building software with LLMs that is still running in two years.',
  },
  faq: {
    kicker: 'Questions',
    title: 'Before you<br>get in touch',
    lead: 'If yours is not here, ask it in the form below.',
  },
  contact: {
    kicker: 'Contact',
    title: 'Have a problem that<br>needs to ship?',
    lead: 'I take on a small number of engagements at a time — LLM-enabled engineering, agent infrastructure, architecture review, and the plan for how to get there. Tell me what’s actually stuck.',
  },
};

export const platformImage = {
  src: '/images/platform-operations-lead.webp',
  alt: 'A person working at a desktop computer',
  tag: 'Reliability · LLM-enabled development',
};

/** Orange call-to-action band above the footer. */
export const finalCta = {
  kicker: 'Available for Q1 2027 engagements',
  title: 'The real opportunity with LLMs isn’t speed.',
  lead: 'It’s better decisions, tighter feedback loops, and more reliable delivery.',
};

export const contactForm = {
  workflows: [
    'LLM-enabled engineering workflows',
    'Agent-driven testing & internal tooling',
    'Architecture & design review',
    'Reliability & TDD for AI-assisted teams',
    'Custom application development',
    'Development planning & technical strategy',
    'Something else entirely',
  ],
  submitLabel: 'Send message',
  note: 'Typical reply within two business days.',
};

export const newsletter = {
  title: 'Occasional notes',
  description: 'Now and then: what I am building, what broke, and the production discipline that fixed it.',
  submitLabel: 'Subscribe',
};
