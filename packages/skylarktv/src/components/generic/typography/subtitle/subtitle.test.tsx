import React from "react";
import { render, screen } from "@testing-library/react";
import { Subtitle, SubtitleLevel } from "./subtitle.component";

const levels: SubtitleLevel[] = [1, 2, 3];

describe("Subtitle components", () => {
  levels.forEach((level) => {
    it(`the subtitle ${level} component renders correctly`, () => {
      render(<Subtitle level={level}>{`Subtitle ${level}`}</Subtitle>);
      expect(screen.getByText(`Subtitle ${level}`)).toBeTruthy();
      expect(screen.getByRole("doc-subtitle")).toBeTruthy();
    });
  });
});
