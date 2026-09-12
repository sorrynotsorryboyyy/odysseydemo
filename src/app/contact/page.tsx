import type { Metadata } from 'next';

import { ContactForm } from '@/components/marketing/ContactForm';
import { Section, SectionHeading } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.contact.title'),
    description: translate(dictionary, 'meta.contact.description'),
    alternates: { canonical: '/contact' },
  };
}

export default async function ContactPage() {
  const dictionary = await getDictionary();

  return (
    <Section size="narrow" labelledBy="contact-title">
      <SectionHeading
        id="contact-title"
        as="h1"
        title={translate(dictionary, 'contact.title')}
        intro={translate(dictionary, 'contact.intro')}
      />
      <ContactForm />
    </Section>
  );
}
