import React from "react";
import { render, screen } from "@testing-library/react";
import { TextThumbnail } from "./text-thumbnail.component";

describe("TextThumbnail component", () => {
  it("the component renders correctly", () => {
    render(
      <TextThumbnail text="There are no movies listed under this genre" />
    );
    expect(
      screen.getByText(/There are no movies listed under this genre/)
    ).toBeTruthy();
  });
});
