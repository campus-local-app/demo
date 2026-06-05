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
      },
    },
  },
  plugins: [],
}
