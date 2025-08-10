/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{svelte,ts,js,md,svx}', './content/**/*.{md,svx}', './static/**/*.html'],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto','Inter','Noto Sans','Ubuntu','Cantarell','Helvetica Neue','Arial','sans-serif']
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem' }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')]
};
