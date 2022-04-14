import React from "react";
import { render, screen } from "@testing-library/react";
import { Thumbnail } from "./thumbnail.component";

describe("Thumbnail component", () => {
  it("the component renders correctly", () => {
    render(
      <Thumbnail
        backgroundImage=""
        href="http://localhost/some-href"
        id="1"
        title="A title"
      />
    );
    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      "http://localhost/some-href"
    );
    expect(screen.getByText("A title")).toBeTruthy();
  });
});
