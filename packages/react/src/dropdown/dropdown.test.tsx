import React from "react";
import { render, screen } from "@testing-library/react";
import { Dropdown } from "./dropdown.component";

describe("Dropdown component", () => {
  it("the component renders correctly", () => {
    render(
      <Dropdown
        genres={[
          "Action & Adventure",
          "Children & Family",
          "Comedy",
          "Drama",
          "Horror",
          "Romantic",
          "Sci-fi & Fantasy",
          "Sports",
          "Thrillers",
          "Tv Shows",
        ]}
        text={"Genres"}
      />
    );
    expect(screen.getByText(/Genres/)).toBeTruthy();
    expect(screen.getAllByText(/Children & Family/)).toBeTruthy();
  });
});
