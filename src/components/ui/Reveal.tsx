'use client';

import { useEffect, useRef, useState } from 'react';
import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/cn';

/**
 * Révèle son contenu quand il entre dans le champ de vision.
 *
 * Trois garde-fous, parce qu'une animation d'apparition mal faite cache du
 * contenu au lieu de le mettre en valeur :
 *
 * - l'état initial n'est appliqué qu'une fois le composant monté, donc le
 *   texte reste visible si JavaScript ne s'exécute pas ;
 * - `prefers-reduced-motion` court-circuite tout, sans attendre
 *   l'observateur ;
 * - l'observateur se déconnecte après le premier passage : l'élément ne
 *   rejoue pas l'animation à chaque aller-retour de défilement.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  /** Décalage en ms, pour échelonner les éléments d'une grille. */
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setShown(true);
      return;
    }

    // Armé seulement maintenant : avant le montage, le contenu est visible.
    setArmed(true);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          setShown(true);
          observer.disconnect();
        }
      },
      // Déclenché un peu avant l'entrée réelle : l'élément est déjà en
      // place quand le regard l'atteint.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn(
        armed && !shown && 'opacity-0',
        shown && 'animate-fade-up',
        className,
      )}
      style={shown && delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
