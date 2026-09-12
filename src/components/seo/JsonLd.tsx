import { jsonLd } from '@/lib/structuredData';

/**
 * Injecte un schéma schema.org dans la page.
 * Composant serveur : le balisage est présent dans le HTML initial, donc
 * lisible par les moteurs sans exécution de JavaScript.
 */
export function JsonLd({ schema }: { schema: object }) {
  return (
    <script
      type="application/ld+json"
      // Contenu généré par nous à partir du dictionnaire, jamais d'une saisie
      // utilisateur ; `jsonLd` échappe malgré tout les chevrons.
      dangerouslySetInnerHTML={jsonLd(schema)}
    />
  );
}
