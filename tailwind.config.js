/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite-react/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Manrope',
  				'ui-sans-serif',
  				'system-ui'
  			]
  		},
  	}
  },
  plugins: [import("tailwindcss-animate")],
};