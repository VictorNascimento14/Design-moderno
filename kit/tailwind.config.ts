/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // O tema escuro entra pela classe `dark` no <html>, escrita por
  // `src/lib/tema.ts`. Não é `media`: o usuário escolhe, e a preferência do
  // sistema é só o palpite inicial.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // `bg-surface/70` é o campo e o cabeçalho de tabela sobre o vidro —
        // branco no tema claro, quase preto no escuro. `white` continua sendo
        // branco de verdade, para tinta sobre pílula colorida.
        surface: 'rgb(var(--surface) / <alpha-value>)',
        // `red` e `orange` passam a sair das rampas de `src/index.css` para
        // acompanharem o tema. Os valores claros são os mesmos do Tailwind.
        red: {
          50: 'oklch(var(--red-50) / <alpha-value>)',
          100: 'oklch(var(--red-100) / <alpha-value>)',
          200: 'oklch(var(--red-200) / <alpha-value>)',
          300: 'oklch(var(--red-300) / <alpha-value>)',
          400: 'oklch(var(--red-400) / <alpha-value>)',
          500: 'oklch(var(--red-500) / <alpha-value>)',
          600: 'oklch(var(--red-600) / <alpha-value>)',
          700: 'oklch(var(--red-700) / <alpha-value>)',
          800: 'oklch(var(--red-800) / <alpha-value>)',
          900: 'oklch(var(--red-900) / <alpha-value>)',
          950: 'oklch(var(--red-950) / <alpha-value>)',
        },
        orange: {
          50: 'oklch(var(--orange-50) / <alpha-value>)',
          100: 'oklch(var(--orange-100) / <alpha-value>)',
          200: 'oklch(var(--orange-200) / <alpha-value>)',
          300: 'oklch(var(--orange-300) / <alpha-value>)',
          400: 'oklch(var(--orange-400) / <alpha-value>)',
          500: 'oklch(var(--orange-500) / <alpha-value>)',
          600: 'oklch(var(--orange-600) / <alpha-value>)',
          700: 'oklch(var(--orange-700) / <alpha-value>)',
          800: 'oklch(var(--orange-800) / <alpha-value>)',
          900: 'oklch(var(--orange-900) / <alpha-value>)',
          950: 'oklch(var(--orange-950) / <alpha-value>)',
        },
        background: {
          50: 'oklch(var(--background-50) / <alpha-value>)',
          100: 'oklch(var(--background-100) / <alpha-value>)',
          200: 'oklch(var(--background-200) / <alpha-value>)',
          300: 'oklch(var(--background-300) / <alpha-value>)',
          400: 'oklch(var(--background-400) / <alpha-value>)',
          500: 'oklch(var(--background-500) / <alpha-value>)',
          600: 'oklch(var(--background-600) / <alpha-value>)',
          700: 'oklch(var(--background-700) / <alpha-value>)',
          800: 'oklch(var(--background-800) / <alpha-value>)',
          900: 'oklch(var(--background-900) / <alpha-value>)',
          950: 'oklch(var(--background-950) / <alpha-value>)',
        },
        accent: {
          50: 'oklch(var(--accent-50) / <alpha-value>)',
          100: 'oklch(var(--accent-100) / <alpha-value>)',
          200: 'oklch(var(--accent-200) / <alpha-value>)',
          300: 'oklch(var(--accent-300) / <alpha-value>)',
          400: 'oklch(var(--accent-400) / <alpha-value>)',
          500: 'oklch(var(--accent-500) / <alpha-value>)',
          600: 'oklch(var(--accent-600) / <alpha-value>)',
          700: 'oklch(var(--accent-700) / <alpha-value>)',
          800: 'oklch(var(--accent-800) / <alpha-value>)',
          900: 'oklch(var(--accent-900) / <alpha-value>)',
          950: 'oklch(var(--accent-950) / <alpha-value>)',
        },
        primary: {
          50: 'oklch(var(--primary-50) / <alpha-value>)',
          100: 'oklch(var(--primary-100) / <alpha-value>)',
          200: 'oklch(var(--primary-200) / <alpha-value>)',
          300: 'oklch(var(--primary-300) / <alpha-value>)',
          400: 'oklch(var(--primary-400) / <alpha-value>)',
          500: 'oklch(var(--primary-500) / <alpha-value>)',
          600: 'oklch(var(--primary-600) / <alpha-value>)',
          700: 'oklch(var(--primary-700) / <alpha-value>)',
          800: 'oklch(var(--primary-800) / <alpha-value>)',
          900: 'oklch(var(--primary-900) / <alpha-value>)',
          950: 'oklch(var(--primary-950) / <alpha-value>)',
        },
        secondary: {
          50: 'oklch(var(--secondary-50) / <alpha-value>)',
          100: 'oklch(var(--secondary-100) / <alpha-value>)',
          200: 'oklch(var(--secondary-200) / <alpha-value>)',
          300: 'oklch(var(--secondary-300) / <alpha-value>)',
          400: 'oklch(var(--secondary-400) / <alpha-value>)',
          500: 'oklch(var(--secondary-500) / <alpha-value>)',
          600: 'oklch(var(--secondary-600) / <alpha-value>)',
          700: 'oklch(var(--secondary-700) / <alpha-value>)',
          800: 'oklch(var(--secondary-800) / <alpha-value>)',
          900: 'oklch(var(--secondary-900) / <alpha-value>)',
          950: 'oklch(var(--secondary-950) / <alpha-value>)',
        },
        foreground: {
          50: 'oklch(var(--foreground-50) / <alpha-value>)',
          100: 'oklch(var(--foreground-100) / <alpha-value>)',
          200: 'oklch(var(--foreground-200) / <alpha-value>)',
          300: 'oklch(var(--foreground-300) / <alpha-value>)',
          400: 'oklch(var(--foreground-400) / <alpha-value>)',
          500: 'oklch(var(--foreground-500) / <alpha-value>)',
          600: 'oklch(var(--foreground-600) / <alpha-value>)',
          700: 'oklch(var(--foreground-700) / <alpha-value>)',
          800: 'oklch(var(--foreground-800) / <alpha-value>)',
          900: 'oklch(var(--foreground-900) / <alpha-value>)',
          950: 'oklch(var(--foreground-950) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        display: ['var(--font-heading)', 'sans-serif'],
        serif: ['var(--font-heading)', 'sans-serif'],
        label: ['var(--font-label)', 'sans-serif'],
      },
      // Raios do design: 26px nos cartões, 28px na coluna/rail.
      borderRadius: {
        card: '26px',
        rail: '28px',
      },
      // Elevações do vidro — tinta esverdeada, nunca preto puro.
      boxShadow: {
        glass: '0 12px 30px rgb(var(--glass-ink) / 0.09)',
        'glass-lg': '0 20px 44px rgb(var(--glass-ink) / 0.14)',
        pill: '0 8px 20px rgb(var(--glass-ink) / 0.07)',
        'nav-active': '0 6px 14px rgb(var(--nav-ink) / 0.26)',
      },
      transitionTimingFunction: {
        organic: 'cubic-bezier(0.22, 0.68, 0, 1)',
      },
      transitionDuration: {
        open: '520ms',
        close: '420ms',
      },
      keyframes: {
        rise: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.985)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.7)' },
          '70%': { opacity: '1', transform: 'scale(1.06)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        rise: 'rise 620ms cubic-bezier(0.22, 0.68, 0, 1) backwards',
        pop: 'pop-in 420ms cubic-bezier(0.22, 0.68, 0, 1) backwards',
      },
    },
  },
  plugins: [],
}