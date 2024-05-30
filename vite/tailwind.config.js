/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
module.exports = {
  content: [
    "./packages/**/*.{vue,js,ts,jsx,tsx}",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // 这是ttapp样式补全代码
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".tt-error": {
          color: "var(--tt-error-color)",
        },
        ".tt-success": {
          color: "var(--tt-success-color)",
        },
        ".tt-warning": {
          color: "var(--tt-warning-color)",
        },
        ".tt-link": {
          color: "var(--tt-link-color)",
        },
        ".tt-theme": {
          color: "var(--tt-theme-color)",
        },
        ".tt-theme-2": {
          color: "var(--tt-theme-secondary-color)",
        },
        ".tt-theme-bg": {
          background: "var(--tt-theme-color)",
        },
        ".tt-theme-bg-2": {
          background: "var(--tt-theme-secondary-color)",
        },
        ".tt-no-bg": {
          background: "none !important",
        },
        ".tt-bg": {
          background: "var(--tt-primary-color)",
        },
        ".tt-bg-2": {
          background: "var(--tt-secondary-color)",
        },
        ".tt-bg-2-t": {
          background: "var(--tt-secondary-transparent-color)",
        },
        ".tt-text": {
          color: "var(--tt-primary-text-color)",
        },
        ".tt-text-2": {
          color: "var(--tt-secondary-text-color)",
        },
        ".tt-text-3": {
          color: "var(--tt-disable-text-color)",
        },
        ".tt-modal-bg": {
          background: "var(--tt-modal-color)",
        },
        ".tt-mask-bg": {
          background: "var(--tt-mask-color)",
        },
        ".tt-main-bg": {
          background: "var(--tt-main-color)",
        },
        ".tt-border": {
          "border-color": "var(--tt-primary-border-color)",
        },
        ".tt-shadow": {
          "box-shadow": "0px 0px 10px 0px rgb(0 0 0 / 50%)",
          "backdrop-filter": "blur(50px)",
          "webkit-backdrop-filter": "-webkit-backdrop-filter: blur(50px)",
        },
      });
    }),
  ],
  corePlugins: {
    preflight: false,
  },
};
