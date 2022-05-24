import React from "react";
import { render, screen } from "@testing-library/react";
import { fireEvent } from "@storybook/testing-library";
import { Dropdown } from "./dropdown.component";

describe("Dropdown component", () => {
  it("the component renders correctly while clicked", () => {
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
        label={"Genres"}
      />
    );
    expect(screen.getByText(/Genres/)).toBeTruthy();
    expect(screen.queryByText(/Sci-fi & Fantasy/)).toBeNull();
    fireEvent.click(screen.getByText(/Genres/i));
    expect(screen.getByText(/Sci-fi & Fantasy/)).toBeTruthy();
  });

  it("the component renders correctly while hovering", () => {
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
        label={"Genres"}
      />
    );
    expect(screen.getByText(/Genres/)).toBeTruthy();
    expect(screen.queryByText(/Children & Family/)).toBeNull();
    fireEvent.mouseOver(screen.getByText(/Genres/i));
    expect(screen.getAllByText(/Children & Family/)).toBeTruthy();
  });
});
