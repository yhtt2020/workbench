/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', './packages/**/*.{vue,js,ts,jsx,tsx}'],
  content: ['./packages/**/*.{vue,js,ts,jsx,tsx}','./src/**/*.{vue,js,ts,jsx,tsx}', './index.html'],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins:{
    preflight: false,
  }
}
