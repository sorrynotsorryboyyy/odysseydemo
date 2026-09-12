import type { Plan, PlanId, ProductParams } from '@/types/product';

/**
 * Catalogue des trois offres.
 *
 * Les paramètres d'URL sont un contrat avec le backend. En particulier,
 * l'offre « Livre Relié » envoie bien `product=pdf` avec `print=true` :
 * ce n'est pas une coquille, le backend distingue l'impression par le
 * drapeau `print`, pas par un identifiant de produit dédié.
 */
export const plans: Plan[] = [
  {
    id: 'pdf',
    priceEur: 9,
    featured: false,
    params: { product: 'pdf', print: false, cahier: false },
  },
  {
    id: 'relie',
    priceEur: 25,
    featured: false,
    params: { product: 'pdf', print: true, cahier: false },
  },
  {
    id: 'pack',
    priceEur: 39,
    featured: true,
    params: { product: 'pack', print: true, cahier: true },
  },
];

export function getPlan(id: PlanId): Plan | undefined {
  return plans.find((plan) => plan.id === id);
}

/** Construit l'URL du formulaire de personnalisation pour une offre. */
export function planHref(plan: Plan): string {
  return `/app?${paramsToQuery(plan.params)}`;
}

export function paramsToQuery(params: ProductParams): string {
  return new URLSearchParams({
    product: params.product,
    print: String(params.print),
    cahier: String(params.cahier),
  }).toString();
}

/**
 * Relit les paramètres depuis l'URL du formulaire.
 * Retombe sur l'offre PDF seule si un paramètre est absent ou invalide.
 */
export function parseProductParams(
  search: Record<string, string | string[] | undefined>,
): ProductParams {
  const raw = (key: string): string | undefined => {
    const value = search[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const product = raw('product') === 'pack' ? 'pack' : 'pdf';

  return {
    product,
    print: raw('print') === 'true',
    cahier: raw('cahier') === 'true',
  };
}

/** Retrouve l'offre correspondant à un jeu de paramètres, si elle existe. */
export function planFromParams(params: ProductParams): Plan | undefined {
  return plans.find(
    (plan) =>
      plan.params.product === params.product &&
      plan.params.print === params.print &&
      plan.params.cahier === params.cahier,
  );
}
