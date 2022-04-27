import React from "react";
import { render, screen } from "@testing-library/react";
import { NavigationToggle } from "./navigation-toggle.component";

describe("Navigation Toggle component", () => {
  it("the component renders correctly", () => {
    const onClick = jest.fn();
    render(<NavigationToggle variant="close" onClick={onClick} />);
    expect(screen.getByRole("button")).toHaveProperty("type", "button");
  });
});
