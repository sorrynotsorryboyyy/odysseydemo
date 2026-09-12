/** Identifiants d'offre affichés côté vitrine. */
export type PlanId = 'pdf' | 'relie' | 'pack';

/**
 * Paramètres transmis au formulaire puis à la commande.
 * Contrat avec le backend : ne pas renommer ces clés.
 */
export interface ProductParams {
  product: 'pdf' | 'pack';
  print: boolean;
  cahier: boolean;
}

export interface Plan {
  id: PlanId;
  /** Prix TTC en euros, livraison comprise sur les formules imprimées. */
  priceEur: number;
  featured: boolean;
  params: ProductParams;
}

export type AgeRangeId = '3-5' | '6-8' | '9-11' | '12+';

export type IllustrationStyleId =
  | 'aquarelle'
  | 'ligne-claire'
  | 'papier-decoupe'
  | 'peinture-huile'
  | 'fusain-pastel'
  | 'vitrail';
