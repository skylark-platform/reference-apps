import React from "react";
import { render, screen } from "../../../test-utils";
import { Header } from "./header.component";

describe("Header component", () => {
  it("the component renders correctly", () => {
    render(
      <Header
        description={
          "Summers span decades. Winters can last a lifetime. And the struggle for the Iron Throne begins"
        }
        numberOfItems={8}
        rating={"18+"}
        releaseDate={"2011"}
        title={"Game of Thrones"}
        typeOfItems={"season"}
      />,
    );
    expect(screen.getByText(/Game of Thrones/)).toBeTruthy();
    expect(screen.getByText(/8 Seasons/)).toBeTruthy();
  });
});
