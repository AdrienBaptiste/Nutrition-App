/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Forcer la génération de certaines classes
      height: {
        '24': '6rem',
      },
      padding: {
        '8': '2rem',
      }
    },
  },
  plugins: [],
  // Safelist pour forcer la génération de classes spécifiques
  safelist: [
    'h-12',
    'h-24',
    'p-8',
    'pl-0',
    'w-auto',
    'hover:opacity-80',
    'transition-opacity',
    'duration-200'
  ]
}
