module.exports = {
  stories: ["../../../packages/react/**/*.stories.(js|jsx|ts|tsx)"],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
  typescript: {
    reactDocgen: false,
  },
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "storybook-addon-pseudo-states",
    "@storybook/addon-styling",
  ],
};
