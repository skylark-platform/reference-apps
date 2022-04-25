import React from "react";
import { render, screen } from "@testing-library/react";
import { DimensionSettings } from "./dimension-settings.component";

describe("Dimension Settings component", () => {
  it("the dimension settings component renders correctly", () => {
    render(<DimensionSettings />);
    expect(screen.getByText(/Demo v1.0/)).toBeTruthy();
    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      "mailto:hello@skylarkplatform.com?subject=Enquiry%20from%20demo%20app"
    );
  });
});
