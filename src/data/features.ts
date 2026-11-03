import type { Feature } from '../types';

/** Checklist in the "Positioning" section — the principles behind the work. */
export const features: Feature[] = [
  { title: 'Ambiguity is the real cost.', description: 'Generated code is cheap. Deciding what the system must do — and refusing to let it mean two things — is not.' },
  { title: 'The test is the contract.', description: 'If behaviour isn’t asserted, it isn’t specified. Tests are where intent stops being a suggestion.' },
  { title: 'Boring where it counts.', description: 'Novelty belongs in the product. Infrastructure should stay legible at 3am to someone who didn’t write it.' },
  { title: 'Agents need boundaries, not vibes.', description: 'Give a model a tool it can use and a failure it can’t recover from, and reliability arrives by accident. Design for the second one.' },
];
