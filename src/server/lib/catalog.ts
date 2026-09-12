import { z } from 'zod';

/**
 * Catalogue des offres — source de vérité des prix.
 *
 * SÉCURITÉ : le montant est TOUJOURS calculé ici, à partir des seuls
 * paramètres `product` / `print` / `cahier`. Le client peut envoyer ce qu'il
 * veut dans le corps de la requête, il ne peut pas influencer le prix.
 *
 * Ces trois paramètres viennent des URLs du frontend
 * (`/app?product=…&print=…&cahier=…`) : contrat, ne pas renommer.
 */

export const productKinds = ['pdf', 'pack'] as const;
export type ProductKind = (typeof productKinds)[number];

export const productParamsSchema = z.object({
  product: z.enum(productKinds),
  print: z.boolean(),
  cahier: z.boolean(),
});

export type ProductParams = z.infer<typeof productParamsSchema>;

export interface CatalogEntry {
  planId: 'pdf' | 'relie' | 'pack';
  amountCents: number;
  currency: 'eur';
  label: string;
}

/**
 * Les trois offres. « Livre Relié » utilise `product: pdf` avec `print: true` :
 * c'est le drapeau d'impression qui distingue l'offre, pas un identifiant
 * dédié. Conforme au contrat du frontend.
 */
const catalog: CatalogEntry[] = [
  {
    planId: 'pdf',
    amountCents: 900,
    currency: 'eur',
    label: 'PDF Livre — histoire personnalisée 24 pages',
  },
  {
    planId: 'relie',
    amountCents: 2500,
    currency: 'eur',
    label: 'Livre Relié — 24 pages imprimées, PDF inclus',
  },
  {
    planId: 'pack',
    amountCents: 3900,
    currency: 'eur',
    label: 'Pack Complet — livre, cahier d’activités et corrigés',
  },
];

function key(params: ProductParams): string {
  return `${params.product}:${params.print}:${params.cahier}`;
}

const byParams = new Map<string, CatalogEntry>([
  [key({ product: 'pdf', print: false, cahier: false }), catalog[0]!],
  [key({ product: 'pdf', print: true, cahier: false }), catalog[1]!],
  [key({ product: 'pack', print: true, cahier: true }), catalog[2]!],
]);

/**
 * Résout l'offre correspondant aux paramètres reçus.
 * `null` si la combinaison ne correspond à aucune offre vendue : la commande
 * doit alors être refusée, jamais facturée à un prix deviné.
 */
export function resolveOffer(params: ProductParams): CatalogEntry | null {
  return byParams.get(key(params)) ?? null;
}
