/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'coris-blue': '#002855',
        'coris-blue-light': '#1e3a8a',
        'coris-red': '#E30613',
        'coris-red-dark': '#c80510',
      }
    },
  },
  plugins: [],
}
