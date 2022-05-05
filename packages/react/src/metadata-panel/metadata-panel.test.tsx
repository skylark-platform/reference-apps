import React from "react";
import { render, screen } from "@testing-library/react";
import { MdArrowDropDownCircle, MdCalendarToday } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { MetadataPanel } from "./metadata-panel.component";

const content = [
  {
    icon: <MdArrowDropDownCircle />,
    header: "Key Cast",
    body: "Michelle Fairley, Lena Headey, Emilia Clarke, Iain Glen, Harry Lloyd ",
  },
  {
    icon: <MdArrowDropDownCircle />,
    header: "Producers",
    body: [
      "Mark Huffam",
      "Carolyn Strauss",
      "Joanna Burn",
      "Frank Doelger",
      "Guymon Casady",
    ],
  },
  {
    icon: <FaPen />,
    header: "Writers",
    body: "Mark Huffam, Carolyn Strauss, Joanna Burn, Frank Doelger, Guymon Casady",
  },
  {
    icon: <MdCalendarToday />,
    header: "Realeased",
    body: "10 April 2011",
  },
];

describe("MetadataPanel component", () => {
  it("the component renders correctly", () => {
    render(<MetadataPanel content={content} />);
    expect(screen.getByText(/Key Cast/)).toBeTruthy();
    expect(screen.getByText(/10 April 2011/)).toBeTruthy();
  });
});
