import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./button.component";

describe("Label component", () => {
  it("the component renders correctly", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toHaveProperty("type", "submit");
  });

  it("the component renders correctly with text and no icon", () => {
    render(<Button text="button name" />);
    expect(screen.getByText(/button name/i)).toBeTruthy();
  });

  it("fires the onClick event", () => {
    const onClick = jest.fn();
    render(<Button text="click me" onClick={onClick} />);

    fireEvent.click(screen.getByText(/click me/i));
    expect(onClick).toHaveBeenCalled();
  });
});
