import React from "react";
import { render, screen } from "@testing-library/react";
import { MovieThumbnail } from "./movie-thumbnail.component";

describe("MovieThumbnail component", () => {
  it("the component renders correctly", () => {
    render(
      <MovieThumbnail
        backgroundImage=""
        href="http://localhost/some-href"
        subtitle="A Subtitle"
        title="Movie"
      />
    );
    expect(screen.getByText("Movie")).toBeTruthy();
    expect(screen.getByText("A Subtitle")).toBeTruthy();
    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      "http://localhost/some-href"
    );
  });
});
