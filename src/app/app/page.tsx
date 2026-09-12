import type { Metadata } from 'next';

import { Wizard } from '@/components/form/Wizard';
import { Section, SectionHeading } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';
import { parseProductParams } from '@/lib/products';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.form.title'),
    description: translate(dictionary, 'meta.form.description'),
    // Le tunnel n'a pas vocation à être indexé.
    robots: { index: false, follow: false },
  };
}

export default async function PersonalizationPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const dictionary = await getDictionary();
  // `product`, `print` et `cahier` viennent de l'URL et sont transmis intacts.
  const params = parseProductParams(searchParams);

  return (
    <Section size="narrow" labelledBy="form-title">
      <SectionHeading
        id="form-title"
        as="h1"
        title={translate(dictionary, 'form.title')}
        intro={translate(dictionary, 'form.intro')}
      />
      <Wizard params={params} />
    </Section>
  );
}
