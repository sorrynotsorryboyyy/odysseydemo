import Link from 'next/link';

import { MobileMenu } from './MobileMenu';
import { Container, ButtonLink, Icon } from '@/components/ui';
import { translate, type Dictionary } from '@/i18n/getDictionary';

import { LocaleSwitcher } from './LocaleSwitcher';

/** Liens de navigation principaux, partagés avec le menu mobile. */
export const navLinks = [
  { href: '/tarifs', key: 'common.nav.pricing' },
  { href: '/pack', key: 'common.nav.pack' },
  { href: '/faq', key: 'common.nav.faq' },
  { href: '/contact', key: 'common.nav.contact' },
] as const;

export function Header({ dictionary }: { dictionary: Dictionary }) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-md">
      <Container size="wide">
        <div className="flex h-16 items-center justify-between gap-4 sm:h-20">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-xl font-bold text-ink sm:text-2xl"
          >
            <Icon name="sparkle" filled className="h-6 w-6 text-accent-500" />
            {t('common.brand')}
          </Link>

          <nav aria-label={t('common.nav.primary')} className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-full px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-white hover:text-ink"
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <LocaleSwitcher label={t('common.footer.language')} />
            <Link
              href="/compte/connexion"
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-muted transition-colors hover:bg-white hover:text-ink"
            >
              {t('common.nav.login')}
            </Link>
            <ButtonLink href="/tarifs" size="sm">
              {t('common.cta.start')}
            </ButtonLink>
          </div>

          <MobileMenu
            labels={{
              open: t('common.nav.openMenu'),
              close: t('common.nav.closeMenu'),
              login: t('common.nav.login'),
              library: t('common.nav.library'),
              cta: t('common.cta.start'),
              language: t('common.footer.language'),
              nav: t('common.nav.primary'),
            }}
            links={navLinks.map((link) => ({ href: link.href, label: t(link.key) }))}
          />
        </div>
      </Container>
    </header>
  );
}
