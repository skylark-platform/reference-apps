const base = require("../../jest.config");

module.exports = {
  ...base,
  setupFilesAfterEnv: ["./setupJestTests.js"],
};
