import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Thumbnail } from "./thumbnail.component";

describe("Media Item component", () => {
  it("the component renders correctly", () => {
    render(<Thumbnail />);
    expect(screen.getByRole("button")).toHaveProperty("type", "button");
  });

  it("the component renders correctly with text and no icon", () => {
    render(<Thumbnail text="button name" />);
    expect(screen.getByText(/button name/i)).toBeTruthy();
  });

  it("fires the onClick event", () => {
    const onClick = jest.fn();
    render(<Thumbnail text="click me" onClick={onClick} />);

    fireEvent.click(screen.getByText(/click me/i));
    expect(onClick).toBeCalled();
  });
});
