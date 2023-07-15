import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Dropdown } from "./dropdown.component";

describe("Dropdown component", () => {
  const onChange = jest.fn();

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
        onChange={onChange}
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
        onChange={onChange}
      />
    );
    expect(screen.getByText(/Genres/)).toBeTruthy();
    expect(screen.queryByText(/Children & Family/)).toBeNull();
    fireEvent.mouseOver(screen.getByText(/Genres/i));
    expect(screen.getAllByText(/Children & Family/)).toBeTruthy();
  });

  it("the component renders correctly when genre is clicked", () => {
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
        onChange={onChange}
      />
    );
    expect(screen.getByText(/Genres/)).toBeTruthy();
    expect(screen.queryByTestId(/close-genre/)).toBeFalsy();
    fireEvent.mouseOver(screen.getByText(/Genres/i));
    fireEvent.click(screen.getByText(/Children & Family/i));
    expect(screen.getByTestId(/close-genre/)).toBeTruthy();
  });

  it("the component renders correctly when genre is cleared", () => {
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
        onChange={onChange}
      />
    );
    fireEvent.mouseOver(screen.getByText(/Genres/i));
    fireEvent.click(screen.getByText(/Children & Family/i));
    expect(screen.getByTestId(/close-genre/)).toBeTruthy();
    fireEvent.click(screen.getByTestId(/close-genre/));
    expect(screen.queryByTestId(/close-genre/)).toBeFalsy();
  });
});
