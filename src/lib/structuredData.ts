import { plans } from './products';
import type { Dictionary } from '@/i18n/getDictionary';
import { translate } from '@/i18n/getDictionary';

/**
 * Données structurées schema.org.
 *
 * Elles décrivent à Google la nature du produit, les prix et les réponses
 * de la FAQ. Règle absolue : ne déclarer que ce qui est réellement affiché
 * sur la page — un balisage qui ment est sanctionné, et une note d'avis
 * inventée l'est doublement. Aucun `aggregateRating` tant qu'il n'y a pas
 * de vrais avis collectés.
 */

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(
  /\/$/,
  '',
);

export function organizationSchema(dictionary: Dictionary) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: translate(dictionary, 'common.brand'),
    url: siteUrl,
    logo: `${siteUrl}/icon.svg`,
    description: translate(dictionary, 'meta.home.description'),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      url: `${siteUrl}/contact`,
      availableLanguage: ['French', 'English', 'German', 'Spanish'],
    },
  };
}

export function websiteSchema(dictionary: Dictionary) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: translate(dictionary, 'common.brand'),
    url: siteUrl,
    inLanguage: ['fr', 'en', 'de', 'es'],
  };
}

/** Le produit et ses trois déclinaisons tarifaires. */
export function productSchema(dictionary: Dictionary) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: translate(dictionary, 'product.schemaName'),
    description: translate(dictionary, 'meta.home.description'),
    brand: {
      '@type': 'Brand',
      name: translate(dictionary, 'common.brand'),
    },
    audience: {
      '@type': 'PeopleAudience',
      suggestedMinAge: 3,
      suggestedMaxAge: 12,
    },
    offers: plans.map((plan) => ({
      '@type': 'Offer',
      name: translate(dictionary, `pricing.plans.${plan.id}.name`),
      price: plan.priceEur,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${siteUrl}/tarifs`,
      // Prix final, livraison comprise : c'est la promesse commerciale.
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
    })),
  };
}

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQPage : rend les questions éligibles aux résultats enrichis.
 *
 * `limit` doit refléter ce que la page affiche réellement : baliser des
 * questions absentes du contenu visible est une non-conformité sanctionnée.
 */
export function faqSchema(dictionary: Dictionary, limit?: number) {
  const faq = dictionary.faq as { items?: FaqItem[] } | undefined;
  const all = faq?.items ?? [];
  const items = limit ? all.slice(0, limit) : all;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/** Fil d'Ariane, pour l'affichage du chemin dans les résultats. */
export function breadcrumbSchema(
  trail: Array<{ name: string; path: string }>,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((step, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: step.name,
      item: `${siteUrl}${step.path}`,
    })),
  };
}

/** Sérialise un schéma pour injection dans un <script type="application/ld+json">. */
export function jsonLd(schema: object): { __html: string } {
  // `</script>` dans une chaîne casserait la balise : on neutralise le chevron.
  return { __html: JSON.stringify(schema).replace(/</g, '\u003c') };
}
