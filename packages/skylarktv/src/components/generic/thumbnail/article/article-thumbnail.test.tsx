import React from "react";
import { render, screen } from "@testing-library/react";
import { ArticleThumbnail } from "./article-thumbnail.component";

describe("ArticleThumbnail component", () => {
  it("the component renders correctly", () => {
    render(
      <ArticleThumbnail
        backgroundImage=""
        description=""
        href="http://localhost/some-href"
        title="Collection"
      />,
    );
    expect(screen.getByText("Collection")).toBeTruthy();
    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      "http://localhost/some-href",
    );
  });
});
