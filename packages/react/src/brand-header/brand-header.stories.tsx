import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrandHeader } from "./brand-header.component";

export default {
  title: "React/BrandHeader",
  component: BrandHeader,
} as ComponentMeta<typeof BrandHeader>;

const Template: ComponentStory<typeof BrandHeader> = (args) => (
  <div className="bg-gray-900">
    <BrandHeader {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: "Game of Thrones",
  numberOfSeasons: 8,
  releaseDate: "2011",
  rating: "18+",
  description:
    "Summers span decades. Winters can last a lifetime. And the struggle for the Iron Throne begins.",
};
