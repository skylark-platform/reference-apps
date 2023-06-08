/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line import/no-extraneous-dependencies
const defaultTheme = require("tailwindcss/defaultTheme");
const formPlugin = require("@tailwindcss/forms");

export default {
  important: "#skylark-availability-modifier-root",
  // prefix: "tw-",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: "Work Sans",
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "nav-bar": "#F0F2F6",
        black: "#0E1825",
        "brand-primary": "#226DFF",
        manatee: {
          50: "#F6F8FB",
          100: "#F1F3F7",
          200: "#E6E9EF",
          300: "#BFC5CF",
          400: "#A8AFBD",
          500: "#8D96A7",
          600: "#6B7587",
          700: "#4E5868",
          800: "#2F3948",
          900: "#0E1825",
        },
      },
    },
  },
  plugins: [formPlugin],
};
