import React from "react";
import { render, screen } from "@testing-library/react";
import { StandardThumbnail } from "./standard-thumbnail.component";

describe("StandardThumbnail component", () => {
  it("the component renders correctly", () => {
    render(
      <StandardThumbnail
        backgroundImage=""
        href="http://localhost/some-href"
        subtitle="A Subtitle"
        title="Movie"
      />
    );
    expect(screen.getByText(/Movie/)).toBeTruthy();
    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      "http://localhost/some-href"
    );
  });
});
