import React from "react";
import { render, screen } from "@testing-library/react";
import { EpisodeThumbnail } from "./episode-thumbnail.component";

describe("EpisodeThumbnail component", () => {
  it("the component renders correctly", () => {
    render(
      <EpisodeThumbnail
        backgroundImage=""
        description="a description"
        href="http://localhost/some-href"
        number={1000}
        title="Episode"
      />
    );
    expect(screen.getByText(/Episode/)).toBeTruthy();
    expect(screen.getByText("a description")).toBeTruthy();
    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      "http://localhost/some-href"
    );
  });
});
