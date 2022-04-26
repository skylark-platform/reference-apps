import React from "react";
import { render, screen } from "@testing-library/react";
import { DimensionToggle } from "./dimension-toggle.component";

describe("Skylark Branding component", () => {
  it("the component renders correctly", () => {
    const onClick = jest.fn();
    render(<DimensionToggle iconDir="down" onClick={onClick} />);
    expect(screen.getByRole("button")).toHaveProperty("type", "button");
  });
});
