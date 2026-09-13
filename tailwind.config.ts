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
        /**
         * Corail : couleur principale de la marque, employée en grands
         * aplats avec le blanc. Les tons 25 à 100 servent de fonds de
         * section et de blocs ; 500 et au-delà portent les actions.
         */
        warm: {
          25: '#fffaf8',
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
       * Formes franchement arrondies, registre e-commerce jeunesse : la
       * douceur vient du rayon, plus du trait. On s'arrête à 20px — au-delà
       * un bloc devient une pastille, marqueur générique qu'on évite.
       */
      borderRadius: {
        none: '0',
        sm: '4px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '20px',
        '3xl': '24px',
        pill: '999px',
      },
      /**
       * La carte se détache par une ombre douce et basse, pas par un cerne :
       * c'est ce qui donne au registre sa légèreté. Le relief reste discret
       * — une ombre trop marquée sur fond pâle se lit comme de la saleté.
       */
      boxShadow: {
        edge: '0 1px 0 0 rgb(26 26 26 / 0.06)',
        card: '0 4px 20px 0 rgb(26 26 26 / 0.08)',
        'card-hover': '0 10px 30px 0 rgb(26 26 26 / 0.13)',
        float: '0 16px 44px 0 rgb(26 26 26 / 0.16)',
      },
      borderWidth: {
        // Le filet de 2px sert à cerner un bloc pâle sur fond blanc, là où
        // l'ombre ne suffit pas à séparer deux surfaces claires.
        DEFAULT: '1px',
        2: '2px',
      },
      maxWidth: {
        prose: '68ch',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(1.25rem)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        /** Respiration du livre : une amplitude faible, sinon ça tangue. */
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-0.75rem)' },
        },
        /** Halos de fond : dérive lente, jamais un mouvement qu'on suit. */
        drift: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(3%, -4%) scale(1.06)' },
          '66%': { transform: 'translate(-3%, 3%) scale(0.96)' },
        },
        'draw-line': {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
      },
      // Profondeur du livre 3D : suffisante pour lire l'objet, assez faible
      // pour eviter la deformation en fish-eye.
      perspective: {
        book: '1400px',
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        // Durées très longues : un mouvement de fond doit se sentir, pas se
        // regarder. En dessous de 20s l'œil se met à le suivre.
        float: 'float 7s ease-in-out infinite',
        drift: 'drift 26s ease-in-out infinite',
        'drift-slow': 'drift 38s ease-in-out infinite reverse',
        'draw-line': 'draw-line 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [forms({ strategy: 'class' })],
};

export default config;
