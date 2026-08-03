/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ───────────────────────────────────────────────────────────────
        // Brand palette — AIMpower flyer green (#3F6A52 at 600). This is the
        // accent colour: buttons, links, eyebrows, tags, focus, active states.
        // ───────────────────────────────────────────────────────────────
        brand: {
          50: '#EEF4F0',
          100: '#D5E4DB',
          200: '#ABC8B7',
          300: '#82AC93',
          400: '#5C8C71',
          500: '#47755B',
          600: '#3F6A52',
          700: '#345742',
          800: '#2A4636',
          900: '#23392D',
        },
        // Flyer blush pink — used as the soft surface / background tint.
        blush: {
          DEFAULT: '#F8E1E0',
          soft: '#FBECEB',
        },
      },
    },
  },
  plugins: [],
};
