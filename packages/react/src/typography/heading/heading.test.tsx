import React from "react";
import { render, screen } from "@testing-library/react";
import { Heading, HeadingLevel } from "./heading.component";

const levels: HeadingLevel[] = [1, 2, 3, 4, 5, 6];

describe("Heading components", () => {
  levels.forEach((level) => {
    it(`the H${level} component renders correctly`, () => {
      const { container } = render(
        <Heading level={level}>{`Heading ${level}`}</Heading>
      );
      expect(container.querySelector(`h${level}`)).toBeTruthy();
      expect(screen.getByText(`Heading ${level}`)).toBeTruthy();
    });
  });
});
