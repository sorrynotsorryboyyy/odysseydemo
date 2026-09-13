import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

/**
 * Tokens sémantiques Taletto : le thème se pilote depuis ce seul fichier.
 *
 * `accent` (sarcelle) porte l'identité ; `warm` (corail), son complémentaire
 * sur la roue chromatique, équilibre les grandes surfaces froides.
 *
 * Contrastes vérifiés (WCAG AA) sur fond crème #faf8f0 :
 *   ink/cream 16.37 · ink-muted 7.27 · accent-700 5.15 · warm-700 5.62
 * Sur aplat accent-500 (#14b8a6) : ink 6.99 — les boutons portent du texte
 * encre, jamais blanc.
 *
 * Mode clair uniquement : aucune variante sombre n'est définie.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fond « papier » : legerement plus chaud que le blanc, il donne aux
        // sections alternees une respiration sans recourir a un degrade.
        paper: '#f4f1e6',
        cream: {
          DEFAULT: '#faf8f0',
          50: '#fdfcf8',
          100: '#faf8f0',
          200: '#f3eede',
          300: '#e8dfc6',
        },
        ink: {
          DEFAULT: '#1a1a1a',
          muted: '#52525b',
          soft: '#6b6b74',
        },
        // Sarcelle : couleur d'identité de la marque.
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        /**
         * Jaune : aplat clair. Texte encre dessus (contraste 10.43).
         * Sert les sections de découverte, jamais un message d'état.
         */
        sun: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          500: '#fbbf24',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        /**
         * Bleu nuit : aplat sombre. Texte crème dessus (contraste 9.74).
         * Donne du poids aux sections d'engagement.
         */
        night: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Rouge : réservé aux erreurs et actions destructives. Hors marque,
        // parce qu'un signal d'alerte doit être compris sans apprentissage.
        danger: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          500: '#ef4444',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Corail : complémentaire chaud, pour équilibrer la sarcelle.
        warm: {
          50: '#fef3f0',
          100: '#fde3dc',
          200: '#fbc7ba',
          300: '#f8a48e',
          400: '#f58466',
          500: '#f2643f',
          600: '#d94e2b',
          700: '#b23a1c',
          800: '#8f2f16',
          900: '#701f0c',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      /**
       * Registre album : des formes tenues, ni sévères ni molles. Au-delà
       * de 24px un bloc devient une pastille, ce qui est le marqueur
       * générique qu'on cherche à éviter.
       */
      /**
       * Le trait dessine la forme ; l'arrondi l'adoucit juste assez pour
       * que le registre reste celui d'un album, pas d'un formulaire.
       */
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
      },
      /**
       * Ombres teintées de l'aplat voisin plutôt que grises : une ombre
       * neutre sur un fond coloré se lit comme de la saleté.
       */
      /**
       * Registre ligne claire : le cerne noir porte la forme, l'ombre ne
       * fait que décoller l'élément du fond. Décalée et sans flou, elle
       * reste dans le langage du dessin au trait.
       */
      boxShadow: {
        edge: '0 1px 0 0 rgb(26 26 26 / 0.08)',
        ink: '4px 4px 0 0 rgb(26 26 26)',
        'ink-sm': '2px 2px 0 0 rgb(26 26 26)',
        'ink-lg': '7px 7px 0 0 rgb(26 26 26)',
        teal: '4px 4px 0 0 rgb(15 118 110)',
        coral: '4px 4px 0 0 rgb(178 58 28)',
      },
      borderWidth: {
        // Le cerne de la ligne claire : assez présent pour se lire, assez
        // fin pour ne pas écraser une page de texte.
        DEFAULT: '1px',
        2: '2px',
        3: '3px',
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(0.5rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      // Profondeur du livre 3D : suffisante pour lire l'objet, assez faible
      // pour eviter la deformation en fish-eye.
      perspective: {
        book: '1400px',
      },
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [forms({ strategy: 'class' })],
};

export default config;
