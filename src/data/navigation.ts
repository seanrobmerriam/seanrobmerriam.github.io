import type { Link, NavigationItem } from '../types';

/**
 * Header navigation. Homepage sections use "/#id" so the links work from every page.
 * Items with `matchPath` get aria-current when the visitor is on that page.
 */
export const mainNav: NavigationItem[] = [
  { label: 'Capabilities', href: '/#services' },
  { label: 'Principles', href: '/#platform' },
  { label: 'Process', href: '/#process' },
  { label: 'Work', href: '/#work' },
];

/** Mobile menu adds a direct Contact link below the main items. */
export const mobileNav: NavigationItem[] = [...mainNav, { label: 'Contact', href: '/#contact' }];

export interface FooterColumn {
  title: string;
  links: Link[];
}

export const footerColumns: FooterColumn[] = [
  {
    title: 'Capabilities',
    links: [
      { label: 'LLM-enabled workflows', href: '/#services' },
      { label: 'Agent-driven testing', href: '/#services' },
      { label: 'Architecture reviews', href: '/#services' },
      { label: 'Reliability & TDD', href: '/#services' },
      { label: 'Technical strategy', href: '/#services' },
    ],
  },
  {
    title: 'Site',
    links: [
      { label: 'Principles', href: '/#platform' },
      { label: 'Process', href: '/#process' },
      { label: 'Work', href: '/#work' },
      { label: 'FAQ', href: '/#faq' },
    ],
  },
];

/**
 * Links in the bottom bar of the footer. The theme ships without legal pages,
 * so only real routes are listed. Add your own once the pages exist, e.g.
 *   { label: 'Privacy', href: '/privacy' },
 *   { label: 'Terms', href: '/terms' },
 */
export const legalLinks: Link[] = [
  { label: 'Sitemap', href: '/sitemap-index.xml' },
];
