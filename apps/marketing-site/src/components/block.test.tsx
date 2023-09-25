import React from "react";
import { render, screen } from "@testing-library/react";
import { BlockComponent } from "./block";
import {
  Block,
  BlockType,
  CallToAction,
  CallToActionType,
  ImageType,
  SkylarkImage,
} from "../../types/gql";

const block: Block = {
  uid: "1",
  type: BlockType.Generic,
  title: "block title",
  copy: "<p>some copy</p>",
};

test("renders the GenericBlock component when the Block type is Generic", () => {
  render(<BlockComponent block={block} />);

  expect(screen.getByTestId("generic-block")).toBeInTheDocument();

  expect(screen.getByText("some copy")).toBeInTheDocument();
  expect(screen.getByText("some copy").parentElement).toHaveAttribute(
    "class",
    "skylark-wysiwyg",
  );
  expect(screen.queryByText("<p>")).not.toBeInTheDocument();
});

test("renders CTA buttons and images when they exist the type is Generic", () => {
  const cta: CallToAction = {
    uid: "cta-1",
    type: CallToActionType.ScrollToId,
    button_text: "call to action",
  };

  const image: SkylarkImage = {
    uid: "image-1",
    type: ImageType.Main,
    title: "my image",
    url: "http://image.com",
  };

  const blockWithRelationships: Block = {
    ...block,
    call_to_actions: {
      objects: [cta],
    },
    images: {
      objects: [image],
    },
  };

  render(<BlockComponent block={blockWithRelationships} />);

  expect(screen.getByTestId("generic-block")).toBeInTheDocument();

  expect(screen.getByRole("button")).toHaveTextContent(
    cta.button_text as string,
  );

  expect(screen.getByAltText(image.title as string)).toBeInTheDocument();
});

test("renders the ImageRailBlock component when the Block type is ImageRail", () => {
  render(<BlockComponent block={{ ...block, type: BlockType.ImageRail }} />);

  expect(screen.getByTestId("image-rail-block")).toBeInTheDocument();

  expect(screen.getByText(block.title as string)).toBeInTheDocument();
});

test("renders images when they exist and the type is ImageRail", () => {
  const image: SkylarkImage = {
    uid: "image-1",
    type: ImageType.Main,
    title: "my image",
    url: "http://image.com",
  };

  const image2: SkylarkImage = {
    ...image,
    uid: "image-2",
    title: "image 2",
  };

  const blockWithRelationships: Block = {
    ...block,
    type: BlockType.ImageRail,
    images: {
      objects: [image, image2],
    },
  };

  render(<BlockComponent block={blockWithRelationships} />);

  expect(screen.getByTestId("image-rail-block")).toBeInTheDocument();

  expect(screen.getByAltText(image.title as string)).toBeInTheDocument();
  expect(screen.getByAltText(image2.title as string)).toBeInTheDocument();
});

test("renders the AccordionBlock component when the Block type is Accordion", () => {
  render(<BlockComponent block={{ ...block, type: BlockType.Accordian }} />);

  expect(screen.getByTestId("accordion-block")).toBeInTheDocument();

  expect(screen.getByText(block.title as string)).toBeInTheDocument();
});

test("renders the no components when the Block type is a random string", () => {
  render(<BlockComponent block={{ ...block, type: "randomstring" }} />);

  expect(screen.queryByTestId("generic-block")).not.toBeInTheDocument();
  expect(screen.queryByTestId("accordion-block")).not.toBeInTheDocument();
  expect(screen.queryByTestId("image-rail-block")).not.toBeInTheDocument();
});
