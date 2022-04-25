import React from "react";
import { render, screen } from "@testing-library/react";
import { SkylarkBranding } from "./skylark-branding.component";

describe("Skylark Branding component", () => {
  it("the component renders correctly", () => {
    render(<SkylarkBranding />);
    expect(screen.getByTitle("Skylark Logo")).toBeTruthy();
    expect(screen.getByTitle("Skylark Logo With Text")).toBeTruthy();
  });
});
