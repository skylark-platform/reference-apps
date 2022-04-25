import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SkylarkBranding } from "../skylark-branding";
import { DimensionContent } from "./dimension-content";
import { DimensionRadioButton } from "./dimension-radio-button";
import { DimensionToggle } from "./dimension-toggle";

describe("Skylark Branding component", () => {
  it("the component renders correctly", () => {
    render(<SkylarkBranding />);
    expect(screen.getByTitle("Skylark Logo")).toBeTruthy();
    expect(screen.getByTitle("Skylark Logo With Text")).toBeTruthy();
  });

  it("the dimension component renders correctly", () => {
    render(
      <DimensionContent label={"label one"}>{`children`}</DimensionContent>
    );
    expect(screen.getByText("label one")).toBeTruthy();
    expect(screen.getByText("children")).toBeTruthy();
  });

  it("the dimension radio component renders correctly", () => {
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

  it("the dimension toggle component renders correctly", () => {
    const onClick = jest.fn();
    render(<DimensionToggle onClick={onClick} />);
    expect(screen.getByRole("button")).toHaveProperty("type", "submit");
  });
});
