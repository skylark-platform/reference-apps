import React from "react";
import { render, screen } from "@testing-library/react";
import { DimensionContent } from "./dimension-content.component";

describe("Skylark Branding component", () => {
  it("the component renders correctly", () => {
    render(
      <DimensionContent label={"label one"}>{`children`}</DimensionContent>
    );
    expect(screen.getByText("label one")).toBeTruthy();
    expect(screen.getByText("children")).toBeTruthy();
  });
});
