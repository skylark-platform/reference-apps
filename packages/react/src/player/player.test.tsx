import React from "react";
import { render, screen } from "@testing-library/react";
import { Player } from "./player.component";

describe("Player component", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, "error");
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("the component renders with source as undefined due to limitations with the Mux player", () => {
    render(<Player src="something.mp4" videoId="1" videoTitle="Title" />);
    expect(screen.getByTestId("player")).toHaveProperty("src", "");
    expect(consoleErrorSpy).toBeCalledWith(
      "It looks like the video you're trying to play will not work on this system! If possible, try upgrading to the newest versions of your browser or software."
    );
  });
});
