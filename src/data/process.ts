import type { ProcessStep } from '../types';

export const processSteps: ProcessStep[] = [
  {
    number: '1',
    title: 'Decide what it must do',
    description:
      'Before anyone writes a line, pin down what the system must do — and refuse to let it mean two things. Scope, structure and sequence so delivery risk is visible early.',
    timing: 'Plan — scope, RFCs & ADRs',
  },
  {
    number: '2',
    title: 'Build test-first',
    description:
      'Model capability combined with strong architecture and disciplined testing. Explicit error handling, strong API boundaries and security-first design — no silent shortcuts.',
    timing: 'Build — tests as the contract',
  },
  {
    number: '3',
    title: 'Keep it honest',
    description:
      'Feedback loops that hold up once the real world pushes back: observability, operational readiness and documentation your team can carry forward after handover.',
    timing: 'Run — production & handover',
  },
];
