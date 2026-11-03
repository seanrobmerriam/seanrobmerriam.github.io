import type { FAQItem } from '../types';

export const faqs: FAQItem[] = [
  {
    question: 'What kind of work do you take on?',
    answer:
      'A small number of engagements at a time — LLM-enabled engineering, agent infrastructure, architecture review, and the plan for how to get there. The common thread is software that has to survive production, not just a demo.',
  },
  {
    question: 'Who do you usually work with?',
    answer:
      'Teams that want LLMs to make them faster and to make them more certain about what they’re shipping. The real opportunity isn’t speed; it’s better decisions, tighter feedback loops, and more reliable delivery.',
  },
  {
    question: 'What is your stack?',
    answer:
      'Go and Rust for services, TypeScript for the interfaces people actually touch, and C where it counts. Postgres and SQLite for data, gRPC, HTTP and MCP at the boundaries.',
  },
  {
    question: 'Where are you based?',
    answer:
      'Santa Cruz, California, and remote-friendly. I currently work as a software engineer at Kinetic Fintech.',
  },
  {
    question: 'What is your background?',
    answer:
      'I started in political science at UC Davis and found I liked systems far more than policy; the rest of the path was learning to make them legible. These days I split my time between writing Go and Rust services, designing interfaces, and helping teams adopt AI without lowering the bar.',
  },
  {
    question: 'What is Production Ready Go?',
    answer:
      'My book — Patterns and Practices for Shipping Reliable Software. It covers test-first development, explicit error handling, security-first design, strong API boundaries, operational readiness and long-term maintainability. You can read it on GitHub.',
  },
];
