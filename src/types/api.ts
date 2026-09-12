/**
 * Formes des réponses du backend Fastify.
 * Le frontend ne réinterprète pas ces données : il les affiche.
 */

export type OrderStatus =
  | 'pending'
  | 'generating'
  | 'ready'
  | 'printing'
  | 'shipped'
  | 'failed';

/** Artefacts téléchargeables : `kind` de GET /api/orders/:id/download/:kind */
export type ArtifactKind = 'book' | 'cahier' | 'corriges';

export interface OnboardingSession {
  sessionId: string;
}

export interface Order {
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

export interface OrderStatusResponse {
  id: string;
  status: OrderStatus;
  /** Progression de génération en pourcentage, si le backend la fournit. */
  progress?: number;
  availableDownloads: ArtifactKind[];
  failureReason?: string;
}

export interface DashboardResponse {
  orders: Order[];
}

export interface CheckoutResponse {
  /** URL de session Stripe vers laquelle rediriger. */
  url: string;
}

export interface AuthResponse {
  userId: string;
  email: string;
}

export interface ApiError {
  error: string;
  message?: string;
}
