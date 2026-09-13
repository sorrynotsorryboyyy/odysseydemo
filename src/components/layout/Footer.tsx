import Link from 'next/link';

import { Container, Icon } from '@/components/ui';
import { translate, type Dictionary } from '@/i18n/getDictionary';
import { readSession } from '@/server/lib/session';

const columns = [
  {
    titleKey: 'common.footer.discover',
    links: [
      { href: '/tarifs', key: 'common.nav.pricing' },
      { href: '/pack', key: 'common.nav.pack' },
      { href: '/faq', key: 'common.nav.faq' },
    ],
  },
  {
    titleKey: 'common.footer.account',
    // Le second lien dépend de la session : « Paramètres » une fois
    // connecté, « Connexion » sinon. Voir `accountLinks` ci-dessous.
    links: [
      { href: '/compte/bibliotheque', key: 'common.nav.library' },
      { href: '__account__', key: '__account__' },
      { href: '/contact', key: 'common.nav.contact' },
    ],
  },
  {
    titleKey: 'common.footer.legal',
    links: [
      { href: '/legal/cgv', key: 'common.footer.cgv' },
      { href: '/legal/confidentialite', key: 'common.footer.privacy' },
      { href: '/legal/remboursements', key: 'common.footer.refunds' },
    ],
  },
] as const;

export async function Footer({ dictionary }: { dictionary: Dictionary }) {
  const t = (key: string) => translate(dictionary, key);

  const session = await readSession();

  // Proposer « Connexion » à quelqu'un de déjà connecté serait incohérent.
  const accountLink = session
    ? { href: '/compte/parametres', label: t('account.settings.title') }
    : { href: '/compte/connexion', label: t('common.nav.login') };

  return (
    <footer className="mt-auto border-t border-warm-100 bg-white">
      <Container size="wide">
        <div className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="flex items-center gap-2 font-display text-xl font-bold text-ink">
              <Icon name="sparkle" filled className="h-5 w-5 text-warm-700" />
              {t('common.brand')}
            </p>
            <p className="mt-3 max-w-xs text-sm text-ink-muted text-pretty">
              {t('common.footer.tagline')}
            </p>
          </div>

          {columns.map((column) => (
            <nav key={column.titleKey} aria-labelledby={`footer-${column.titleKey}`}>
              <h2
                id={`footer-${column.titleKey}`}
                className="font-display text-sm font-bold uppercase tracking-wider text-ink"
              >
                {t(column.titleKey)}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => {
                  const resolved =
                    link.href === '__account__'
                      ? accountLink
                      : { href: link.href, label: t(link.key) };

                  return (
                    <li key={resolved.href}>
                      <Link
                        href={resolved.href}
                        className="text-sm text-ink-muted transition-colors hover:text-warm-700"
                      >
                        {resolved.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-warm-100 py-6">
          <p className="text-sm text-ink-soft">
            © {new Date().getFullYear()} {t('common.brand')}. {t('common.footer.rights')}
          </p>
        </div>
      </Container>
    </footer>
  );
}
