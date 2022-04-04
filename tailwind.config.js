module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/react/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
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
      },
      fontFamily: {
        display: "Outfit",
        body: "Inter",
      },
    },
  },
  plugins: [],
};
