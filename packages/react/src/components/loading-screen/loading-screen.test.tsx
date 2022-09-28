import React from "react";
import { render, screen } from "../../../test-utils";
import { LoadingScreen } from "./loading-screen.component";

describe("LoadingScreen component", () => {
  it("the component renders correctly", () => {
    render(<LoadingScreen show title="StreamTV" />);
    // eslint-disable-next-line no-restricted-syntax
    for (const char of "StreamTV") {
      expect(screen.getByText(char)).toBeTruthy();
    }
    expect(screen.getByText("By Skylark")).toBeTruthy();
  });
});
