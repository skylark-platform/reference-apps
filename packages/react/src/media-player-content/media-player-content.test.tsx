import React from "react";
import { render, screen } from "@testing-library/react";
import { MediaPlayerContent } from "./media-player-content.component";

describe("MediaPlayerContent component", () => {
  it("the component renders correctly when inProgress is true", () => {
    render(
      <MediaPlayerContent
        episodeName="Winter is Coming"
        episodeNumber={1}
        inProgress={true}
        season={1}
      />
    );
    expect(screen.getByText(/Start Watching/)).toBeTruthy();
    expect(screen.getByText(/S1 : E1 - Winter is Coming/)).toBeTruthy();
  });

  it("the component renders correctly when inProgress is false", () => {
    render(
      <MediaPlayerContent
        episodeName="Winter is Coming"
        episodeNumber={1}
        inProgress={false}
        season={1}
      />
    );
    expect(screen.getByText(/Pause Watching/)).toBeTruthy();
    expect(screen.getByText(/S1 : E1 - Winter is Coming/)).toBeTruthy();
  });
});
