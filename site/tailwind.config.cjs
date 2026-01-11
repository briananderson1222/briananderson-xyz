/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{svelte,ts,js,md,svx}', './content/**/*.{md,svx}', './static/**/*.html'],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto','Inter','Noto Sans','Ubuntu','Cantarell','Helvetica Neue','Arial','sans-serif'],
        mono: ['"Fira Code"', '"JetBrains Mono"', '"Courier New"', 'Courier', 'monospace']
      },
      colors: {
        terminal: {
          black: '#0c0c0c',
          dark: '#1e1e1e',
          green: '#4af626',
          dim: '#2d2d2d',
          text: '#cccccc'
        }
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem' }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')]
};
