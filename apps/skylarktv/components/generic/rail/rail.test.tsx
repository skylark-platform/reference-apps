import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Rail } from "./rail.component";
import { MovieThumbnail } from "../thumbnail";
import { movieThumbnails } from "./rail.fixtures";

describe("Rail component", () => {
  it("the component renders correctly", () => {
    render(<Rail>{`Tenet`}</Rail>);
    expect(screen.getByText("Tenet")).toBeTruthy();
  });

  it("next and previous buttons not in document when there is only one thumbnail", () => {
    render(
      <Rail>
        <MovieThumbnail {...movieThumbnails[0]} />
      </Rail>,
    );
    expect(screen.queryByTestId(/previous-button/i)).toBeNull();
    expect(screen.queryByTestId(/forward-button/i)).toBeNull();
  });

  it("calls scrollTo when the forward-button is pressed", () => {
    window.HTMLElement.prototype.scrollTo = jest.fn();
    render(
      <Rail>
        {Array.from({ length: 20 }, (_, index) => index).map((text) => (
          <p key={text}>{text}</p>
        ))}
      </Rail>,
    );
    fireEvent.click(screen.getByTestId("forward-button"));
    expect(window.HTMLElement.prototype.scrollTo).toHaveBeenCalled();
  });
});
