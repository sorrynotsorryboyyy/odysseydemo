import { z } from 'zod';

import { productParamsSchema } from './catalog';

/**
 * Formes des documents Firestore et des corps de requête.
 *
 * Elles reprennent exactement `src/types/api.ts` : c'est un contrat, le
 * frontend affiche ces données sans les réinterpréter.
 *
 * Firestore n'étant pas relationnel, rien n'empêche structurellement une
 * incohérence. La validation à l'écriture, ici, tient ce rôle.
 */

export const orderStatuses = [
  'pending',
  'generating',
  'ready',
  'printing',
  'shipped',
  'failed',
] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const artifactKinds = ['book', 'cahier', 'corriges'] as const;
export type ArtifactKind = (typeof artifactKinds)[number];

export const illustrationStyles = [
  'aquarelle',
  'ligne-claire',
  'papier-decoupe',
  'peinture-huile',
  'fusain-pastel',
  'vitrail',
] as const;

/** Données de personnalisation, telles que le Wizard les envoie. */
export const personalizationSchema = z.object({
  firstName: z.string().trim().min(1).max(40),
  age: z.number().int().min(1).max(17),
  photoId: z.string().optional(),

  interests: z.string().trim().min(1).max(500),
  universe: z.string().trim().min(1).max(500),
  themes: z.string().trim().max(500).optional(),

  style: z.enum(illustrationStyles),

  primaryLanguage: z.string().min(2).max(5),
  secondaryLanguage: z.string().max(5).optional(),
  inclusion: z.string().trim().max(500).optional(),

  consent: z.literal(true),
  photoConsent: z.boolean().optional(),
});

export type Personalization = z.infer<typeof personalizationSchema>;

export const createOrderSchema = productParamsSchema.extend({
  personalization: personalizationSchema,
});

export const googleAuthSchema = z.object({
  idToken: z.string().min(1),
});

export const claimSchema = z.object({
  token: z.string().min(1),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  orderId: z.string().trim().max(64).optional(),
  subject: z.string().trim().min(1).max(120),
  message: z.string().trim().min(1).max(2000),
});

/** Document `orders` en base. */
export interface OrderDocument {
  id: string;
  status: OrderStatus;
  product: 'pdf' | 'pack';
  print: boolean;
  cahier: boolean;
  amountCents: number;
  currency: string;
  userId: string | null;
  personalization: Personalization | null;
  /** Dupliqué au premier niveau : la bibliothèque l'affiche sans lire
   *  toute la personnalisation. */
  childFirstName: string;
  availableDownloads: ArtifactKind[];
  progress?: number;
  failureReason?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/** Élément de `GET /api/dashboard`. */
export interface OrderSummary {
  id: string;
  status: OrderStatus;
  childFirstName: string;
  createdAt: string;
  product: 'pdf' | 'pack';
  print: boolean;
  cahier: boolean;
  availableDownloads: ArtifactKind[];
  trackingUrl?: string;
}

export function toOrderSummary(order: OrderDocument): OrderSummary {
  return {
    id: order.id,
    status: order.status,
    childFirstName: order.childFirstName,
    createdAt: order.createdAt,
    product: order.product,
    print: order.print,
    cahier: order.cahier,
    availableDownloads: order.availableDownloads ?? [],
    trackingUrl: order.trackingUrl,
  };
}
