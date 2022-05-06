import React from "react";
import { render, screen } from "@testing-library/react";
import { InformationPanel } from "./information-panel.component";

describe("InformationPanel component", () => {
  it("the component renders correctly", () => {
    render(
      <InformationPanel
        ageRange="18+"
        availableUntil={12}
        description="Series Premiere. Lord Stark is troubled by disturbing reports from a Night's Watch deserter."
        duration={57}
        episode="1. Winter is Coming"
        genres={["Drama", "Mythical", "Based on a book"]}
        season={1}
        show="Game of Thrones"
      />
    );
    expect(screen.getByText(/Game of Thrones/)).toBeTruthy();
    expect(screen.getByText(/1. Winter is Coming/)).toBeTruthy();
  });
});
