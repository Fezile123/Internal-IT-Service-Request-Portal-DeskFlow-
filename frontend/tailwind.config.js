/** @type {import('tailwindcss').Config} */

export default {
  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },

        surface: {
          DEFAULT: '#0B1220',
          panel: '#111827',
          border: '#1F2937',
        },
      },

      boxShadow: {
        card:
          '0 10px 30px rgba(0,0,0,0.25)',
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },

      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },

  plugins: [],
};