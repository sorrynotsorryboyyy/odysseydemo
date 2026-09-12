import type { IllustrationStyleId } from '@/types/product';

/**
 * Styles d'illustration proposés. Les libellés vivent dans les dictionnaires
 * i18n (`home.styles.items.<id>`), jamais ici.
 *
 * Tuple `as const` : `z.enum()` exige un tuple littéral non vide.
 */
export const illustrationStyles = [
  'aquarelle',
  'ligne-claire',
  'papier-decoupe',
  'peinture-huile',
  'fusain-pastel',
  'vitrail',
] as const;

export function isIllustrationStyle(value: unknown): value is IllustrationStyleId {
  return (
    typeof value === 'string' && (illustrationStyles as readonly string[]).includes(value)
  );
}
