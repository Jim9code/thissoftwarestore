/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#F4F6F3',
          100: '#E5EAE3',
          200: '#CBD5C8',
          300: '#A9B9A5',
          400: '#859A81',
          500: '#6B8068',
          600: '#546652',
          700: '#435141',
          800: '#374236',
          900: '#2E372D',
        },
        walnut: {
          50: '#F8F5F2',
          100: '#EFE8E1',
          200: '#DDD0C3',
          300: '#C5B09B',
          400: '#AA8C72',
          500: '#8E6D52',
          600: '#74563F',
          700: '#5C4331',
          800: '#422F22',
          900: '#2A1D15',
          950: '#160E09',
        },
        amber: {
          glow: '#E59838',
          molten: '#F5A623',
          sun: '#FFCC70',
        },
        sand: {
          light: '#F6F2EA',
          warm: '#EDE5D5',
          dune: '#D8C3A5',
          ochre: '#C29B6B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['"Syne"', '"Plus Jakarta Sans"', 'sans-serif'],
        sand: ['"Titan One"', '"Fredoka"', '"Lilita One"', 'cursive', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        'lux': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      }
    },
  },
  plugins: [],
}

