/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#a40b0b',
          50: '#fdf2f2',
          100: '#fbe5e5',
          200: '#f6ced0',
          300: '#efa8aa',
          400: '#e57579',
          500: '#d9474d',
          600: '#c3282f',
          700: '#a40b0b',
          800: '#880e10',
          900: '#711013',
          950: '#3e0405',
        }
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      }
    },
  },
  plugins: [],
}
