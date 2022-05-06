import React from "react";
import { render, screen } from "@testing-library/react";
import { InformationPanel } from "./information-panel.component";

const content = [
  {
    show: "Game of Thrones",
    season: 1,
    episode: "1. Winter is Coming",
    duration: 57,
    ageRange: "18+",
    availableUntil: 12,
    description:
      "Series Premiere. Lord Stark is troubled by disturbing reports from a Night's Watch deserter.",
    genres: ["Drama", "Mythical", "Based on a book"],
  },
];

describe("InformationPanel component", () => {
  it("the component renders correctly", () => {
    render(<InformationPanel content={content} />);
    expect(screen.getByText(/Game of Thrones/)).toBeTruthy();
    expect(screen.getByText(/1. Winter is Coming/)).toBeTruthy();
  });
});
