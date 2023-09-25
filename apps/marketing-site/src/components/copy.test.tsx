import React from "react";
import { render, screen } from "@testing-library/react";
import { CopyComponent } from "./copy";

test("converts HTML to a text string", () => {
  render(<CopyComponent copy={"<p>my text</p>"} />);
  expect(screen.queryByText("<p>")).toBeFalsy();
  expect(screen.getByText("my text")).toBeInTheDocument();
  expect(screen.getByText("my text").parentElement).toHaveAttribute(
    "class",
    "skylark-wysiwyg",
  );
});
