import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import type { ReactNode } from 'react';

import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { hrefLangCodes, locales } from '@/i18n/config';
import { getDictionary, getLocale, translate } from '@/i18n/getDictionary';
import { TranslationsProvider } from '@/i18n/TranslationsProvider';

import './globals.css';

// Polices self-hosted par next/font : aucun appel réseau tiers au runtime.
const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  axes: ['SOFT', 'WONK'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();

  const brand = translate(dictionary, 'common.brand');
  const title = translate(dictionary, 'meta.home.title');
  const description = translate(dictionary, 'meta.home.description');

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      // Les pages filles n'ont plus à répéter le nom de la marque.
      template: `%s — ${brand}`,
    },
    description,
    applicationName: brand,
    authors: [{ name: brand }],
    creator: brand,
    alternates: {
      canonical: '/',
      // Les 4 langues partagent une URL (sélection par cookie) : les balises
      // pointent donc toutes vers la même adresse. Voir la note SEO du plan.
      languages: Object.fromEntries(
        locales.map((locale) => [hrefLangCodes[locale], '/']),
      ),
    },
    // L'image de partage est détectée automatiquement : déposer un fichier
    // `opengraph-image.png` (1200×630) dans `src/app/`. Next ajoute alors
    // `og:image` et `twitter:image` sans configuration supplémentaire — ne
    // pas déclarer `images` ici, cela désactiverait cette détection.
    openGraph: {
      type: 'website',
      siteName: brand,
      title,
      description,
      url: '/',
      locale: 'fr_FR',
      alternateLocale: ['en_US', 'de_DE', 'es_ES'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    formatDetection: { telephone: false },
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = getLocale();
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale} className={`${sans.variable} ${display.variable}`}>
      <body className="flex min-h-screen flex-col">
        <TranslationsProvider locale={locale} dictionary={dictionary}>
          <a className="skip-link" href="#contenu">
            {translate(dictionary, 'common.skipToContent')}
          </a>
          <Header dictionary={dictionary} />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer dictionary={dictionary} />
        </TranslationsProvider>
      </body>
    </html>
  );
}
