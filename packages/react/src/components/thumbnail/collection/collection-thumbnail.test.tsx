import React from "react";
import { render, screen } from "@testing-library/react";
import { CollectionThumbnail } from "./collection-thumbnail.component";

describe("CollectionThumbnail component", () => {
  it("the component renders correctly", () => {
    render(
      <CollectionThumbnail
        backgroundImage=""
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
