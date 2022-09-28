import React from "react";
import { render, screen } from "@testing-library/react";
import { DimensionToggle } from "./dimension-toggle.component";

describe("Dimension Toggle component", () => {
  it("the component renders correctly", () => {
    const onClick = jest.fn();
    render(<DimensionToggle variant="close" onClick={onClick} />);
    expect(screen.getByRole("button")).toHaveProperty("type", "button");
  });
});
