import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import { Header } from "./header.component";

export default {
  title: "React/Header",
  component: Header,
} as Meta<typeof Header>;

const Template: StoryFn<typeof Header> = (args) => (
  <div className="bg-gray-900" dir="ltr">
    <Header {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: "Game of Thrones",
  numberOfItems: 8,
  typeOfItems: "season",
  releaseDate: "2011",
  rating: "18+",
  description:
    "Summers span decades. Winters can last a lifetime. And the struggle for the Iron Throne begins.",
  tags: ["New release every week"],
};
