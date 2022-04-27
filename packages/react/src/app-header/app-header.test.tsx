import React from "react";
import { render, screen } from "@testing-library/react";
import { AppHeader } from "./app-header.component";

describe("AppHeader component", () => {
  it("the component renders correctly", () => {
    render(
      <AppHeader
        activeHref="/"
        links={[{ text: "Home", href: "/homepage" }]}
        title="test title"
      />
    );
    expect(screen.getByText(/test title/)).toBeTruthy();
    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      "http://localhost/homepage"
    );
  });
});
