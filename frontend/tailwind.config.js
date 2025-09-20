/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./html/**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        'primary': '#6B21A8',
        'secondary': '#1E40AF',
        'accent': '#EC4899',
        'neutral': '#F3F4F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}