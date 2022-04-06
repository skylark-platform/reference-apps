import React from "react";
import { render, screen } from "@testing-library/react";
import { Overline, OverlineLevel } from "./overline.component";

const levels: OverlineLevel[] = [1, 2];

describe("Overline components", () => {
  levels.forEach((level) => {
    it(`the overline ${level} component renders correctly`, () => {
      render(<Overline level={level}>{`Overline ${level}`}</Overline>);
      expect(screen.getByText(`Overline ${level}`)).toBeTruthy();
    });
  });
});
