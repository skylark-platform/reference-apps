import React from "react";
import { render, screen } from "@testing-library/react";
import { BlockComponent } from "./block";
import { Block, BlockType } from "../../types/gql";

const block: Block = {
  uid: "1",
  type: BlockType.Generic,
  title: "title",
  copy: "<p>some copy</p>",
};

test("converts HTML to a text string", () => {
  render(<BlockComponent block={block} />);
  expect(screen.getByText("some copy")).toBeInTheDocument();
  expect(screen.getByText("some copy").parentElement).toHaveAttribute(
    "class",
    "skylark-wysiwyg",
  );
  expect(screen.queryByText("<p>")).not.toBeInTheDocument();
});
