import React from "react";
import { render, screen } from "../../test-utils";
import { CallToAction } from "./call-to-action.component";

describe("CallToAction component", () => {
  it("the component renders correctly when inProgress is false", () => {
    render(
      <CallToAction
        episodeNumber={1}
        episodeTitle="Winter is Coming"
        href="/"
        inProgress={false}
        seasonNumber={1}
      />
    );
    expect(screen.getByText(/Start Watching/)).toBeTruthy();
    expect(screen.getByText(/Winter is Coming/)).toBeTruthy();
  });

  it("the component renders correctly when inProgress is true", () => {
    render(
      <CallToAction
        episodeNumber={1}
        episodeTitle="Winter is Coming"
        href="/"
        inProgress={true}
        seasonNumber={1}
      />
    );
    expect(screen.getByText(/Continue Watching/)).toBeTruthy();
    expect(screen.getByText(/Winter is Coming/)).toBeTruthy();
  });
});
