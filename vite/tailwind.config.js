/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./packages/**/*.{vue,js,ts,jsx,tsx}','./src/**/*.{vue,js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins:{
    // preflight: false,
  }
}

