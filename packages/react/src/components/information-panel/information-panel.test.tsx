import React from "react";
import { render, screen } from "../../../test-utils";
import { InformationPanel } from "./information-panel.component";

describe("InformationPanel component", () => {
  it("the component renders correctly", () => {
    render(
      <InformationPanel
        availableUntil={12}
        description="Series Premiere. Lord Stark is troubled by disturbing reports from a Night's Watch deserter."
        duration={57}
        genres={["Drama", "Mythical", "Based on a book"]}
        parentTitle={"Game of Thrones"}
        rating="18+"
        seasonNumber={1}
        themes={["Action", "Adventure"]}
        title="1. Winter is Coming"
      />
    );
    expect(screen.getByText(/Game of Thrones/)).toBeTruthy();
    expect(screen.getByText(/1. Winter is Coming/)).toBeTruthy();
    expect(screen.getByText(/Drama/)).toBeTruthy();
    expect(screen.getByText(/Action/)).toBeTruthy();
    expect(screen.getByText("Available for 12 days")).toBeTruthy();
    expect(screen.getByText("Season 1")).toBeTruthy();
  });
});
