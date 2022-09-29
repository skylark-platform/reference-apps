import React from "react";
import { act } from "react-dom/test-utils";
import { fireEvent, render, screen } from "../../../test-utils";
import { Carousel } from "./carousel.component";
import { heros } from "./carousel.fixtures";

describe("Carousel component", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("the component renders correctly", () => {
    render(<Carousel items={heros} />);
    expect(screen.getByText(heros[0].title)).toBeTruthy();
    expect(
      screen.getByText("30 day free trial available. £12.99/mo after.")
    ).toBeTruthy();
    expect(screen.getByText("Watch for free")).toBeTruthy();
  });

  it("the image changes when a CarouselButton is clicked", () => {
    render(<Carousel items={heros} />);
    const [, secondElButton] = screen.queryAllByTestId("carousel-button");
    expect(screen.getByText(heros[0].title)).toBeTruthy();
    fireEvent.click(secondElButton);
    expect(screen.getByText(heros[1].title)).toBeTruthy();
  });

  it("the image changes when the changeInterval is reached", () => {
    render(<Carousel changeInterval={4} items={heros} />);
    expect(screen.getByText(heros[0].title)).toBeTruthy();
    act(() => {
      jest.runOnlyPendingTimers();
    });

    expect(screen.getByText(heros[1].title)).toBeTruthy();
  });
});
