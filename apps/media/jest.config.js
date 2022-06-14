const nextJest = require("next/jest");
const base = require("../../jest.config");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  ...base,
  setupFilesAfterEnv: ["./setup-jest.js"],
};

module.exports = createJestConfig(customJestConfig);
