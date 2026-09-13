'use client';

import { useEffect, useState } from 'react';

import { PhotoUpload } from './PhotoUpload';
import { Summary } from './Summary';
import {
  Button,
  Card,
  controlClass,
  Field,
  Icon,
  Notice,
  Placeholder,
} from '@/components/ui';
import { locales, localeLabels } from '@/i18n/config';
import { useTranslations } from '@/i18n/TranslationsProvider';
import { cn } from '@/lib/cn';
import { clearDraft, loadDraft, saveDraft } from '@/lib/session';
import { illustrationStyles } from '@/lib/styles';
import {
  childStepSchema,
  consentStepSchema,
  languagesStepSchema,
  personalizationSchema,
  storyStepSchema,
  styleStepSchema,
  type PersonalizationDraft,
} from '@/lib/validation';
import type { ProductParams } from '@/types/product';

const STEPS = ['child', 'story', 'style', 'languages', 'consent', 'summary'] as const;
type Step = (typeof STEPS)[number];

/** Schéma de validation par étape ; le récapitulatif valide l'ensemble. */
const stepSchemas = {
  child: childStepSchema,
  story: storyStepSchema,
  style: styleStepSchema,
  languages: languagesStepSchema,
  consent: consentStepSchema,
  summary: personalizationSchema,
} as const;

