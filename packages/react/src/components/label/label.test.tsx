import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Label } from "./label.component";

describe("Label component", () => {
  it("the component renders correctly", () => {
    render(<Label />);
    expect(screen.getByRole("button")).toHaveProperty("type", "button");
  });

  it("the component renders correctly with text and no icon", () => {
    render(<Label text="button name" />);
    expect(screen.getByText(/button name/i)).toBeTruthy();
  });

  it("fires the onClick event", () => {
    const onClick = jest.fn();
    render(<Label text="click me" onClick={onClick} />);

    fireEvent.click(screen.getByText(/click me/i));
    expect(onClick).toBeCalled();
  });
});
