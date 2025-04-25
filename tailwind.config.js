// tailwind.config.js
import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'
import flowbitePlugin from 'flowbite/plugin'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",       // React components
    "./src/docs/**/*.md",                // vos fichiers Markdown dans src/docs
    "./public/docs/**/*.md",             // ou dans public/docs si vous les y stockez
    "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Manrope',
          'ui-sans-serif',
          'system-ui',
        ],
      },
    },
  },
  plugins: [
    animate,
    typography,
    flowbitePlugin,  // si vous utilisez Flowbite
  ],
}