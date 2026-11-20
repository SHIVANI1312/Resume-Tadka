/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        chilli: { DEFAULT: '#C93A26', bright: '#E34B36', dark: '#8E2A1B', light: '#FCE9E4' },
        turmeric: { DEFAULT: '#F4C542', light: '#FDF3D4', dark: '#8A6A0E' },
        cream: '#FFF9ED',
        charcoal: { DEFAULT: '#292521', soft: '#5A524B', muted: '#6B625A' },
        leaf: { DEFAULT: '#3F6B52', bright: '#54866A', light: '#E5F0E9', dark: '#2F5540' },
        line: '#F0E6D2',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 20px 50px rgba(41,37,33,.07)',
        soft: '0 6px 18px rgba(41,37,33,.08)',
      },
    },
  },
  plugins: [],
};
