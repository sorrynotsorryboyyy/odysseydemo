/**
 * Concatène des classes conditionnelles en résolvant les conflits Tailwind.
 *
 * Deux utilitaires du même groupe (`bg-white` et `bg-ink`) ont la même
 * spécificité CSS : c'est leur ordre dans la feuille compilée qui tranche,
 * pas leur ordre dans l'attribut `class`. Laisser les deux produit donc un
 * résultat imprévisible — d'où cette déduplication par groupe, où la
 * dernière classe déclarée l'emporte, comme on s'y attend.
 */

/** Préfixes dont une seule occurrence doit survivre. */
const GROUPS = [
  'bg',
  'text',
  'ring',
  'shadow',
  'border',
  'rounded',
  'p',
  'px',
  'py',
  'pt',
  'pr',
  'pb',
  'pl',
  'm',
  'mx',
  'my',
  'mt',
  'mr',
  'mb',
  'ml',
  'w',
  'h',
  'gap',
  'grid-cols',
  'items',
  'justify',
] as const;

/**
 * Identifie le groupe d'une classe, en tenant compte des variantes
 * (`hover:`, `sm:`, `lg:`…) qui ne se concurrencent pas entre elles.
 */
function groupOf(className: string): string | null {
  const colon = className.lastIndexOf(':');
  const variant = colon === -1 ? '' : className.slice(0, colon + 1);
  const base = colon === -1 ? className : className.slice(colon + 1);

  // `text-cream` (couleur) et `text-lg` (taille) ne sont pas en conflit,
  // mais les distinguer demanderait la table complète de Tailwind. On ne
  // dédoublonne donc que les couleurs de texte, reconnues par leur préfixe.
  if (base.startsWith('text-')) {
    const isColor = /^text-(ink|cream|accent|warm|danger|white|black)(-|\/|$)/.test(base);
    return isColor ? `${variant}text-color` : null;
  }

  for (const group of GROUPS) {
    if (base === group || base.startsWith(`${group}-`)) {
      // `ring-ink/5` (couleur) vs `ring-2` (épaisseur) : deux axes distincts,
      // qui ne doivent pas s'éliminer l'un l'autre. Idem pour `border`.
      if (group === 'ring' || group === 'border') {
        const isWidth = new RegExp(`^${group}(-\\d+)?$`).test(base);
        return `${variant}${group}-${isWidth ? 'width' : 'color'}`;
      }
      return `${variant}${group}`;
    }
  }

  return null;
}

export function cn(...values: Array<string | false | null | undefined>): string {
  const classes = values
    .filter((value): value is string => Boolean(value))
    .flatMap((value) => value.split(/\s+/))
    .filter(Boolean);

  const seen = new Map<string, number>();
  const result: Array<string | null> = [];

  for (const className of classes) {
    const group = groupOf(className);

    if (group) {
      const previous = seen.get(group);
      // La dernière déclaration gagne : on neutralise la précédente.
      if (previous !== undefined) result[previous] = null;
      seen.set(group, result.length);
    }

    result.push(className);
  }

  return result.filter(Boolean).join(' ');
}
