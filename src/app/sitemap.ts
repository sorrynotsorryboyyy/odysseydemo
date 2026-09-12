import type { MetadataRoute } from 'next';

import { hrefLangCodes, locales } from '@/i18n/config';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

/** Pages publiques seules : le tunnel et l'espace client ne sont pas indexés. */
const publicPaths = [
  '/',
  '/tarifs',
  '/pack',
  '/faq',
  '/contact',
  '/legal/cgv',
  '/legal/confidentialite',
  '/legal/remboursements',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicPaths.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.7,
    alternates: {
      // Les 4 langues partagent une URL (sélection par cookie) : les
      // alternates pointent donc vers la même adresse.
      languages: Object.fromEntries(
        locales.map((locale) => [hrefLangCodes[locale], `${siteUrl}${path}`]),
      ),
    },
  }));
}
