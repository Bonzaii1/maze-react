/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'moonlit-1': '#0f2027',
        'moonlit-2': '#203a43',
        'moonlit-3': '#2c5364',
        'title-text': '#beb7a4',
        'columbia_blue': '#9BDDFF'
      },
      fontFamily: {
        'Merriweather': ['Merriweather', 'sans-serif']
      }
    },
  },
  plugins: [],
}

