'use client';

import { useState } from 'react';

import { Field, Icon } from '@/components/ui';
import { useTranslations } from '@/i18n/TranslationsProvider';
import { cn } from '@/lib/cn';
import { ACCEPTED_PHOTO_TYPES, validatePhoto } from '@/lib/validation';

/**
 * Photo de référence, facultative.
 * L'aide de champ dit explicitement qu'elle n'est jamais reproduite à
 * l'identique : c'est une promesse du produit, pas un détail d'interface.
 */
export function PhotoUpload({
  photoId,
  onUploaded,
}: {
  photoId?: string;
  onUploaded: (photoId: string | undefined) => void;
}) {
  const { t } = useTranslations('form');
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) {
      onUploaded(undefined);
      setFileName(null);
      return;
    }

    const validationKey = validatePhoto(file);
    if (validationKey) {
      setError(validationKey);
      event.target.value = '';
      return;
    }

    setUploading(true);
    try {
      const body = new FormData();
      body.append('photo', file);

      const response = await fetch('/api/upload/photo', { method: 'POST', body });
      if (!response.ok) throw new Error('upload_failed');

      const result = (await response.json()) as { photoId?: string };
      onUploaded(result.photoId);
      setFileName(file.name);
    } catch {
      setError('form.validation.photoType');
      event.target.value = '';
    } finally {
      setUploading(false);
    }
  }

  return (
    <Field
      htmlFor="photo"
      label={t('fields.photo')}
      hint={t('hints.photo')}
      error={error ? t(`..${error}`) : undefined}
    >
      <label
        htmlFor="photo"
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-ink/15 bg-cream-50 px-6 py-8 text-center transition-colors hover:border-accent-400 hover:bg-accent-50',
          isUploading && 'opacity-60',
        )}
      >
        <Icon name="sparkle" className="h-6 w-6 text-accent-700" />
        <span className="text-sm font-medium text-ink">
          {photoId && fileName ? fileName : t('photoPrompt')}
        </span>
        {photoId ? (
          <span className="text-xs text-warm-700" role="status">
            {t('photoUploaded')}
          </span>
        ) : null}

        <input
          id="photo"
          type="file"
          accept={ACCEPTED_PHOTO_TYPES.join(',')}
          onChange={onChange}
          disabled={isUploading}
          aria-describedby="photo-hint"
          className="sr-only"
        />
      </label>
    </Field>
  );
}
