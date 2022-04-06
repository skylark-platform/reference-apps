import { create } from "@storybook/theming";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";

export default create({
  base: "light",
  brandTitle: "Skylark Reference Apps Storybook",
  brandUrl: "https://skylarkplatform.com",
  brandImage: "/skylarklogo.png",

  colorPrimary: "#226DFF",
  // colorSecondary: 'deepskyblue',

  // UI
  appBg: "#F6F8FB",
  appContentBg: "#FFF",
  appBorderColor: "#E5E9EF",
  appBorderRadius: 10,

  // Typography
  fontBase: '"Inter", "Open Sans", sans-serif',
  fontCode: "monospace",

  // Text colors
  textColor: "#0e1825",
  // textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: "silver",
  // barSelectedColor: 'black',
  // barBg: 'hotpink',

  // Form colors
  // inputBg: 'white',
  inputBorder: "#E5E9EF",
  inputTextColor: "#0e1825",
  // inputBorderRadius: 4,
});
