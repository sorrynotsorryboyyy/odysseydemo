import type { MetadataRoute } from 'next';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Tunnel de commande et espace client : rien à indexer.
      disallow: ['/api/', '/app', '/commande/', '/compte/', '/claim'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
