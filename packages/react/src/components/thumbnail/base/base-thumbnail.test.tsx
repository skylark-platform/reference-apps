import React from "react";
import { render, screen } from "@testing-library/react";
import { BaseThumbnailWithLink } from "./base-thumbnail.component";

describe("BaseThumbnail component", () => {
  it("the component renders correctly", () => {
    render(
      <BaseThumbnailWithLink
        backgroundImage=""
        contentLocation="inside"
        href="http://localhost/some-href"
      />
    );
    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      "http://localhost/some-href"
    );
  });
});
