import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { BrandHeader } from "./brand-header.component";

export default {
  title: "React/BrandHeader",
  component: BrandHeader,
} as ComponentMeta<typeof BrandHeader>;

const Template: ComponentStory<typeof BrandHeader> = (args) => (
  <BrandHeader {...args} />
);

export const Default = Template.bind({});
Default.args = {
  show: "Game of Thrones",
  numberOfSeasons: 8,
  releaseYear: 2011,
  ageRange: "18+",
  description:
    "Summers span decades. Winters can last a lifetime. And the struggle for the Iron Throne begins",
};
