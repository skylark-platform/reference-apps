import React from "react";
import { render, screen } from "@testing-library/react";
import { BrandHeader } from "./brand-header.component";

describe("BrandHeader component", () => {
  it("the component renders correctly", () => {
    render(
      <BrandHeader
        ageRange={"18+"}
        brand={"Game of Thrones"}
        description={
          "Summers span decades. Winters can last a lifetime. And the struggle for the Iron Throne begins"
        }
        numberOfSeasons={8}
        releaseYear={2011}
      />
    );
    expect(screen.getByText(/Game of Thrones/)).toBeTruthy();
    expect(screen.getByText(/8 Seasons/)).toBeTruthy();
  });
});
