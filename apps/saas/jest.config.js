const nextJest = require("next/jest");
const base = require("../../jest.config");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  ...base,
};

module.exports = createJestConfig(customJestConfig);
