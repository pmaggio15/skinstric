/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': '10px',
        '3xs': '8px',
      },
      fontFamily: {
        'roobert': ['Roobert', 'sans-serif']
      }
    },
  },
  plugins: [],
}