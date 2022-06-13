const nextJest = require("next/jest");
const base = require("../../jest.config");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  ...base,
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["./set-up-tests.js"],
};

module.exports = createJestConfig(customJestConfig);
