import type { SiteConfig } from '../types';

/**
 * Central theme configuration.
 * Change the values below to rebrand the theme — every component reads from here.
 * All contact details are placeholders for the demo.
 */
export const siteConfig: SiteConfig = {
  name: 'Sean Merriam',
  brand: { prefix: 'Sean ', accent: 'Merriam', suffix: '' },
  tagline: 'Design Engineer',
  description:
    'Sean Merriam is a senior software engineer and designer in Santa Cruz, California. He builds LLM-enabled engineering workflows, agent infrastructure, and reliable production systems.',
  lang: 'en',
  locale: 'en_US',

  email: 'hello@seanmerriam.com',
  phone: '+1 (831) 291-0567',
  phoneHref: '+18312910567',
  location: {
    label: 'Based in',
    lines: ['Santa Cruz, California', 'Remote-friendly'],
  },
  responseTime: 'Typical reply within two business days',

  footerBlurb:
    'Senior software engineer and designer working at the intersection of reliability and LLM-enabled development.',
  copyright: `© ${new Date().getFullYear()} Sean Merriam. All rights reserved.`,

  // Replace with your own profiles. Remove an entry to hide its icon.
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sean-merriam-057a243ba', icon: 'linkedin' },
    { label: 'X', href: 'https://x.com/rusty_yachts', icon: 'x' },
    { label: 'GitHub', href: 'https://github.com/seanrobmerriam', icon: 'github' },
  ],

  seo: {
    titleSeparator: ' — ',
    defaultTitle: 'Sean Merriam — Design Engineer',
    ogImage: '/preview.jpg',
    ogImageAlt: 'Sean Merriam — Design Engineer, homepage preview on desktop and mobile.',
    twitterHandle: undefined,
    themeColor: '#EC5A11',
  },

  cta: { label: 'Start a conversation', shortLabel: 'Contact', href: '/#contact' },

  forms: {
    contactAction: '',
    newsletterAction: '',
    netlify: false,
  },
};
