/** @type {import('tailwindcss').Config} */
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

module.exports = {
  content: ['./src/**/*.{svelte,ts,js,md,svx}', './content/**/*.{md,svx}', './static/**/*.html'],
  darkMode: ['class'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Lato', 'ui-sans-serif','system-ui','-apple-system','Segoe UI','Roboto','Inter','Noto Sans','Ubuntu','Cantarell','Helvetica Neue','Arial','sans-serif'],
        mono: ['"Fira Code"', '"JetBrains Mono"', '"Courier New"', 'Courier', 'monospace']
      },
      colors: {
        terminal: {
          black: withOpacity('--color-terminal-black'),
          dark: '#1e1e1e',
          green: withOpacity('--color-terminal-accent'),
          dim: '#2d2d2d',
          text: '#cccccc'
        },
        skin: {
          page: withOpacity('--color-bg-page'),
          base: withOpacity('--color-text-base'),
          muted: withOpacity('--color-text-muted'),
          border: withOpacity('--color-border'),
          accent: withOpacity('--color-accent'),
          'accent-contrast': withOpacity('--color-accent-contrast'),
        }
      },
      borderRadius: { xl: '1rem', '2xl': '1.25rem' },
      keyframes: {
        'terminal-blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      },
      animation: {
        'terminal-blink': 'terminal-blink 1s step-end infinite',
      }
    }
  },
  plugins: [require('@tailwindcss/typography'), require('tailwindcss-animate')]
};
