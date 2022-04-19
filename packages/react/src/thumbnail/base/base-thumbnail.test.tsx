import React from "react";
import { render, screen } from "@testing-library/react";
import { BaseThumbnail } from "./base-thumbnail.component";

describe("BaseThumbnail component", () => {
  it("the component renders correctly", () => {
    render(
      <BaseThumbnail
        backgroundImage=""
        contentLocation="inside"
        href="http://localhost/some-href"
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
