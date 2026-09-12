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
          soft: '#71717a',
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
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgb(26 26 26 / 0.06), 0 4px 24px -4px rgb(26 26 26 / 0.05)',
        lift: '0 8px 28px -6px rgb(26 26 26 / 0.12), 0 2px 8px -2px rgb(26 26 26 / 0.06)',
        glow: '0 10px 32px -8px rgb(20 184 166 / 0.35)',
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
      animation: {
        'fade-up': 'fade-up 0.4s ease-out both',
      },
    },
  },
  plugins: [forms({ strategy: 'class' })],
};

export default config;
