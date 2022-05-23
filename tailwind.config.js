// The Tailwind config is used in app or package directories so we can safely ignore this error
// eslint-disable-next-line import/no-extraneous-dependencies
const plugin = require("tailwindcss/plugin");
// eslint-disable-next-line import/no-extraneous-dependencies
const lineClamp = require("@tailwindcss/line-clamp");
// eslint-disable-next-line import/no-extraneous-dependencies
const forms = require("@tailwindcss/forms");
// eslint-disable-next-line import/no-extraneous-dependencies
const aspectRatio = require("@tailwindcss/aspect-ratio");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        sub1: ["16px", "20px"],
        sub2: ["13px", "20px"],
        sub3: ["12px", "20px"],
        ol1: ["11px", "11px"],
        ol2: ["10px", "10px"],
      },
      colors: {
        "skylark-blue": "#226DFF",
        gray: {
          50: "#F7F7FC",
          100: "#F3F3FB",
          200: "#E9E9EF",
          300: "#D8D8E1",
          400: "#B4B4BD",
          500: "#95949D",
          600: "#6E6C74",
          800: "#3C3A41",
          900: "#1B1A20",
        },
        purple: {
          50: "#EDE8F9",
          100: "#D0C7F0",
          300: "#917CDE",
          400: "#7760D6",
          500: "#5B45CE",
          700: "#4138BE",
        },
        pink: {
          400: "#FF7E96",
          500: "#FF385C",
          600: "#D82646",
        },
        button: {
          primary: "#5B45CE",
          secondary: "rgba(104, 108, 119, 0.65)",
          hover: "#FF385C",
          disabled: "#F3F3FB",
          tertiary: "rgba(27, 26, 32, 0.25)",
        },
      },
      fontFamily: {
        display: "Outfit",
        body: "Outfit",
        "skylark-branding": "Inter",
      },
      spacing: {
        gutter: "0.5rem",
        "sm-gutter": "1rem",
        "md-gutter": "3rem",
        "lg-gutter": "5rem",
        "xl-gutter": "7rem",
        "mobile-header": "3.5rem",
      },
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  corePlugins: {
    aspectRatio: false,
  },
  plugins: [
    lineClamp,
    forms,
    aspectRatio,
    plugin(({ addUtilities }) => {
      addUtilities({
        ".hide-scrollbar": {
          /* IE and Edge */
          "-ms-overflow-style": "none",

          /* Firefox */
          "scrollbar-width": "none",

          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".bg-page-gradient": {
          "background-color": "var(--tw-gradient-to)",
          "background-image":
            "radial-gradient(circle 50vw at 50% -20vw, var(--tw-gradient-from), var(--tw-gradient-to))",
          "background-size": "100% 100%",
          "background-repeat": "no-repeat",
        },
      });
    }),
  ],
};
