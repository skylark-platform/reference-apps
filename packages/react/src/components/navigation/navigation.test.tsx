import React from "react";
import { render, screen } from "@testing-library/react";
import { Navigation } from "./navigation.component";

describe("Navigation component", () => {
  it("the component renders correctly", () => {
    render(
      <Navigation
        activeHref="/"
        defaultOpen
        links={[{ text: "JW", href: "/homepage" }]}
      />,
    );
    expect(screen.getByRole("link")).toHaveProperty(
      "href",
      "http://localhost/homepage",
    );
  });
});
