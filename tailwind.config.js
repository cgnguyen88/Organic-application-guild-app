/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'u-navy': '#002D54',
        'u-navy-d': '#001A31',
        'u-gold': '#FDBD10',
        'u-sky': '#3AA8E4',
        'u-green': '#1B6B2E',
      },
    },
  },
  plugins: [],
}

