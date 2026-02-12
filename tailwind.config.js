/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'speccon-blue': '#1e3a8a',
        'speccon-blue-light': '#3b82f6',
      }
    },
  },
  plugins: [],
}
