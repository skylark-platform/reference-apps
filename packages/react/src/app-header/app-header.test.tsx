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
    expect(screen.getByText("test title").closest("a")).toHaveProperty(
      "href",
      "http://localhost/"
    );
    expect(screen.getByText("Home").closest("a")).toHaveProperty(
      "href",
      "http://localhost/homepage"
    );
  });
});
