import { z } from 'zod';

import { ageRanges } from './ages';
import { illustrationStyles } from './styles';

/**
 * Schémas du formulaire de personnalisation.
 *
 * Les messages sont des clés de traduction (`form.validation.*`), pas des
 * phrases : les composants les passent au dictionnaire avant affichage.
 */

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export const childStepSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'form.validation.firstNameRequired')
    .max(40, 'form.validation.firstNameTooLong'),
  age: z
    .number({ required_error: 'form.validation.ageRequired' })
    .int('form.validation.ageRange')
    .min(1, 'form.validation.ageRange')
    .max(17, 'form.validation.ageRange'),
  photoId: z.string().optional(),
});

export const storyStepSchema = z.object({
  interests: z.string().trim().min(1, 'form.validation.interestsRequired').max(500),
  universe: z.string().trim().min(1, 'form.validation.universeRequired').max(500),
  themes: z.string().trim().max(500).optional(),
});

export const styleStepSchema = z.object({
  style: z.enum(illustrationStyles, {
    required_error: 'form.validation.styleRequired',
    invalid_type_error: 'form.validation.styleRequired',
  }),
});

export const languagesStepSchema = z.object({
  primaryLanguage: z.string().min(1, 'form.validation.languageRequired'),
  secondaryLanguage: z.string().optional(),
  inclusion: z.string().trim().max(500).optional(),
});

export const consentStepSchema = z.object({
  consent: z.literal(true, {
    errorMap: () => ({ message: 'form.validation.consentRequired' }),
  }),
  photoConsent: z.boolean().optional(),
});

/** Schéma complet, validé avant la création de commande. */
export const personalizationSchema = childStepSchema
  .merge(storyStepSchema)
  .merge(styleStepSchema)
  .merge(languagesStepSchema)
  .merge(consentStepSchema);

export type ChildStep = z.infer<typeof childStepSchema>;
export type StoryStep = z.infer<typeof storyStepSchema>;
export type StyleStep = z.infer<typeof styleStepSchema>;
export type LanguagesStep = z.infer<typeof languagesStepSchema>;
export type ConsentStep = z.infer<typeof consentStepSchema>;
export type Personalization = z.infer<typeof personalizationSchema>;

/** Brouillon partiel : tout est optionnel tant que l'étape n'est pas validée. */
export type PersonalizationDraft = Partial<Personalization>;

export const ageRangeSchema = z.enum(ageRanges);

/** Valide un fichier photo avant upload. Renvoie une clé d'erreur ou `null`. */
export function validatePhoto(file: File): string | null {
  if (!(ACCEPTED_PHOTO_TYPES as readonly string[]).includes(file.type)) {
    return 'form.validation.photoType';
  }
  if (file.size > MAX_PHOTO_BYTES) {
    return 'form.validation.photoTooLarge';
  }
  return null;
}

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  orderId: z.string().trim().max(64).optional(),
  subject: z.string().trim().min(1).max(120),
  message: z.string().trim().min(1).max(2000),
});
