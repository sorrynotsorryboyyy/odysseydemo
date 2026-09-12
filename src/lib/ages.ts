import type { AgeRangeId } from '@/types/product';

/**
 * Tranches d'âge proposées. Les libellés et descriptions vivent dans les
 * dictionnaires i18n (`home.ages.items.<id>`), jamais ici.
 *
 * Tuple `as const` : `z.enum()` exige un tuple littéral non vide.
 */
export const ageRanges = ['3-5', '6-8', '9-11', '12+'] as const;

export function isAgeRange(value: unknown): value is AgeRangeId {
  return typeof value === 'string' && (ageRanges as readonly string[]).includes(value);
}

/** Tranche correspondant à un âge saisi, pour présélection dans le formulaire. */
export function ageRangeForAge(age: number): AgeRangeId | undefined {
  if (!Number.isFinite(age)) return undefined;
  if (age >= 3 && age <= 5) return '3-5';
  if (age >= 6 && age <= 8) return '6-8';
  if (age >= 9 && age <= 11) return '9-11';
  if (age >= 12) return '12+';
  return undefined;
}
