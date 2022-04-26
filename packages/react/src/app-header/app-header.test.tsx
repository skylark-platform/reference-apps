import React from "react";
import { render, screen } from "@testing-library/react";
import { AppHeader } from "./app-header.component";

describe("Navbar component", () => {
  it("the component renders correctly", () => {
    const onClick = jest.fn();
    render(<AppHeader title="test title" onClick={onClick} />);
    expect(screen.getByText(/test title/)).toBeTruthy();
  });
});
