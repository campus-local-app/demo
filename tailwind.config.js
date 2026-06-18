/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#3B6CF4',
          600: '#2d57e0',
          700: '#2445c7',
          800: '#1e38a0',
          900: '#1a2f80',
        },
        cy: {
          orange: '#FF6B35',
          coral: '#FF8C69',
          skin: '#FFEEE4',
          cream: '#FFF8F2',
          brown: '#8B5E3C',
          'dark-brown': '#5C3D2E',
          peach: '#FFD4B8',
        },
      },
      fontFamily: {
        cyworld: ['Galmuri11', 'DungGeunMo', 'monospace'],
      },
      boxShadow: {
        'cy-window': '2px 2px 0px #8B5E3C, inset 1px 1px 0px #FFD4B8',
        'cy-inset': 'inset 2px 2px 4px rgba(139,94,60,0.15), inset -1px -1px 2px rgba(255,255,255,0.8)',
      },
    },
  },
  plugins: [],
}
