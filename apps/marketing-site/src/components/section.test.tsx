import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { SectionComponent } from "./section";
import {
  Block,
  BlockType,
  Section,
  SectionType,
  Testimonial,
} from "../../types/gql";

const block: Block = {
  uid: "1",
  type: BlockType.Generic,
  title: "block title",
  copy: "<p>some copy</p>",
};

const testimonial: Testimonial = {
  uid: "test-1",
  title: "testimonial title",
  copy: "<p>test copy</p>",
  description: "testimonial description",
  industry: "the industry",
};

const section: Section = {
  uid: "section-1",
  title: "Section 1",
  type: SectionType.Default,
  content: {
    objects: [{ object: block }],
  },
};

test("renders the DefaultSection component and block when the Section type is Default", () => {
  render(<SectionComponent section={section} />);

  expect(screen.getByTestId("default-section")).toBeInTheDocument();

  expect(screen.getByText("some copy")).toBeInTheDocument();
  expect(screen.getByText("some copy").parentElement).toHaveAttribute(
    "class",
    "skylark-wysiwyg",
  );
  expect(screen.queryByText("<p>")).not.toBeInTheDocument();
});

test("renders the Testimonials component and testimonials when the Section type is TestimonialCards", () => {
  render(
    <SectionComponent
      section={{
        ...section,
        type: SectionType.TestimonialCards,
        content: { objects: [{ object: testimonial }] },
      }}
    />,
  );

  expect(screen.getByTestId("testimonial-section")).toBeInTheDocument();

  expect(screen.getByText(testimonial.title as string)).toBeInTheDocument();
  expect(
    screen.getByText(testimonial.description as string),
  ).toBeInTheDocument();
  expect(screen.getByText(testimonial.industry as string)).toBeInTheDocument();
});

test("renders the VerticalTabsSection component, tabs and blocks when the Section type is TabsVertical", () => {
  const block2: Block = {
    ...block,
    title: "Block 2",
    uid: "block-2",
    copy: "<p>block 2 copy</p>",
  };

  render(
    <SectionComponent
      section={{
        ...section,
        type: SectionType.TabsVertical,
        content: { objects: [{ object: block }, { object: block2 }] },
      }}
    />,
  );

  expect(screen.getByTestId("vertical-tabs-section")).toBeInTheDocument();

  expect(screen.getByText(section.title as string)).toBeInTheDocument();

  expect(screen.getByText(block.title as string)).toBeInTheDocument();
  expect(screen.getAllByRole("button")).toHaveLength(2);

  const block1Button = screen.getAllByRole("button")[0];
  const block2Button = screen.getAllByRole("button")[1];

  expect(block1Button).toHaveTextContent(block.title as string);
  expect(block2Button).toHaveTextContent(block2.title as string);

  expect(screen.getByText("some copy")).toBeInTheDocument();
  expect(screen.queryByText("block 2 copy")).not.toBeInTheDocument();

  // Switch to another tab
  fireEvent.click(block2Button);

  expect(screen.getByText("block 2 copy")).toBeInTheDocument();
  expect(screen.queryByText("some copy")).not.toBeInTheDocument();
});

test("renders the no components when the Section type is a random string", () => {
  render(<SectionComponent section={{ ...section, type: "randomstring" }} />);

  expect(screen.queryByTestId("default-section")).not.toBeInTheDocument();
  expect(screen.queryByTestId("testimonial-section")).not.toBeInTheDocument();
  expect(screen.queryByTestId("vertical-tabs-section")).not.toBeInTheDocument();
});
