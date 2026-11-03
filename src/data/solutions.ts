import type { Solution } from '../types';

export const solutions: Solution[] = [
  {
    number: '01',
    title: 'LLM-enabled engineering workflows',
    description:
      'Practical workflows where models improve speed, clarity, and output quality without compromising the standards production demands.',
    href: '/#contact',
    category: 'Workflows',
    features: ['Agent harnesses', 'Prompt design', 'MCP', 'Review automation'],
  },
  {
    number: '02',
    title: 'Agent-driven testing & internal tooling',
    description:
      'Agent-backed test generation and review, plus the unglamorous internal tooling that keeps a team shipping instead of waiting.',
    href: '/#contact',
    category: 'Tooling',
    features: ['Test harnesses', 'CI', 'Fixture design', 'MCP servers'],
  },
  {
    number: '03',
    title: 'Architecture & design reviews',
    description:
      'A second opinion on the hard boundaries: service decomposition, data contracts, and the failure modes nobody priced in at the start.',
    href: '/#contact',
    category: 'Architecture',
    features: ['System design', 'API boundaries', 'ADRs', 'Capacity'],
  },
  {
    number: '04',
    title: 'Reliability & TDD for AI-assisted teams',
    description:
      'Keeping the standards high when code is cheap — explicit error handling, real test coverage, security-first design, no silent shortcuts.',
    href: '/#contact',
    category: 'Reliability',
    features: ['TDD', 'Observability', 'Security review', 'Go · Rust'],
  },
  {
    number: '05',
    title: 'Custom application development',
    description:
      'End-to-end builds from an ambiguous brief to deployed, documented, maintainable software — with the decisions written down as they happen.',
    href: '/#contact',
    category: 'Build',
    features: ['TypeScript', 'Go', 'Rust', 'Postgres'],
  },
  {
    number: '06',
    title: 'Development planning & technical strategy',
    description:
      'Scoping, structuring, and sequencing software initiatives so that delivery risk is visible early and cheap to change.',
    href: '/#contact',
    category: 'Strategy',
    features: ['Roadmaps', 'RFCs', 'Staff+ work', 'Estimation'],
  },
];
