import React from "react";
import { render, screen } from "@testing-library/react";
import { AppHeader } from "./app-header.component";

describe("AppHeader component", () => {
  it("the component renders correctly", () => {
    render(
      <AppHeader
        activeHref="/"
        links={[{ text: "Home", href: "/homepage", icon: <></> }]}
        search={{
          text: "Search",
          onClick: () => "",
          icon: <></>,
          isMobileOnly: true,
        }}
      >
        {`test title`}
      </AppHeader>,
    );
    expect(screen.getByText("test title")).toBeTruthy();
    expect(screen.getByText("Home").closest("a")).toHaveProperty(
      "href",
      "http://localhost/homepage",
    );
  });
});
