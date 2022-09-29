import React from "react";
import { render, screen } from "@testing-library/react";
import { List } from "./list.component";

describe("List component", () => {
  test(`the component renders correctly`, () => {
    render(<List contents={["one"]} />);
    expect(screen.getByText("one")).toBeTruthy();
  });
});
