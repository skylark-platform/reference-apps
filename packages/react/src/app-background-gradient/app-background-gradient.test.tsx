import React from "react";
import { render } from "@testing-library/react";
import { AppBackgroundGradient } from "./app-background-gradient.component";

describe("AppBackgroundGradient component", () => {
  it("the component renders correctly", () => {
    expect(render(<AppBackgroundGradient />)).toBeTruthy();
  });
});