export function Wizard({ params }: { params: ProductParams }) {
  const { t } = useTranslations('form');
  const [stepIndex, setStepIndex] = useState(0);
  const [values, setValues] = useState<PersonalizationDraft>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [restored, setRestored] = useState(false);

  const step = STEPS[stepIndex];

  // Reprise du brouillon : après un rechargement ou un retour depuis Stripe.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setValues(draft.values);
      setStepIndex(Math.min(draft.step, STEPS.length - 1));
    }
    setRestored(true);
  }, []);

  // Sauvegarde à chaque changement, une fois la reprise faite.
  useEffect(() => {
    if (restored) saveDraft({ params, values, step: stepIndex });
  }, [restored, params, values, stepIndex]);

  function set<K extends keyof PersonalizationDraft>(
    key: K,
    value: PersonalizationDraft[K],
  ) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  function validateCurrentStep(): boolean {
    const result = stepSchemas[step].safeParse(values);
    if (result.success) {
      setErrors({});
      return true;
    }

    const nextErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const field = String(issue.path[0] ?? 'form');
      // `issue.message` est une clé de traduction, pas une phrase.
      nextErrors[field] = issue.message;
    }
    setErrors(nextErrors);
    return false;
  }

  function goNext() {
    if (validateCurrentStep()) setStepIndex((index) => index + 1);
  }

  function goBack() {
    setErrors({});
    setStepIndex((index) => Math.max(0, index - 1));
  }

  /** Crée la commande puis ouvre la session de paiement Stripe. */
  async function submit() {
    if (!validateCurrentStep()) return;

    setSubmitting(true);
    setSubmitError(null);

    try {
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // Les paramètres produit sont transmis intacts au backend.
        body: JSON.stringify({ ...params, personalization: values }),
      });

      if (!orderResponse.ok) throw new Error('order_failed');
      const order = (await orderResponse.json()) as { id?: string };

      const checkoutResponse = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, ...params }),
      });

      if (!checkoutResponse.ok) throw new Error('checkout_failed');
      const checkout = (await checkoutResponse.json()) as { url?: string };

      if (!checkout.url) throw new Error('checkout_url_missing');

      clearDraft();
      window.location.assign(checkout.url);
    } catch {
      setSubmitError(t('..common.errors.unreachable'));
      setSubmitting(false);
    }
  }

  // Les messages zod sont déjà des clés absolues (`form.validation.*`) :
  // le préfixe `..` les laisse résoudre depuis la racine du dictionnaire.
  const errorFor = (field: string) =>
    errors[field] ? t(`..${errors[field]}`) : undefined;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (step === 'summary') void submit();
        else goNext();
      }}
    >
      <ProgressBar
        current={stepIndex}
        total={STEPS.length}
        label={t(`steps.${step}`)}
        stepLabel={t('progress')}
      />

      <Card className="mt-6">
        {step === 'child' ? (
          <fieldset className="space-y-6">
            <legend className="sr-only">{t('steps.child')}</legend>

            <Field
              htmlFor="firstName"
              label={t('fields.firstName')}
              hint={t('hints.firstName')}
              error={errorFor('firstName')}
            >
              <input
                id="firstName"
                type="text"
                value={values.firstName ?? ''}
                onChange={(event) => set('firstName', event.target.value)}
                aria-describedby="firstName-hint"
                className={controlClass}
              />
            </Field>

            <Field
              htmlFor="age"
              label={t('fields.age')}
              hint={t('hints.age')}
              error={errorFor('age')}
            >
              <input
                id="age"
                type="number"
                min={1}
                max={17}
                value={values.age ?? ''}
                onChange={(event) =>
                  set('age', event.target.value ? Number(event.target.value) : undefined)
                }
                aria-describedby="age-hint"
                className={cn(controlClass, 'max-w-[8rem]')}
              />
            </Field>

            <PhotoUpload
              photoId={values.photoId}
              onUploaded={(photoId) => set('photoId', photoId)}
            />
          </fieldset>
        ) : null}

        {step === 'story' ? (
          <fieldset className="space-y-6">
            <legend className="sr-only">{t('steps.story')}</legend>

            <Field
              htmlFor="interests"
              label={t('fields.interests')}
              hint={t('hints.interests')}
              error={errorFor('interests')}
            >
              <textarea
                id="interests"
                rows={4}
                value={values.interests ?? ''}
                onChange={(event) => set('interests', event.target.value)}
                aria-describedby="interests-hint"
                className={controlClass}
              />
            </Field>

            <Field
              htmlFor="universe"
              label={t('fields.universe')}
              hint={t('hints.universe')}
              error={errorFor('universe')}
            >
              <textarea
                id="universe"
                rows={4}
                value={values.universe ?? ''}
                onChange={(event) => set('universe', event.target.value)}
                aria-describedby="universe-hint"
                className={controlClass}
              />
            </Field>

            <Field
              htmlFor="themes"
              label={t('fields.themes')}
              hint={t('hints.themes')}
            >
              <textarea
                id="themes"
                rows={3}
                value={values.themes ?? ''}
                onChange={(event) => set('themes', event.target.value)}
                aria-describedby="themes-hint"
                className={controlClass}
              />
            </Field>
          </fieldset>
        ) : null}

        {step === 'style' ? (
          <fieldset>
            <legend className="text-sm font-semibold text-ink">
              {t('fields.style')}
            </legend>

            {/* Tuiles visuelles : le style se choisit à l'œil, pas au texte. */}
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {illustrationStyles.map((style) => {
                const selected = values.style === style;
                return (
                  <label
                    key={style}
                    htmlFor={`style-${style}`}
                    className={cn(
                      'cursor-pointer overflow-hidden bg-white text-center ring-1 transition-shadow',
                      selected
                        ? 'shadow-lifted ring-2 ring-accent-500'
                        : 'shadow-print ring-ink/10 hover:shadow-lifted',
                    )}
                  >
                    <input
                      id={`style-${style}`}
                      type="radio"
                      name="style"
                      value={style}
                      checked={selected}
                      onChange={() => set('style', style)}
                      className="sr-only"
                    />
                    <Placeholder
                      seed={`style-${style}`}
                      ratio="wide"
                      rounded="rounded-none"
                    />
                    <span className="flex items-center justify-center gap-1.5 p-3 text-sm font-medium text-ink">
                      {selected ? (
                        <Icon name="check" className="h-4 w-4 text-accent-700" />
                      ) : null}
                      {t(`..home.styles.items.${style}`)}
                    </span>
                  </label>
                );
              })}
            </div>

            {errorFor('style') ? (
              <p role="alert" className="mt-3 text-sm font-medium text-danger-700">
                {errorFor('style')}
              </p>
            ) : null}
          </fieldset>
        ) : null}

        {step === 'languages' ? (
          <fieldset className="space-y-6">
            <legend className="sr-only">{t('steps.languages')}</legend>

            <Field
              htmlFor="primaryLanguage"
              label={t('fields.primaryLanguage')}
              error={errorFor('primaryLanguage')}
            >
              <select
                id="primaryLanguage"
                value={values.primaryLanguage ?? ''}
                onChange={(event) => set('primaryLanguage', event.target.value)}
                className={cn(controlClass, 'form-select')}
              >
                <option value="">—</option>
                {locales.map((code) => (
                  <option key={code} value={code}>
                    {localeLabels[code]}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              htmlFor="secondaryLanguage"
              label={t('fields.secondaryLanguage')}
              hint={t('hints.secondaryLanguage')}
            >
              <select
                id="secondaryLanguage"
                value={values.secondaryLanguage ?? ''}
                onChange={(event) => set('secondaryLanguage', event.target.value)}
                aria-describedby="secondaryLanguage-hint"
                className={cn(controlClass, 'form-select')}
              >
                <option value="">—</option>
                {locales.map((code) => (
                  <option key={code} value={code}>
                    {localeLabels[code]}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              htmlFor="inclusion"
              label={t('fields.inclusion')}
              hint={t('hints.inclusion')}
            >
              <textarea
                id="inclusion"
                rows={3}
                value={values.inclusion ?? ''}
                onChange={(event) => set('inclusion', event.target.value)}
                aria-describedby="inclusion-hint"
                className={controlClass}
              />
            </Field>
          </fieldset>
        ) : null}

        {step === 'consent' ? (
          <fieldset className="space-y-5">
            <legend className="font-display text-xl font-bold text-ink">
              {t('consent.title')}
            </legend>

            <p className="text-ink-muted text-pretty">{t('consent.body')}</p>

            <label
              htmlFor="consent"
              className="flex cursor-pointer gap-3 bg-cream-50 p-4 border border-ink/15"
            >
              <input
                id="consent"
                type="checkbox"
                checked={values.consent === true}
                onChange={(event) =>
                  set('consent', event.target.checked ? true : undefined)
                }
                className="form-checkbox mt-0.5 h-5 w-5 rounded border-ink/20 text-accent-700 focus:ring-accent-600"
              />
              <span className="text-sm text-ink text-pretty">{t('consent.checkbox')}</span>
            </label>

            {errorFor('consent') ? (
              <p role="alert" className="text-sm font-medium text-danger-700">
                {errorFor('consent')}
              </p>
            ) : null}

            {values.photoId ? (
              <label
                htmlFor="photoConsent"
                className="flex cursor-pointer gap-3 bg-cream-50 p-4 border border-ink/15"
              >
                <input
                  id="photoConsent"
                  type="checkbox"
                  checked={values.photoConsent ?? false}
                  onChange={(event) => set('photoConsent', event.target.checked)}
                  className="form-checkbox mt-0.5 h-5 w-5 rounded border-ink/20 text-accent-700 focus:ring-accent-600"
                />
                <span className="text-sm text-ink text-pretty">
                  {t('consent.photoCheckbox')}
                </span>
              </label>
            ) : null}

            <p className="text-sm text-ink-soft">{t('consent.rights')}</p>
          </fieldset>
        ) : null}

        {step === 'summary' ? (
          <Summary
            params={params}
            values={values}
            onEdit={(index) => setStepIndex(index)}
          />
        ) : null}

        {submitError ? (
          <div className="mt-6">
            <Notice tone="error" role="alert">
              {submitError}
            </Notice>
          </div>
        ) : null}
      </Card>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {stepIndex > 0 ? (
          <Button type="button" variant="secondary" onClick={goBack}>
            {t('..common.actions.back')}
          </Button>
        ) : (
          <span />
        )}

        <Button type="submit" disabled={isSubmitting} size="lg">
          {step === 'summary' ? t('summary.submit') : t('..common.actions.next')}
          <Icon name="arrow-right" className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}

/** Progression du tunnel : repère visuel et annonce vocale. */
function ProgressBar({
  current,
  total,
  label,
  stepLabel,
}: {
  current: number;
  total: number;
  label: string;
  stepLabel: string;
}) {
  const percent = Math.round(((current + 1) / total) * 100);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="font-display text-lg font-bold text-ink">{label}</p>
        <p className="text-sm text-ink-soft" aria-live="polite">
          {stepLabel} {current + 1}/{total}
        </p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={current + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={stepLabel}
        className="mt-3 h-2 overflow-hidden border border-ink/15 bg-cream-100"
      >
        <div
          className="h-full bg-accent-500 transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
