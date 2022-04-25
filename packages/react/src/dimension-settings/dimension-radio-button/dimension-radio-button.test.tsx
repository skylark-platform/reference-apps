import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { DimensionRadioButton } from "./dimension-radio-button.component";

describe("Skylark Branding component", () => {
  it("the component renders correctly", () => {
    render(
      <DimensionRadioButton options={["radio test"]} onChange={jest.fn} />
    );
    expect(screen.getByText(/radio test/i)).toBeTruthy();
  });

  it("fires the onChange event", () => {
    const onChange = jest.fn();
    render(
      <DimensionRadioButton
        options={["test", "another test"]}
        onChange={onChange}
      />
    );
    fireEvent.click(screen.getByText(/another test/i));
    expect(onChange).toBeCalledWith("another test");
  });
});
