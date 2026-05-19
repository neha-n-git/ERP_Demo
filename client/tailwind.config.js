/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D2C54', // SJHIF Navy
        secondary: '#F2F3F5', // Light Grey Background
        accent: '#10B981', // Emerald Green CTA
        'accent-light': '#D1FAE5',
        'primary-light': '#1E40AF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
