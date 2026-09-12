import type { PersonalizationDraft } from './validation';
import type { ProductParams } from '@/types/product';

/**
 * Sauvegarde locale du formulaire de personnalisation.
 *
 * Le brouillon vit dans `sessionStorage` : il survit à un rechargement et à
 * un aller-retour vers Stripe, mais disparaît à la fermeture de l'onglet.
 * Les données concernent un enfant — on n'en garde pas plus que nécessaire.
 */

const DRAFT_KEY = 'taletto:personalization-draft';

export interface StoredDraft {
  params: ProductParams;
  values: PersonalizationDraft;
  step: number;
  updatedAt: string;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function loadDraft(): StoredDraft | null {
  if (!isBrowser()) return null;

  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredDraft;
  } catch {
    // Brouillon illisible (format changé, quota) : on repart proprement.
    return null;
  }
}

export function saveDraft(draft: Omit<StoredDraft, 'updatedAt'>): void {
  if (!isBrowser()) return;

  try {
    const payload: StoredDraft = { ...draft, updatedAt: new Date().toISOString() };
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
  } catch {
    // Stockage indisponible (navigation privée, quota) : on continue sans.
  }
}

export function clearDraft(): void {
  if (!isBrowser()) return;

  try {
    window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    // Rien à faire : le brouillon expirera avec l'onglet.
  }
}
