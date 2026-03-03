/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './src/styles/**/*.{css}',
    './public/index.html',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3B82F6', // blue-500
          secondary: '#1F2937', // gray-800
        },
        yellow: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};