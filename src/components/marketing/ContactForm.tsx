'use client';

import { useId, useState } from 'react';

import { Button, Card, controlClass, Field, Notice } from '@/components/ui';
import { useTranslations } from '@/i18n/TranslationsProvider';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const { t } = useTranslations('contact');
  const [status, setStatus] = useState<Status>('idle');
  const ids = {
    name: useId(),
    email: useId(),
    orderId: useId(),
    subject: useId(),
    message: useId(),
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      setStatus(response.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <Card>
        <Notice tone="success" role="status">
          {t('success')}
        </Notice>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={onSubmit} className="space-y-5">
        <Field htmlFor={ids.name} label={t('fields.name')}>
          <input
            id={ids.name}
            name="name"
            type="text"
            required
            autoComplete="name"
            className={controlClass}
          />
        </Field>

        <Field htmlFor={ids.email} label={t('fields.email')}>
          <input
            id={ids.email}
            name="email"
            type="email"
            required
            autoComplete="email"
            className={controlClass}
          />
        </Field>

        <Field htmlFor={ids.orderId} label={t('fields.orderId')}>
          <input id={ids.orderId} name="orderId" type="text" className={controlClass} />
        </Field>

        <Field htmlFor={ids.subject} label={t('fields.subject')}>
          <input
            id={ids.subject}
            name="subject"
            type="text"
            required
            className={controlClass}
          />
        </Field>

        <Field htmlFor={ids.message} label={t('fields.message')}>
          <textarea
            id={ids.message}
            name="message"
            rows={8}
            required
            className={controlClass}
          />
        </Field>

        {status === 'error' ? (
          <Notice tone="error" role="alert">
            {t('error')}
          </Notice>
        ) : null}

        <Button type="submit" disabled={status === 'sending'} fullWidth>
          {t('submit')}
        </Button>
      </form>
    </Card>
  );
}
