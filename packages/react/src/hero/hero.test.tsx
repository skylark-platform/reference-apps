import React from "react";
import { render, screen } from "@testing-library/react";
import { Hero } from "./hero.component";

describe("Hero component", () => {
  it("the component renders children correctly", () => {
    render(<Hero bgImage="image">{`Child`}</Hero>);
    expect(screen.getByText(/Child/)).toBeTruthy();
  });
});
