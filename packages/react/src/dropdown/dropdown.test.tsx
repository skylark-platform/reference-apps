import React from "react";
import { render, screen } from "@testing-library/react";
import { Dropdown } from "./dropdown.component";
import { Open } from "./dropdown.stories";

describe("Dropdown component", () => {
  it("the component renders correctly", () => {
    render(
      <Dropdown
        items={[
          "Action & Adventure",
          "Children & Family",
          "Comedy",
          "Drama",
          "Horror",
          "Romantic",
          "Sci-fi & Fantasy",
          "Sports",
          "Thrillers",
          "TV Shows",
        ]}
        text={"Genres"}
      />
    );
    expect(screen.getByText(/Genres/)).toBeTruthy();
    expect(screen.getAllByText(/Children & Family/)).toBeTruthy();
  });

  it("the component renders correctly while hovered", () => {
    render(
      <Open
        items={[
          "Action & Adventure",
          "Children & Family",
          "Comedy",
          "Drama",
          "Horror",
          "Romantic",
          "Sci-fi & Fantasy",
          "Sports",
          "Thrillers",
          "TV Shows",
        ]}
        text={"Genres"}
      />
    );
    expect(screen.getByText(/Genres/)).toBeTruthy();
    expect(screen.findByDisplayValue(/Sci-fi & Fantasy/)).toBeTruthy();
  });
});
