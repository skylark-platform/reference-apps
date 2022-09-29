import React from "react";
import { render, screen } from "@testing-library/react";
import { Link } from "./link.component";

describe("Link component", () => {
  test(`the component renders correctly`, () => {
    render(<Link href="some-href">{"Link text"}</Link>);
    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      "http://localhost/some-href"
    );
  });
});
