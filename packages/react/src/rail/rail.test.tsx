import React from "react";
import { render, screen } from "@testing-library/react";
import { Rail } from "./rail.component";
import { thumbnails } from "./rail.fixtures";

describe("Rail component", () => {
  it("the component renders correctly", () => {
    render(<Rail thumbnails={thumbnails} />);
    expect(screen.getByText("Tenet")).toBeTruthy();
  });

  it("next and previous buttons not in document when there is only one thumbnail", () => {
    render(<Rail thumbnails={[thumbnails[0]]} />);
    expect(screen.queryByTestId(/previous-button/i)).toBeNull();
    expect(screen.queryByTestId(/next-button/i)).toBeNull();
  });
});
