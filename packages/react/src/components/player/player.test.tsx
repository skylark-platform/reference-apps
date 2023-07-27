import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Player } from "./player.component";

describe("Player component", () => {
  it("the component renders with source", async () => {
    render(<Player src="something.mp4" videoId="1" videoTitle="Title" />);
    await waitFor(() => {
      expect(screen.getByTestId("player")).toHaveProperty(
        "src",
        "http://localhost/something.mp4"
      );
    });
  });
});
