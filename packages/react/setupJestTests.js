// Extend Jest "expect" functionality with Testing Library assertions.
// eslint-disable-next-line import/no-extraneous-dependencies
import "@testing-library/jest-dom/jest-globals";

// eslint-disable-next-line global-require, @typescript-eslint/no-unsafe-return, import/no-extraneous-dependencies
jest.mock("next/router", () => require("next-router-mock"));
